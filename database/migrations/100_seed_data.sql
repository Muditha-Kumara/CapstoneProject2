-- Example seed data for development and testing
-- Users
INSERT INTO users (id, name, email, password_hash, role, balance, email_verified) VALUES
    (gen_random_uuid(), 'Verified User', 'nourishnetworld@gmail.com', '$2b$10$upQLo0xNScfLEgRwVXG4Fe1BWqT88ZqrgGQBpQTrJN2xuZ3dnN91G', 'donor', 1000.00, TRUE),
    (gen_random_uuid(), 'test10', 'test10@gmail.com', '$2b$10$upQLo0xNScfLEgRwVXG4Fe1BWqT88ZqrgGQBpQTrJN2xuZ3dnN91G', 'admin', 500.00, TRUE),
    (gen_random_uuid(), 'Alice Donor', 'verified@example.com', 'hashed_pw1', 'donor', 100.00, TRUE),
    (gen_random_uuid(), 'Bob Recipient', 'bob@example.com', 'hashed_pw2', 'recipient', 0.00, false),
    (gen_random_uuid(), 'Carol Provider', 'carol@example.com', 'hashed_pw3', 'provider', 0.00, TRUE);

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
