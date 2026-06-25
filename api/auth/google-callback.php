<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/config.php';

function fail(string $msg): never {
    header('Location: ' . SITE_URL . '/login?error=' . urlencode($msg));
    exit;
}

// Validate state (CSRF protection)
$state       = $_GET['state']  ?? '';
$cookieState = $_COOKIE['oauth_state'] ?? '';
if (!$state || $state !== $cookieState) fail('Invalid state. Please try again.');
setcookie('oauth_state', '', time() - 1, '/');

$code = $_GET['code'] ?? '';
if (!$code) fail('Google login was cancelled.');

// Exchange code for access token
$ch = curl_init('https://oauth2.googleapis.com/token');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query([
        'code'          => $code,
        'client_id'     => GOOGLE_CLIENT_ID,
        'client_secret' => GOOGLE_CLIENT_SECRET,
        'redirect_uri'  => GOOGLE_REDIRECT_URI,
        'grant_type'    => 'authorization_code',
    ]),
]);
$tokenRes = json_decode(curl_exec($ch), true);
curl_close($ch);

if (empty($tokenRes['access_token'])) fail('Google authentication failed. Please try again.');

// Fetch user profile
$ch = curl_init('https://www.googleapis.com/oauth2/v3/userinfo');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $tokenRes['access_token']],
]);
$gUser = json_decode(curl_exec($ch), true);
curl_close($ch);

if (empty($gUser['email'])) fail('Could not retrieve Google profile.');

$pdo = db();

// Find existing user by google_id or email
$stmt = $pdo->prepare('SELECT * FROM users WHERE google_id = ? OR email = ? LIMIT 1');
$stmt->execute([$gUser['sub'], $gUser['email']]);
$user = $stmt->fetch();

if ($user) {
    // Update google_id and avatar if missing
    $pdo->prepare('UPDATE users SET google_id = ?, avatar = ? WHERE id = ?')
        ->execute([$gUser['sub'], $gUser['picture'] ?? '', $user['id']]);
} else {
    // Create new user — no password (Google-only account)
    $pdo->prepare('INSERT INTO users (name, email, password_hash, google_id, avatar) VALUES (?, ?, ?, ?, ?)')
        ->execute([$gUser['name'], $gUser['email'], password_hash(bin2hex(random_bytes(32)), PASSWORD_BCRYPT), $gUser['sub'], $gUser['picture'] ?? '']);
    $userId = (int) $pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
}

// Issue session token
$token   = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', time() + TOKEN_TTL);
$pdo->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')->execute([$user['id'], $token, $expires]);

$userJson = urlencode(json_encode([
    'id'    => $user['id'],
    'name'  => $user['name'],
    'email' => $user['email'],
    'phone' => $user['phone'] ?? '',
    'avatar'=> $user['avatar'] ?? '',
]));

// Redirect back to frontend with token in URL fragment (never hits server logs)
header('Location: ' . SITE_URL . '/auth/callback#token=' . $token . '&user=' . $userJson);
exit;
