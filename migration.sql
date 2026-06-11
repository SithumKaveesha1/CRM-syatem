-- Role column already exists

-- Create settings table
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

-- Insert default setting
INSERT INTO settings (company_name) VALUES ('Invoice CRM') ON DUPLICATE KEY UPDATE company_name='Invoice CRM';

-- Create invoice_items table
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
