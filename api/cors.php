<?php
require_once __DIR__ . '/config.php';

// Allow same-origin (site itself) and the configured domain
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === ALLOWED_ORIGIN || $origin === '') {
    header('Access-Control-Allow-Origin: ' . ($origin ?: ALLOWED_ORIGIN));
} else {
    http_response_code(403);
    exit(json_encode(['error' => 'Origin not allowed']));
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function json_out(array $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

// Extract bearer token from Authorization header
function bearer_token(): ?string {
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (str_starts_with($h, 'Bearer ')) {
        return trim(substr($h, 7));
    }
    return null;
}

// Validate token, return user row or exit with 401
function require_auth(): array {
    $token = bearer_token();
    if (!$token) json_out(['error' => 'Unauthenticated'], 401);

    $stmt = db()->prepare(
        'SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
         WHERE s.token = ? AND s.expires_at > NOW()'
    );
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    if (!$user) json_out(['error' => 'Session expired or invalid'], 401);
    return $user;
}
