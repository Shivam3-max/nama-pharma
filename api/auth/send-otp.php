<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);

$b     = body();
$phone = preg_replace('/\D/', '', $b['phone'] ?? '');

if (strlen($phone) < 10) json_out(['error' => 'Enter a valid phone number'], 422);
// Ensure Indian format (10 digits without country code, or with +91)
$phone10 = strlen($phone) === 12 && str_starts_with($phone, '91') ? substr($phone, 2) : $phone;
if (strlen($phone10) !== 10) json_out(['error' => 'Enter a valid 10-digit Indian phone number'], 422);

// Rate limit: max 3 OTPs per phone per 10 minutes
$pdo  = db();
$rate = $pdo->prepare("SELECT COUNT(*) FROM otps WHERE phone = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND used = 0");
$rate->execute([$phone10]);
if ($rate->fetchColumn() >= 3) json_out(['error' => 'Too many OTP requests. Please wait 10 minutes.'], 429);

// Delete previous unused OTPs for this phone
$pdo->prepare('DELETE FROM otps WHERE phone = ? AND used = 0')->execute([$phone10]);

$otp     = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
$expires = date('Y-m-d H:i:s', time() + 600); // 10 minutes
$pdo->prepare('INSERT INTO otps (phone, otp, expires_at) VALUES (?, ?, ?)')->execute([$phone10, $otp, $expires]);

// Send via MSG91
$ch = curl_init('https://api.msg91.com/api/v5/otp');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'authkey: ' . MSG91_AUTH_KEY],
    CURLOPT_POSTFIELDS     => json_encode([
        'template_id' => MSG91_TEMPLATE_ID,
        'mobile'      => '91' . $phone10,
        'authkey'     => MSG91_AUTH_KEY,
        'otp'         => $otp,
    ]),
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    // Clean up on failure
    $pdo->prepare('DELETE FROM otps WHERE phone = ? AND otp = ?')->execute([$phone10, $otp]);
    json_out(['error' => 'Failed to send OTP. Please try again.'], 500);
}

json_out(['ok' => true, 'phone' => $phone10]);
