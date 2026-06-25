<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);

$b     = body();
$phone = preg_replace('/\D/', '', $b['phone'] ?? '');
$otp   = trim($b['otp'] ?? '');
$name  = trim($b['name'] ?? '');

$phone10 = strlen($phone) === 12 && str_starts_with($phone, '91') ? substr($phone, 2) : $phone;

if (!$otp || strlen($otp) !== 6) json_out(['error' => 'Enter the 6-digit OTP'], 422);

$pdo  = db();
$stmt = $pdo->prepare("SELECT * FROM otps WHERE phone = ? AND otp = ? AND expires_at > NOW() AND used = 0 ORDER BY id DESC LIMIT 1");
$stmt->execute([$phone10, $otp]);
$record = $stmt->fetch();

if (!$record) json_out(['error' => 'Invalid or expired OTP'], 400);

// Mark OTP used
$pdo->prepare('UPDATE otps SET used = 1 WHERE id = ?')->execute([$record['id']]);

// Find or create user by phone
$stmt = $pdo->prepare('SELECT * FROM users WHERE phone = ?');
$stmt->execute([$phone10]);
$user = $stmt->fetch();

if (!$user) {
    // Register new user via phone
    $displayName = $name ?: ('User ' . substr($phone10, -4));
    $pdo->prepare('INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)')
        ->execute([$displayName, $phone10 . '@phone.namapharma.com', password_hash(bin2hex(random_bytes(16)), PASSWORD_BCRYPT), $phone10]);
    $userId = (int) $pdo->lastInsertId();
    $user = ['id' => $userId, 'name' => $displayName, 'email' => '', 'phone' => $phone10];
}

// Issue session
$token   = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', time() + TOKEN_TTL);
$pdo->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')->execute([$user['id'], $token, $expires]);

json_out([
    'token' => $token,
    'user'  => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'phone' => $user['phone']],
]);
