-- Table for users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

-- Table for bank accounts
CREATE TABLE bank_accounts (
  id SERIAL PRIMARY KEY,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  user_id INT NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
);

-- Table for transactions
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  bank_account_id INT NOT NULL,
  status VARCHAR(20) NOT NULL,
  reason VARCHAR(255),
  CONSTRAINT fk_bank_account
    FOREIGN KEY (bank_account_id)
    REFERENCES bank_accounts(id)
);
