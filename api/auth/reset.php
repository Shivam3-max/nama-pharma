<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);

$b        = body();
$token    = trim($b['token']    ?? '');
$password = $b['password'] ?? '';

if (!$token)               json_out(['error' => 'Token is required'], 422);
if (strlen($password) < 6) json_out(['error' => 'Password must be at least 6 characters'], 422);

$pdo  = db();
$stmt = $pdo->prepare(
    'SELECT pr.user_id, u.email FROM password_resets pr
     JOIN users u ON u.id = pr.user_id
     WHERE pr.token = ? AND pr.expires_at > NOW() AND pr.used = 0'
);
$stmt->execute([$token]);
$row = $stmt->fetch();

if (!$row) json_out(['error' => 'Reset link is invalid or has expired. Please request a new one.'], 400);

$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
$pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$hash, $row['user_id']]);
$pdo->prepare('UPDATE password_resets SET used = 1 WHERE token = ?')->execute([$token]);

// Revoke all sessions so old password can't be used
$pdo->prepare('DELETE FROM sessions WHERE user_id = ?')->execute([$row['user_id']]);

// Issue new session
$newToken = bin2hex(random_bytes(32));
$expires  = date('Y-m-d H:i:s', time() + TOKEN_TTL);
$pdo->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')->execute([$row['user_id'], $newToken, $expires]);

$user = $pdo->prepare('SELECT id, name, email, phone FROM users WHERE id = ?');
$user->execute([$row['user_id']]);

json_out(['token' => $newToken, 'user' => $user->fetch()]);
