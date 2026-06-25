-- Run this in Hostinger → phpMyAdmin → SQL tab (after setup.sql)

CREATE TABLE IF NOT EXISTS password_resets (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  token      VARCHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used       TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS otps (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  phone      VARCHAR(20) NOT NULL,
  otp        VARCHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  used       TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_phone (phone)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  product_name  VARCHAR(255) NOT NULL,
  variant       VARCHAR(100) DEFAULT '',
  quantity      INT DEFAULT 1,
  price         INT NOT NULL,
  frequency     VARCHAR(50) DEFAULT 'monthly',
  status        VARCHAR(50) DEFAULT 'active',
  next_delivery DATE,
  address       JSON,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add phone column to users if not present
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(100) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(500) DEFAULT NULL;
