<?php
// ── Fill these in from Hostinger → Hosting → Databases → MySQL Databases ──
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_db_name');      // e.g. u123456789_nama
define('DB_USER', 'your_db_user');      // e.g. u123456789_nama
define('DB_PASS', 'your_db_password');

// ── Your live domain — requests from other origins are rejected ──
define('ALLOWED_ORIGIN', 'https://namapharma.com');

// Session token lifetime in seconds (30 days)
define('TOKEN_TTL', 60 * 60 * 24 * 30);
