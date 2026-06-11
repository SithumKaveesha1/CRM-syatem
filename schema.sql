-- Schema for Invoice CRM
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_fullname (full_name),
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS invoices (
  invoice_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_no VARCHAR(100) NOT NULL,
  customer_id INT NOT NULL,
  invoice_date DATE,
  total_amount DECIMAL(12,2) DEFAULT 0,
  advance_amount DECIMAL(12,2) DEFAULT 0,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  balance_amount DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_invoice_no (invoice_no),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS invoice_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  setting_id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) DEFAULT 'Invoice CRM',
  company_address TEXT,
  contact_number VARCHAR(50),
  email VARCHAR(255),
  currency VARCHAR(10) DEFAULT 'USD',
  logo_url TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
