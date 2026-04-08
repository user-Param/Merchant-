-- Seed Data Script for Merchant Platform
-- This script inserts realistic data for visualization and testing

-- Insert a Store (if not exists)
INSERT INTO stores (store_id, name, email, password_hash, created_at)
VALUES ('store_001', 'TechGear Shop', 'admin@techgear.com', '$2b$10$YK.QZ8h1e7VVJVJQxK8s7uDjKJ1J1J1J1J1J1J1J1J1J1J1J1J', NOW() - INTERVAL '90 days')
ON CONFLICT (store_id) DO NOTHING;

-- Insert Products
INSERT INTO products (product_id, store_id, name, description, category, price, stock, image_url, created_at, updated_at)
VALUES
  ('prod_001', 'store_001', 'Wireless Headphones', 'Premium noise-cancelling headphones with 30-hour battery life', 'Electronics', 199.99, 45, 'https://via.placeholder.com/300?text=Headphones', NOW() - INTERVAL '60 days', NOW()),
  ('prod_002', 'store_001', 'USB-C Cable (3-pack)', 'High-speed charging cables, 3 meters long', 'Accessories', 24.99, 150, 'https://via.placeholder.com/300?text=USB+Cable', NOW() - INTERVAL '50 days', NOW()),
  ('prod_003', 'store_001', 'Phone Stand', 'Adjustable aluminum phone stand for desk', 'Accessories', 34.99, 87, 'https://via.placeholder.com/300?text=Phone+Stand', NOW() - INTERVAL '45 days', NOW()),
  ('prod_004', 'store_001', '4K Webcam', 'Ultra HD webcam with auto-focus for streaming', 'Electronics', 129.99, 32, 'https://via.placeholder.com/300?text=Webcam', NOW() - INTERVAL '40 days', NOW()),
  ('prod_005', 'store_001', 'Laptop Stand', 'Ergonomic laptop stand with heat dissipation', 'Furniture', 89.99, 56, 'https://via.placeholder.com/300?text=Laptop+Stand', NOW() - INTERVAL '35 days', NOW()),
  ('prod_006', 'store_001', 'Mechanical Keyboard', 'RGB backlit mechanical keyboard, blue switches', 'Electronics', 159.99, 28, 'https://via.placeholder.com/300?text=Keyboard', NOW() - INTERVAL '30 days', NOW()),
  ('prod_007', 'store_001', 'Mouse Pad', 'Large extended mouse pad with RGB lighting', 'Accessories', 29.99, 120, 'https://via.placeholder.com/300?text=Mouse+Pad', NOW() - INTERVAL '25 days', NOW()),
  ('prod_008', 'store_001', 'USB Hub 7-port', 'High-speed USB 3.0 hub with power adapter', 'Electronics', 44.99, 65, 'https://via.placeholder.com/300?text=USB+Hub', NOW() - INTERVAL '20 days', NOW())
ON CONFLICT (product_id) DO NOTHING;

-- Insert Customers
INSERT INTO customers (customer_id, store_id, name, email, phone, total_orders, total_spent, created_at)
VALUES
  ('cust_001', 'store_001', 'John Smith', 'john.smith@email.com', '+1-555-0101', 8, 1245.67, NOW() - INTERVAL '75 days'),
  ('cust_002', 'store_001', 'Sarah Johnson', 'sarah.j@email.com', '+1-555-0102', 5, 834.50, NOW() - INTERVAL '60 days'),
  ('cust_003', 'store_001', 'Michael Chen', 'mchen@email.com', '+1-555-0103', 12, 2156.89, NOW() - INTERVAL '50 days'),
  ('cust_004', 'store_001', 'Emily Davis', 'emily.davis@email.com', '+1-555-0104', 3, 489.97, NOW() - INTERVAL '40 days'),
  ('cust_005', 'store_001', 'Robert Wilson', 'rwilson@email.com', '+1-555-0105', 7, 1567.43, NOW() - INTERVAL '35 days'),
  ('cust_006', 'store_001', 'Lisa Anderson', 'lisa.a@email.com', '+1-555-0106', 9, 1834.56, NOW() - INTERVAL '30 days'),
  ('cust_007', 'store_001', 'David Martinez', 'dmartinez@email.com', '+1-555-0107', 4, 654.32, NOW() - INTERVAL '25 days'),
  ('cust_008', 'store_001', 'Jennifer Taylor', 'jtaylor@email.com', '+1-555-0108', 6, 1123.45, NOW() - INTERVAL '20 days'),
  ('cust_009', 'store_001', 'James Brown', 'jbrown@email.com', '+1-555-0109', 10, 1945.78, NOW() - INTERVAL '15 days'),
  ('cust_010', 'store_001', 'Amanda Garcia', 'agarcia@email.com', '+1-555-0110', 5, 899.95, NOW() - INTERVAL '10 days')
