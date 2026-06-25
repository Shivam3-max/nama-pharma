<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);

$user = require_auth();
$b    = body();

$items         = $b['items']           ?? [];
$total         = (int)($b['total']     ?? 0);
$address       = $b['address']         ?? null;
$paymentMethod = $b['payment_method']  ?? 'online';
$razorpayId    = $b['razorpay_order_id'] ?? null;

if (empty($items) || $total <= 0) json_out(['error' => 'Invalid order data'], 422);

$orderNumber = 'NP-' . strtoupper(substr(uniqid(), -6));

db()->prepare(
    'INSERT INTO orders (user_id, order_number, items, total, address, payment_method, razorpay_order_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)'
)->execute([
    $user['id'],
    $orderNumber,
    json_encode($items),
    $total,
    $address ? json_encode($address) : null,
    $paymentMethod,
    $razorpayId,
]);

$orderId = (int) db()->lastInsertId();

json_out([
    'order' => [
        'id'           => $orderId,
        'order_number' => $orderNumber,
        'status'       => 'confirmed',
        'total'        => $total,
        'created_at'   => date('Y-m-d H:i:s'),
    ],
]);
