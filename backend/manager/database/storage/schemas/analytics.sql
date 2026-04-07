-- Create Events Table (Raw Data)
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE,
    store_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(20) NOT NULL, -- page_view, add_to_cart, purchase
    product_id VARCHAR(50),
    amount DECIMAL(12, 2) DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE -- Used by precompute service
);

-- Indexing for high-volume filtering and sorting
CREATE INDEX IF NOT EXISTS idx_events_store_timestamp ON events(store_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_events_processed ON events(processed) WHERE processed = FALSE;

-- Create Daily Analytics Table (Aggregated)
CREATE TABLE IF NOT EXISTS analytics_daily (
    store_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    revenue DECIMAL(15, 2) DEFAULT 0,
    orders INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5, 2) DEFAULT 0,
    PRIMARY KEY (store_id, date)
);

-- Create Top Products Table (Aggregated)
CREATE TABLE IF NOT EXISTS top_products (
    store_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    revenue DECIMAL(15, 2) DEFAULT 0,
    orders INTEGER DEFAULT 0,
    PRIMARY KEY (store_id, product_id)
);

-- Indexing for Top Products sorting
CREATE INDEX IF NOT EXISTS idx_top_products_revenue ON top_products(store_id, revenue DESC);

-- Create Stores Table (Merchants)
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL UNIQUE,
    store_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(12, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);

-- Create Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL UNIQUE,
    store_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_store ON customers(store_id);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    store_id VARCHAR(50) NOT NULL,
    customer_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    total DECIMAL(12, 2) NOT NULL,
    items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
