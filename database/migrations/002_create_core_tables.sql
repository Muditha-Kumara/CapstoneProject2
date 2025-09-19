-- Migration for FoodProviders table
CREATE TABLE food_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    gps_location TEXT,
    contact_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migration for Requests table
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'fulfilled', 'cancelled');
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    food_type TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status request_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_status ON requests(status);

-- Migration for Donations table
CREATE TYPE donation_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    food_type TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status donation_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_status ON donations(status);

-- Migration for Orders table
CREATE TYPE order_status AS ENUM ('processing', 'fulfilled', 'cancelled');
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
    donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
    address TEXT,
    gps_location TEXT,
    status order_status NOT NULL DEFAULT 'processing',
    fulfilled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orders_request_id ON orders(request_id);
CREATE INDEX idx_orders_donation_id ON orders(donation_id);
CREATE INDEX idx_orders_status ON orders(status);
