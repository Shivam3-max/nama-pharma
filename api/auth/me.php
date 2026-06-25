<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

$user = require_auth();

json_out([
    'user' => [
        'id'         => $user['id'],
        'name'       => $user['name'],
        'email'      => $user['email'],
        'phone'      => $user['phone'],
        'created_at' => $user['created_at'],
    ],
]);
