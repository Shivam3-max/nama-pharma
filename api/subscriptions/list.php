<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

$user = require_auth();
$stmt = db()->prepare('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC');
$stmt->execute([$user['id']]);
$subs = $stmt->fetchAll();
foreach ($subs as &$s) { $s['address'] = json_decode($s['address'], true); }
json_out(['subscriptions' => $subs]);
