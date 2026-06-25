<?php
require_once dirname(__DIR__) . '/db.php';
require_once dirname(__DIR__) . '/cors.php';

$token = bearer_token();
if ($token) {
    db()->prepare('DELETE FROM sessions WHERE token = ?')->execute([$token]);
}
json_out(['ok' => true]);
