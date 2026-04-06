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
