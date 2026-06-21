# Nama Pharma — Deployment Guide

## Build for production

```bash
npm install
npm run build
# output is in ./dist/
```

---

## Option A — Vercel (recommended, free)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import this repository (push to GitHub first)
3. Settings are auto-detected:
   - **Framework**: Vite
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Add environment variables in Vercel dashboard → **Settings → Environment Variables**:
   - `VITE_RAZORPAY_KEY_ID` = your live key
   - `VITE_SITE_URL` = `https://yourdomain.com`
5. Click **Deploy**

The `vercel.json` at the project root already handles SPA routing and cache headers.

---

## Option B — Netlify (free)

1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Build settings are read automatically from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add env vars in **Site settings → Environment variables**
4. Deploy

The `public/_redirects` file handles SPA routing as a fallback.

---

## Option C — Traditional cPanel / shared hosting

1. Run `npm run build` locally
2. Upload the entire contents of `./dist/` to your `public_html/` folder via FTP or File Manager
3. Create a `.htaccess` file in `public_html/` with:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

---

## Option D — VPS / DigitalOcean / AWS (nginx)

Upload `./dist/` to your server, then configure nginx:

```nginx
server {
    listen 80;
    server_name namapharma.com www.namapharma.com;
    root /var/www/nama-pharma/dist;
    index index.html;

    # SPA routing — all paths serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Long-term cache for hashed assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
}
```

Then get an SSL certificate:
```bash
sudo certbot --nginx -d namapharma.com -d www.namapharma.com
```

---

## Custom domain

Update these after you point your domain:
- `public/robots.txt` → replace `namapharma.com` with your domain
- `public/sitemap.xml` → replace `namapharma.com` with your domain
- `index.html` → update `og:url`, `og:image`, and `canonical` meta tags
- Submit sitemap to [Google Search Console](https://search.google.com/search-console)

---

## Environment variables checklist

| Variable | Where to get it |
|---|---|
| `VITE_RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys |
| `VITE_SITE_URL` | Your domain |
| `VITE_WHATSAPP_NUMBER` | Your WhatsApp Business number (with country code) |

Copy `.env.example` → `.env` for local dev. Never commit `.env`.
