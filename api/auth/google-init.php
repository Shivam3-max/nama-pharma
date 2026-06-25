<?php
require_once dirname(__DIR__) . '/config.php';

// Store random state to prevent CSRF
$state = bin2hex(random_bytes(16));
setcookie('oauth_state', $state, time() + 300, '/', '', true, true);

$params = http_build_query([
    'client_id'     => GOOGLE_CLIENT_ID,
    'redirect_uri'  => GOOGLE_REDIRECT_URI,
    'response_type' => 'code',
    'scope'         => 'openid email profile',
    'access_type'   => 'online',
    'state'         => $state,
    'prompt'        => 'select_account',
]);

header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . $params);
exit;
