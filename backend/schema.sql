
CREATE TABLE IF NOT EXISTS registered (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    hp INT NOT NULL,
    acceleration NUMERIC(3, 1) NOT NULL,
    top_speed INT NOT NULL,
    engine_type VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    chassis_code VARCHAR(30) UNIQUE NOT NULL,
    year INT NOT NULL DEFAULT 2026,
    is_featured BOOLEAN DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS test_drives (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    location VARCHAR(100) NOT NULL,
    car_id INT REFERENCES cars(id) ON DELETE CASCADE,
    preferred_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO cars (title, brand, category, price, hp, acceleration, top_speed, engine_type, image_url, chassis_code, is_featured) VALUES
('Aetheria GT Hypercar', 'Apex', 'Hypercar', 3450000.00, 1914, 1.8, 412, 'V12 Quad-Turbo', 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200', 'CH-AETH-01', true),
('Valkyrie Roadster V12', 'Apex', 'Hypercar', 2900000.00, 1160, 2.5, 400, 'V12 NA Engine', 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200', 'CH-VALK-09', true),
('Chronos E-Performance', 'Kronos', 'Electric', 1850000.00, 1020, 2.1, 350, 'Quad-Motor EV', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200', 'CH-CHRN-88', true),
('Phantom Black Edition', 'Luxury', 'Sedan', 980000.00, 670, 3.2, 320, 'V8 Twin-Turbo', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200', 'CH-PHNT-44', false),
('Titan Ultra SUV', 'Apex', 'SUV', 1200000.00, 850, 3.4, 305, 'V8 Hybrid', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200', 'CH-TTN-12', false),
('Spectre Zero Concept', 'Kronos', 'Electric', 4100000.00, 2000, 1.6, 440, 'Solid-State EV', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200', 'CH-SPCT-00', true)
ON CONFLICT (chassis_code) DO NOTHING;
