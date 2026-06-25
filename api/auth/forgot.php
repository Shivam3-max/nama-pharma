<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';
require_once dirname(__DIR__) . '/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);

$b     = body();
$email = strtolower(trim($b['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_out(['error' => 'Invalid email'], 422);

$pdo  = db();
$stmt = $pdo->prepare('SELECT id, name FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

// Always return success to prevent email enumeration
if (!$user) { json_out(['ok' => true]); }

// Delete old tokens for this user
$pdo->prepare('DELETE FROM password_resets WHERE user_id = ?')->execute([$user['id']]);

$token   = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour
$pdo->prepare('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)')->execute([$user['id'], $token, $expires]);

$resetLink = SITE_URL . '/reset-password?token=' . $token;
$body = email_template('Reset Your Password', "
  <p>Hi {$user['name']},</p>
  <p>We received a request to reset your Nama Pharma account password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
  <p style='text-align:center;margin:28px 0'><a class='btn' href='$resetLink'>Reset Password</a></p>
  <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
");
send_email($email, 'Reset your Nama Pharma password', $body);

json_out(['ok' => true]);
