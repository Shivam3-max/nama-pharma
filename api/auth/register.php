<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);

$b = body();
$name     = trim($b['name']     ?? '');
$email    = strtolower(trim($b['email']    ?? ''));
$password = $b['password'] ?? '';
$phone    = trim($b['phone']    ?? '');

if (!$name)                          json_out(['error' => 'Name is required'], 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_out(['error' => 'Invalid email'], 422);
if (strlen($password) < 6)           json_out(['error' => 'Password must be at least 6 characters'], 422);

$pdo = db();

// Check duplicate email
$chk = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$chk->execute([$email]);
if ($chk->fetch()) json_out(['error' => 'An account with this email already exists'], 409);

// Hash password with bcrypt — never stored plain
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

$ins = $pdo->prepare('INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)');
$ins->execute([$name, $email, $hash, $phone]);
$userId = (int) $pdo->lastInsertId();

// Create session token
$token = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', time() + TOKEN_TTL);
$pdo->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')->execute([$userId, $token, $expires]);

json_out([
    'token' => $token,
    'user'  => ['id' => $userId, 'name' => $name, 'email' => $email, 'phone' => $phone],
]);
