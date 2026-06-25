<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);

$user   = require_auth();
$b      = body();
$id     = (int)($b['id']     ?? 0);
$status = $b['status'] ?? ''; // active | paused | cancelled

if (!$id || !in_array($status, ['active', 'paused', 'cancelled'])) json_out(['error' => 'Invalid request'], 422);

// Ensure subscription belongs to this user
$check = db()->prepare('SELECT id FROM subscriptions WHERE id = ? AND user_id = ?');
$check->execute([$id, $user['id']]);
if (!$check->fetch()) json_out(['error' => 'Subscription not found'], 404);

db()->prepare('UPDATE subscriptions SET status = ? WHERE id = ?')->execute([$status, $id]);

json_out(['ok' => true, 'status' => $status]);
