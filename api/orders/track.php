<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

// Public endpoint — no auth needed, but requires order_number + email to prevent fishing
$b           = body();
$orderNumber = strtoupper(trim($b['order_number'] ?? ''));
$email       = strtolower(trim($b['email']        ?? ''));

if (!$orderNumber || !$email) json_out(['error' => 'Order number and email are required'], 422);

$pdo  = db();
$stmt = $pdo->prepare(
    'SELECT o.order_number, o.items, o.total, o.status, o.payment_method, o.created_at, o.address
     FROM orders o JOIN users u ON u.id = o.user_id
     WHERE o.order_number = ? AND u.email = ?'
);
$stmt->execute([$orderNumber, $email]);
$order = $stmt->fetch();

if (!$order) json_out(['error' => 'No order found with this order number and email combination.'], 404);

$order['items']   = json_decode($order['items'], true);
$order['address'] = json_decode($order['address'], true);

// Map status to user-friendly tracking steps
$steps = [
    'confirmed'  => 1,
    'processing' => 2,
    'shipped'    => 3,
    'out_for_delivery' => 4,
    'delivered'  => 5,
    'cancelled'  => 0,
];

json_out(['order' => $order, 'step' => $steps[$order['status']] ?? 1]);
