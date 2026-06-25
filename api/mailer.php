<?php
require_once __DIR__ . '/config.php';

/**
 * Send email via SMTP using raw sockets (no external library needed on Hostinger).
 * Falls back to PHP mail() if SMTP fails.
 */
function send_email(string $to, string $subject, string $htmlBody): bool {
    // Try SMTP first
    try {
        $sock = fsockopen(SMTP_HOST, SMTP_PORT, $errno, $errstr, 10);
        if (!$sock) throw new \Exception("Connect failed: $errstr");

        $read = fn() => fgets($sock, 512);
        $write = fn(string $cmd) => fputs($sock, $cmd . "\r\n");

        $read(); // greeting
        $write('EHLO ' . parse_url(SITE_URL, PHP_URL_HOST));
        while ($line = $read()) { if ($line[3] === ' ') break; }

        $write('STARTTLS');
        $read();
        stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

        $write('EHLO ' . parse_url(SITE_URL, PHP_URL_HOST));
        while ($line = $read()) { if ($line[3] === ' ') break; }

        $write('AUTH LOGIN');
        $read();
        $write(base64_encode(SMTP_USER)); $read();
        $write(base64_encode(SMTP_PASS)); $read();

        $write('MAIL FROM:<' . MAIL_FROM . '>'); $read();
        $write('RCPT TO:<' . $to . '>');         $read();
        $write('DATA');                            $read();

        $headers  = "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
        $headers .= "To: $to\r\n";
        $headers .= "Subject: $subject\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $write($headers . "\r\n" . $htmlBody . "\r\n.");
        $read();

        $write('QUIT');
        fclose($sock);
        return true;
    } catch (\Throwable $e) {
        // Fallback to PHP mail()
        $headers  = "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        return mail($to, $subject, $htmlBody, $headers);
    }
}

function email_template(string $title, string $body): string {
    return <<<HTML
<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:'DM Sans',Arial,sans-serif;background:#F7F3ED;margin:0;padding:32px 16px;}
  .card{background:#fff;max-width:520px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(30,26,20,0.08);}
  .header{background:linear-gradient(135deg,#1E1A14,#2d2318);padding:32px;text-align:center;}
  .logo{color:#C9A84C;font-size:28px;letter-spacing:0.22em;font-weight:600;}
  .sub{color:rgba(255,255,255,0.4);font-size:9px;letter-spacing:0.45em;margin-top:2px;}
  .content{padding:32px;}
  .title{color:#1E1A14;font-size:22px;font-weight:300;margin-bottom:12px;}
  p{color:#7A6952;font-size:14px;line-height:1.7;margin:0 0 16px;}
  .btn{display:inline-block;background:linear-gradient(135deg,#A07820,#D4A843);color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:13px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;}
  .footer{text-align:center;padding:20px;font-size:11px;color:#A8967E;}
</style></head><body>
<div class="card">
  <div class="header"><div class="logo">NAMA</div><div class="sub">PHARMA</div></div>
  <div class="content"><h1 class="title">$title</h1>$body</div>
  <div class="footer">© 2026 Nama Pharma · This email was sent to you because you have an account with us.</div>
</div></body></html>
HTML;
}
