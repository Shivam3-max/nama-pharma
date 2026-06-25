<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';
require_once dirname(__DIR__) . '/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);

$user = require_auth();
$b    = body();

$productName = trim($b['product_name'] ?? '');
$variant     = trim($b['variant']      ?? '');
$quantity    = max(1, (int)($b['quantity']  ?? 1));
$price       = (int)($b['price']       ?? 0);
$frequency   = in_array($b['frequency'] ?? '', ['monthly','bimonthly','quarterly']) ? $b['frequency'] : 'monthly';
$address     = $b['address']           ?? null;

if (!$productName || $price <= 0) json_out(['error' => 'Invalid subscription data'], 422);

// Calculate next delivery date based on frequency
$days = ['monthly' => 30, 'bimonthly' => 60, 'quarterly' => 90];
$nextDelivery = date('Y-m-d', strtotime('+' . $days[$frequency] . ' days'));

db()->prepare(
    'INSERT INTO subscriptions (user_id, product_name, variant, quantity, price, frequency, status, next_delivery, address)
     VALUES (?, ?, ?, ?, ?, ?, "active", ?, ?)'
)->execute([$user['id'], $productName, $variant, $quantity, $price, $frequency, $nextDelivery, $address ? json_encode($address) : null]);

$subId = (int) db()->lastInsertId();

// Send confirmation email
$freqLabel = ['monthly' => 'Every Month', 'bimonthly' => 'Every 2 Months', 'quarterly' => 'Every 3 Months'];
$body = email_template('Subscription Confirmed!', "
  <p>Hi {$user['name']},</p>
  <p>Your subscription to <strong>$productName</strong> has been set up successfully.</p>
  <table style='width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;'>
    <tr><td style='padding:8px 0;color:#7A6952;border-bottom:1px solid #F0EBE1'>Product</td><td style='padding:8px 0;color:#1E1A14;font-weight:500;border-bottom:1px solid #F0EBE1'>$productName" . ($variant ? " ($variant)" : '') . "</td></tr>
    <tr><td style='padding:8px 0;color:#7A6952;border-bottom:1px solid #F0EBE1'>Quantity</td><td style='padding:8px 0;color:#1E1A14;font-weight:500;border-bottom:1px solid #F0EBE1'>$quantity</td></tr>
    <tr><td style='padding:8px 0;color:#7A6952;border-bottom:1px solid #F0EBE1'>Frequency</td><td style='padding:8px 0;color:#1E1A14;font-weight:500;border-bottom:1px solid #F0EBE1'>{$freqLabel[$frequency]}</td></tr>
    <tr><td style='padding:8px 0;color:#7A6952'>Next Delivery</td><td style='padding:8px 0;color:#C9A84C;font-weight:600'>$nextDelivery</td></tr>
  </table>
  <p>You can manage, pause, or cancel your subscription anytime from your account.</p>
  <p style='text-align:center;margin:24px 0'><a class='btn' href='" . SITE_URL . "/account'>Manage Subscriptions</a></p>
");
send_email($user['email'], 'Subscription confirmed — ' . $productName, $body);

json_out(['subscription' => ['id' => $subId, 'product_name' => $productName, 'status' => 'active', 'next_delivery' => $nextDelivery, 'frequency' => $frequency, 'price' => $price]]);