ON CONFLICT (customer_id) DO NOTHING;

-- Insert Orders with realistic data
INSERT INTO orders (order_id, store_id, customer_id, status, total, items, created_at, updated_at)
VALUES
  ('ord_001', 'store_001', 'cust_001', 'completed', 224.98, '[{"product_id": "prod_001", "name": "Wireless Headphones", "quantity": 1, "price": 199.99}, {"product_id": "prod_002", "name": "USB-C Cable (3-pack)", "quantity": 1, "price": 24.99}]', NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days'),
  ('ord_002', 'store_001', 'cust_002', 'completed', 199.99, '[{"product_id": "prod_001", "name": "Wireless Headphones", "quantity": 1, "price": 199.99}]', NOW() - INTERVAL '65 days', NOW() - INTERVAL '65 days'),
  ('ord_003', 'store_001', 'cust_003', 'completed', 424.97, '[{"product_id": "prod_001", "name": "Wireless Headphones", "quantity": 2, "price": 199.99}]', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
  ('ord_004', 'store_001', 'cust_004', 'completed', 159.99, '[{"product_id": "prod_006", "name": "Mechanical Keyboard", "quantity": 1, "price": 159.99}]', NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days'),
  ('ord_005', 'store_001', 'cust_005', 'completed', 299.98, '[{"product_id": "prod_004", "name": "4K Webcam", "quantity": 2, "price": 129.99}]', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
  ('ord_006', 'store_001', 'cust_001', 'completed', 134.98, '[{"product_id": "prod_003", "name": "Phone Stand", "quantity": 1, "price": 34.99}, {"product_id": "prod_007", "name": "Mouse Pad", "quantity": 3, "price": 29.99}]', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),
  ('ord_007', 'store_001', 'cust_006', 'completed', 89.99, '[{"product_id": "prod_005", "name": "Laptop Stand", "quantity": 1, "price": 89.99}]', NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days'),
  ('ord_008', 'store_001', 'cust_003', 'completed', 244.98, '[{"product_id": "prod_002", "name": "USB-C Cable (3-pack)", "quantity": 2, "price": 24.99}, {"product_id": "prod_008", "name": "USB Hub 7-port", "quantity": 5, "price": 44.99}]', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days'),
  ('ord_009', 'store_001', 'cust_007', 'completed', 199.99, '[{"product_id": "prod_001", "name": "Wireless Headphones", "quantity": 1, "price": 199.99}]', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
  ('ord_010', 'store_001', 'cust_008', 'completed', 154.98, '[{"product_id": "prod_003", "name": "Phone Stand", "quantity": 1, "price": 34.99}, {"product_id": "prod_004", "name": "4K Webcam", "quantity": 1, "price": 129.99}]', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
  ('ord_011', 'store_001', 'cust_002', 'completed', 309.98, '[{"product_id": "prod_005", "name": "Laptop Stand", "quantity": 2, "price": 89.99}, {"product_id": "prod_007", "name": "Mouse Pad", "quantity": 4, "price": 29.99}]', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('ord_012', 'store_001', 'cust_009', 'completed', 249.97, '[{"product_id": "prod_006", "name": "Mechanical Keyboard", "quantity": 1, "price": 159.99}, {"product_id": "prod_007", "name": "Mouse Pad", "quantity": 3, "price": 29.99}]', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
  ('ord_013', 'store_001', 'cust_010', 'completed', 224.98, '[{"product_id": "prod_002", "name": "USB-C Cable (3-pack)", "quantity": 3, "price": 24.99}, {"product_id": "prod_003", "name": "Phone Stand", "quantity": 5, "price": 34.99}]', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
  ('ord_014', 'store_001', 'cust_001', 'completed', 364.97, '[{"product_id": "prod_004", "name": "4K Webcam", "quantity": 2, "price": 129.99}, {"product_id": "prod_008", "name": "USB Hub 7-port", "quantity": 5, "price": 44.99}]', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
  ('ord_015', 'store_001', 'cust_005', 'completed', 134.98, '[{"product_id": "prod_001", "name": "Wireless Headphones", "quantity": 1, "price": 199.99}]', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
  ('ord_016', 'store_001', 'cust_003', 'completed', 184.98, '[{"product_id": "prod_006", "name": "Mechanical Keyboard", "quantity": 1, "price": 159.99}, {"product_id": "prod_002", "name": "USB-C Cable (3-pack)", "quantity": 1, "price": 24.99}]', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('ord_017', 'store_001', 'cust_006', 'pending', 199.99, '[{"product_id": "prod_005", "name": "Laptop Stand", "quantity": 2, "price": 89.99}]', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('ord_018', 'store_001', 'cust_009', 'pending', 129.99, '[{"product_id": "prod_008", "name": "USB Hub 7-port", "quantity": 2, "price": 44.99}]', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
ON CONFLICT (order_id) DO NOTHING;

-- Insert Events (Raw user interaction data for analytics)
INSERT INTO events (event_id, store_id, event_type, product_id, amount, timestamp, processed)
VALUES
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '70 days' + INTERVAL '2 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_001', 0, NOW() - INTERVAL '70 days' + INTERVAL '2 hours 15 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'add_to_cart', 'prod_001', 199.99, NOW() - INTERVAL '70 days' + INTERVAL '2 hours 20 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'purchase', 'prod_001', 199.99, NOW() - INTERVAL '70 days' + INTERVAL '2 hours 30 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '65 days' + INTERVAL '3 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_002', 0, NOW() - INTERVAL '65 days' + INTERVAL '3 hours 10 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'purchase', 'prod_002', 24.99, NOW() - INTERVAL '65 days' + INTERVAL '3 hours 20 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '60 days' + INTERVAL '4 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_004', 0, NOW() - INTERVAL '60 days' + INTERVAL '4 hours 15 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'add_to_cart', 'prod_004', 129.99, NOW() - INTERVAL '60 days' + INTERVAL '4 hours 25 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'purchase', 'prod_004', 129.99, NOW() - INTERVAL '60 days' + INTERVAL '4 hours 35 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '50 days' + INTERVAL '5 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_006', 0, NOW() - INTERVAL '50 days' + INTERVAL '5 hours 10 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'purchase', 'prod_006', 159.99, NOW() - INTERVAL '50 days' + INTERVAL '5 hours 25 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '40 days' + INTERVAL '6 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_005', 0, NOW() - INTERVAL '40 days' + INTERVAL '6 hours 15 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'add_to_cart', 'prod_005', 89.99, NOW() - INTERVAL '40 days' + INTERVAL '6 hours 20 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'purchase', 'prod_005', 89.99, NOW() - INTERVAL '40 days' + INTERVAL '6 hours 30 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '30 days' + INTERVAL '7 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_001', 0, NOW() - INTERVAL '30 days' + INTERVAL '7 hours 15 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'add_to_cart', 'prod_001', 199.99, NOW() - INTERVAL '30 days' + INTERVAL '7 hours 20 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'purchase', 'prod_001', 199.99, NOW() - INTERVAL '30 days' + INTERVAL '7 hours 35 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '20 days' + INTERVAL '8 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_003', 0, NOW() - INTERVAL '20 days' + INTERVAL '8 hours 15 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'purchase', 'prod_003', 34.99, NOW() - INTERVAL '20 days' + INTERVAL '8 hours 25 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '15 days' + INTERVAL '9 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_008', 0, NOW() - INTERVAL '15 days' + INTERVAL '9 hours 10 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'purchase', 'prod_008', 44.99, NOW() - INTERVAL '15 days' + INTERVAL '9 hours 20 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '10 days' + INTERVAL '10 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_002', 0, NOW() - INTERVAL '10 days' + INTERVAL '10 hours 15 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'add_to_cart', 'prod_002', 24.99, NOW() - INTERVAL '10 days' + INTERVAL '10 hours 20 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '5 days' + INTERVAL '11 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_004', 0, NOW() - INTERVAL '5 days' + INTERVAL '11 hours 10 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'add_to_cart', 'prod_004', 129.99, NOW() - INTERVAL '5 days' + INTERVAL '11 hours 20 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'purchase', 'prod_004', 129.99, NOW() - INTERVAL '5 days' + INTERVAL '11 hours 30 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '3 days' + INTERVAL '12 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_006', 0, NOW() - INTERVAL '3 days' + INTERVAL '12 hours 15 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'add_to_cart', 'prod_006', 159.99, NOW() - INTERVAL '3 days' + INTERVAL '12 hours 25 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '2 days' + INTERVAL '13 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_001', 0, NOW() - INTERVAL '2 days' + INTERVAL '13 hours 15 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '1 day' + INTERVAL '14 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_005', 0, NOW() - INTERVAL '1 day' + INTERVAL '14 hours 15 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'add_to_cart', 'prod_005', 89.99, NOW() - INTERVAL '1 day' + INTERVAL '14 hours 25 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '12 hours', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_003', 0, NOW() - INTERVAL '12 hours' - INTERVAL '30 minutes', TRUE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '6 hours', FALSE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_001', 0, NOW() - INTERVAL '6 hours' - INTERVAL '15 minutes', FALSE),
  (gen_random_uuid(), 'store_001', 'add_to_cart', 'prod_001', 199.99, NOW() - INTERVAL '6 hours' - INTERVAL '10 minutes', FALSE),
  (gen_random_uuid(), 'store_001', 'page_view', NULL, 0, NOW() - INTERVAL '3 hours', FALSE),
  (gen_random_uuid(), 'store_001', 'page_view', 'prod_008', 0, NOW() - INTERVAL '3 hours' - INTERVAL '20 minutes', FALSE)
ON CONFLICT (event_id) DO NOTHING;

-- Insert pre-calculated analytics data (for immediate dashboard visibility)
INSERT INTO analytics_daily (store_id, date, revenue, orders, page_views, conversion_rate)
VALUES
  ('store_001', NOW()::DATE - INTERVAL '70 days', 424.97, 2, 3, 66.67),
  ('store_001', NOW()::DATE - INTERVAL '65 days', 224.98, 1, 2, 50.00),
  ('store_001', NOW()::DATE - INTERVAL '60 days', 259.98, 2, 3, 66.67),
  ('store_001', NOW()::DATE - INTERVAL '55 days', 359.97, 2, 2, 100.00),
  ('store_001', NOW()::DATE - INTERVAL '50 days', 249.97, 2, 3, 66.67),
  ('store_001', NOW()::DATE - INTERVAL '45 days', 364.97, 2, 2, 100.00),
  ('store_001', NOW()::DATE - INTERVAL '40 days', 189.98, 2, 2, 100.00),
  ('store_001', NOW()::DATE - INTERVAL '35 days', 434.97, 2, 3, 66.67),
  ('store_001', NOW()::DATE - INTERVAL '30 days', 399.98, 2, 3, 66.67),
  ('store_001', NOW()::DATE - INTERVAL '25 days', 299.98, 2, 3, 66.67),
  ('store_001', NOW()::DATE - INTERVAL '20 days', 309.98, 2, 3, 66.67),
  ('store_001', NOW()::DATE - INTERVAL '15 days', 249.97, 1, 3, 33.33),
  ('store_001', NOW()::DATE - INTERVAL '10 days', 174.98, 1, 3, 33.33),
  ('store_001', NOW()::DATE - INTERVAL '5 days', 259.98, 2, 3, 66.67),
  ('store_001', NOW()::DATE - INTERVAL '3 days', 159.99, 1, 2, 50.00),
  ('store_001', NOW()::DATE - INTERVAL '2 days', 199.99, 1, 2, 50.00),
  ('store_001', NOW()::DATE - INTERVAL '1 day', 89.99, 1, 3, 33.33),
  ('store_001', NOW()::DATE, 199.99, 0, 4, 25.00)
ON CONFLICT (store_id, date) DO NOTHING;

-- Insert Top Products data
INSERT INTO top_products (store_id, product_id, revenue, orders)
VALUES
  ('store_001', 'prod_001', 1199.94, 6),
  ('store_001', 'prod_004', 519.96, 4),
  ('store_001', 'prod_006', 319.98, 2),
  ('store_001', 'prod_005', 359.96, 4),
  ('store_001', 'prod_003', 139.96, 4),
  ('store_001', 'prod_008', 224.95, 5),
  ('store_001', 'prod_002', 124.95, 5),
  ('store_001', 'prod_007', 329.93, 11)
ON CONFLICT (store_id, product_id) DO NOTHING;
