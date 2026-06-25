<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);

$user = require_auth();
$b    = body();
$name  = trim($b['name']  ?? $user['name']);
$phone = trim($b['phone'] ?? $user['phone']);

db()->prepare('UPDATE users SET name = ?, phone = ? WHERE id = ?')->execute([$name, $phone, $user['id']]);

json_out(['user' => ['id' => $user['id'], 'name' => $name, 'email' => $user['email'], 'phone' => $phone]]);
