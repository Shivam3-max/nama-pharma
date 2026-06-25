<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

$user = require_auth();

$stmt = db()->prepare(
    'SELECT id, order_number, items, total, address, payment_method, status, created_at
     FROM orders WHERE user_id = ? ORDER BY created_at DESC'
);
$stmt->execute([$user['id']]);
$rows = $stmt->fetchAll();

// Decode JSON columns
foreach ($rows as &$row) {
    $row['items']   = json_decode($row['items'],   true);
    $row['address'] = json_decode($row['address'], true);
}

json_out(['orders' => $rows]);
