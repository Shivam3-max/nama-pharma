<?php
// ── Database (Hostinger → Hosting → Databases → MySQL Databases) ──
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_db_name');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');

// ── Domain ──
define('ALLOWED_ORIGIN', 'https://namapharma.com');
define('SITE_URL',       'https://namapharma.com');
define('TOKEN_TTL',      60 * 60 * 24 * 30); // 30 days

// ── Email (Hostinger → Email → Email Accounts) ──
define('MAIL_FROM',      'noreply@namapharma.com');
define('MAIL_FROM_NAME', 'Nama Pharma');
// For SMTP (recommended over mail()):
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'noreply@namapharma.com');
define('SMTP_PASS', 'your_email_password');

// ── Google OAuth (console.cloud.google.com → APIs & Services → Credentials) ──
define('GOOGLE_CLIENT_ID',     'your_google_client_id.apps.googleusercontent.com');
define('GOOGLE_CLIENT_SECRET', 'your_google_client_secret');
define('GOOGLE_REDIRECT_URI',  SITE_URL . '/api/auth/google-callback.php');

// ── MSG91 SMS OTP (msg91.com → API → Auth Key) ──
define('MSG91_AUTH_KEY',    'your_msg91_auth_key');
define('MSG91_TEMPLATE_ID', 'your_msg91_otp_template_id');
define('MSG91_SENDER_ID',   'NAMAPX');
