-- Example seed data for development and testing
-- Users
INSERT INTO users (id, name, email, password_hash, role, balance, email_verified) VALUES
    (gen_random_uuid(), 'Verified User', 'nourishnetworld@gmail.com', '$2b$10$upQLo0xNScfLEgRwVXG4Fe1BWqT88ZqrgGQBpQTrJN2xuZ3dnN91G', 'donor', 1000.00, TRUE),
    (gen_random_uuid(), 'Testing Food Provider', 'foodprovider@gmail.com', '$2b$10$hoKWWhxAl1qaMFxnKgqereG4zYRNmVJ.dASXNcc2KB6liLSDj3vnu', 'provider', 1000.00, TRUE),
    (gen_random_uuid(), 'Testing Admin', 'admin@gmail.com', '$2b$10$Sghs8EmGeSMvoKAtkQFY1.wnsz5Wo9/af8CdUMxZpZ9gL9FBF6IIS', 'admin', 1000.00, TRUE),
    (gen_random_uuid(), 'Testing Donor', 'donor@gmail.com', '$2b$10$Q4x4EbrIA5QXN8rQOqraFegbis37LJXsuk2vwhxyDTfT8RgOppGXW', 'donor', 1000.00, TRUE),
    (gen_random_uuid(), 'Testing Requester', 'requester@gmail.com', '$2b$10$6PTlsWSsBPQtOZ9vTh4kMui4yVLbp9tXr.J81wow6646N0k31qyxW', 'recipient', 500.00, TRUE);
    

-- Food Providers
INSERT INTO food_providers (id, user_id, name, address, contact_info) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'carol@example.com'), 'Carol''s Kitchen', '123 Main St', '555-1234');

-- Transactions
INSERT INTO transactions (id, user_id, type, amount, description) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'alice@example.com'), 'deposit', 100.00, 'Initial deposit');

-- Requests
INSERT INTO requests (id, user_id, food_type, quantity, status) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'bob@example.com'), 'Rice', 5, 'pending');

-- Donations
INSERT INTO donations (id, user_id, food_type, quantity, status) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'alice@example.com'), 'Rice', 5, 'pending');

-- Orders
INSERT INTO orders (id, request_id, donation_id, status) VALUES
    (gen_random_uuid(), (SELECT id FROM requests LIMIT 1), (SELECT id FROM donations LIMIT 1), 'processing');
