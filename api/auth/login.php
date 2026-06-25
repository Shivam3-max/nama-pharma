<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);

$b        = body();
$email    = strtolower(trim($b['email']    ?? ''));
$password = $b['password'] ?? '';

if (!$email || !$password) json_out(['error' => 'Email and password are required'], 422);

$stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

// Use password_verify — timing-safe bcrypt check
if (!$user || !password_verify($password, $user['password_hash'])) {
    // Same error for both wrong email and wrong password (prevents enumeration)
    json_out(['error' => 'Invalid email or password'], 401);
}

// Issue new session token
$token   = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', time() + TOKEN_TTL);
db()->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')->execute([$user['id'], $token, $expires]);

json_out([
    'token' => $token,
    'user'  => [
        'id'    => $user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
    ],
]);
