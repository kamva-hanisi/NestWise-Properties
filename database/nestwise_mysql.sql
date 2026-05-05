CREATE DATABASE IF NOT EXISTS nestwise_properties
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nestwise_properties;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS inquiries;
DROP TABLE IF EXISTS owner_posts;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NOT NULL DEFAULT '',
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
  email_updates BOOLEAN NOT NULL DEFAULT TRUE,
  sms_updates BOOLEAN NOT NULL DEFAULT FALSE,
  preferred_market VARCHAR(40) NOT NULL DEFAULT 'buy',
  preferred_province VARCHAR(120) NOT NULL DEFAULT '',
  last_seen_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB;

CREATE TABLE properties (
  id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  location VARCHAR(180) NOT NULL,
  city VARCHAR(120) NOT NULL,
  province VARCHAR(120) NOT NULL,
  type VARCHAR(80) NOT NULL,
  status VARCHAR(80) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  beds INT UNSIGNED NOT NULL DEFAULT 0,
  baths INT UNSIGNED NOT NULL DEFAULT 0,
  size VARCHAR(60) NOT NULL DEFAULT '',
  area VARCHAR(60) NOT NULL DEFAULT '',
  image VARCHAR(255) NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY properties_location_index (location),
  KEY properties_type_status_index (type, status),
  KEY properties_price_index (price)
) ENGINE=InnoDB;

CREATE TABLE agents (
  id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(120) NOT NULL,
  image VARCHAR(255) NOT NULL DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE inquiries (
  id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  property_id BIGINT UNSIGNED NULL,
  status VARCHAR(80) NOT NULL DEFAULT 'New',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY inquiries_email_index (email),
  KEY inquiries_property_id_index (property_id),
  CONSTRAINT inquiries_property_id_fk
    FOREIGN KEY (property_id) REFERENCES properties (id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE owner_posts (
  id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  listing_goal VARCHAR(40) NOT NULL,
  property_type VARCHAR(80) NOT NULL,
  title VARCHAR(180) NOT NULL,
  location VARCHAR(180) NOT NULL,
  expected_price DECIMAL(12, 2) NOT NULL,
  bedrooms VARCHAR(20) NOT NULL DEFAULT '',
  bathrooms VARCHAR(20) NOT NULL DEFAULT '',
  owner_notes TEXT NULL,
  contact_preference VARCHAR(40) NOT NULL DEFAULT 'phone',
  status VARCHAR(80) NOT NULL DEFAULT 'New owner request',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY owner_posts_user_id_index (user_id),
  CONSTRAINT owner_posts_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  property_id BIGINT UNSIGNED NOT NULL,
  action ENUM('buy', 'rent', 'viewing') NOT NULL,
  viewing_date VARCHAR(40) NOT NULL DEFAULT '',
  message TEXT NULL,
  personal_full_name VARCHAR(120) NOT NULL DEFAULT '',
  personal_email VARCHAR(190) NOT NULL DEFAULT '',
  personal_phone VARCHAR(40) NOT NULL DEFAULT '',
  personal_id_number VARCHAR(80) NOT NULL DEFAULT '',
  occupation VARCHAR(120) NOT NULL DEFAULT '',
  employer VARCHAR(120) NOT NULL DEFAULT '',
  monthly_income VARCHAR(80) NOT NULL DEFAULT '',
  current_address TEXT NULL,
  move_in_date VARCHAR(40) NOT NULL DEFAULT '',
  household_size VARCHAR(40) NOT NULL DEFAULT '',
  personal_notes TEXT NULL,
  financing_method VARCHAR(80) NOT NULL DEFAULT '',
  deposit_ready BOOLEAN NOT NULL DEFAULT FALSE,
  pre_approved BOOLEAN NOT NULL DEFAULT FALSE,
  emergency_name VARCHAR(120) NOT NULL DEFAULT '',
  emergency_phone VARCHAR(40) NOT NULL DEFAULT '',
  emergency_relationship VARCHAR(80) NOT NULL DEFAULT '',
  status VARCHAR(80) NOT NULL DEFAULT 'Pending agent review',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY bookings_user_id_index (user_id),
  KEY bookings_property_id_index (property_id),
  KEY bookings_action_status_index (action, status),
  CONSTRAINT bookings_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT bookings_property_id_fk
    FOREIGN KEY (property_id) REFERENCES properties (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO users (
  id, name, email, phone, password_hash, role,
  email_updates, sms_updates, preferred_market, preferred_province,
  last_seen_at, created_at
) VALUES
  (1, 'NestWise Admin', 'admin@nestwise.co.za', '', 'a12efc5d5c73eb12ab4b7f34b1452683:0b820d834648610697011d449237c2f00f26cfc21c5a9a2def16979aea55bb4a5e392d71b7954af724be106b8adf892e791b232d89cb26d7e9da29716528be84', 'admin', TRUE, FALSE, 'both', '', '2026-04-30 15:48:17', '2026-04-29 14:07:01'),
  (1777486260413, 'Kamva Hanisi', 'lucashanisi@gmail.com', '0695864843', 'cbb5c3bd9900cc33aab124620f87de9f:e06b608a1cd6dd6a883f1bcf99512e23f29af31d3bf0da6813bf4840062893ed2f1e5c51ea7ff0ae147bde97d35b442460930787236fb3ceab94b75dad580889', 'client', TRUE, FALSE, 'buy', '', '2026-04-30 15:38:51', '2026-04-29 18:11:00'),
  (1777486302174, 'Khanyisile Sibanyoni', 'khanyisilesibanyoni889@gmail.com', '0695864843', 'b81de7c32d7b49cf005c4dc1ccf182b2:3a289ca33936b8f56878ba0fd89e915b07a6b0e0ab9fb7dc4fc12fcd8d8f9d5b139bfff66c75ff57de2b18e21662254fae34442dc3465c9fcc58049040a12a79', 'client', TRUE, FALSE, 'buy', '', '2026-04-29 18:11:42', '2026-04-29 18:11:42'),
  (1777555808523, 'Owner Client', 'owner20260430153008@example.com', '0735555555', 'dc0cea1c41c07f562d562b09733cd338:12759fa0b4dfa7929187310ba236bedcb0c92f9e227240ac2119b8ca3ce98d2678c42115f37b83a94662ba79bcecc226c2a12fad6252fc82e7ce093cd49d2f18', 'client', TRUE, FALSE, 'buy', '', '2026-04-30 13:30:09', '2026-04-30 13:30:08');

INSERT INTO properties (
  id, title, location, city, province, type, status, price,
  beds, baths, size, area, image, featured
) VALUES
  (1, 'Family Home in King William''s Town', 'Eastern Cape, King William''s Town', 'King William''s Town', 'Eastern Cape', 'House', 'For Sale', 500000, 4, 2, '10x10m', '20 000m2', '/images/house1.png', TRUE),
  (2, 'Sunny Suburban Residence', 'Eastern Cape, Bhisho', 'Bhisho', 'Eastern Cape', 'House', 'For Sale', 650000, 4, 2, '12x10m', '18 500m2', '/images/house 2.jpg', TRUE),
  (3, 'Modern Starter Home', 'Eastern Cape, East London', 'East London', 'Eastern Cape', 'Townhouse', 'For Rent', 8200, 3, 2, '9x8m', '720m2', '/images/house 3.jpg', TRUE),
  (4, 'Quiet Garden Property', 'Eastern Cape, Mthatha', 'Mthatha', 'Eastern Cape', 'House', 'For Sale', 780000, 5, 3, '15x11m', '25 000m2', '/images/house 4.jpg', FALSE),
  (5, 'Compact City Apartment', 'Western Cape, Cape Town', 'Cape Town', 'Western Cape', 'Apartment', 'For Rent', 12500, 2, 1, '7x8m', '68m2', '/images/house 5.jpg', FALSE),
  (6, 'Premium Estate Home', 'Gauteng, Sandton', 'Sandton', 'Gauteng', 'House', 'For Sale', 1850000, 4, 3, '16x14m', '1 250m2', '/images/house 6.jpg', TRUE),
  (7, 'Canal View Apartment', 'Netherlands, Amsterdam', 'Amsterdam', 'North Holland', 'Apartment', 'For Rent', 28000, 2, 2, '8x9m', '92m2', '/images/house 2.jpg', TRUE),
  (8, 'Garden Villa in Nairobi', 'Kenya, Nairobi', 'Nairobi', 'Nairobi County', 'House', 'For Sale', 2100000, 5, 4, '18x14m', '1 600m2', '/images/house 4.jpg', FALSE),
  (9, 'Coastal Family Home', 'Australia, Sydney', 'Sydney', 'New South Wales', 'House', 'For Sale', 3200000, 4, 3, '16x12m', '940m2', '/images/house 5.jpg', TRUE),
  (10, 'Downtown Loft', 'United States, New York', 'New York', 'New York', 'Apartment', 'For Rent', 42000, 1, 1, '7x7m', '74m2', '/images/house 6.jpg', FALSE),
  (11, 'Minimalist Townhouse', 'Japan, Tokyo', 'Tokyo', 'Tokyo', 'Townhouse', 'For Rent', 36000, 3, 2, '9x10m', '110m2', '/images/house 3.jpg', FALSE),
  (12, 'Mountain View Residence', 'Canada, Vancouver', 'Vancouver', 'British Columbia', 'House', 'For Sale', 2750000, 4, 3, '15x13m', '1 100m2', '/images/house1.png', TRUE),
  (13, 'Cityline Apartment for Sale', 'United Arab Emirates, Dubai', 'Dubai', 'Dubai', 'Apartment', 'For Sale', 1450000, 2, 2, '8x10m', '96m2', '/images/house 5.jpg', TRUE),
  (14, 'Quiet Rental House', 'United Kingdom, London', 'London', 'Greater London', 'House', 'For Rent', 31000, 3, 2, '11x10m', '180m2', '/images/house 4.jpg', FALSE);

INSERT INTO agents (id, name, role, image) VALUES
  (1, 'Rollins Jali', 'CEO', '/images/about/person.jpg'),
  (2, 'Jennifer Sibanyoni', 'Senior Agent', '/images/about/khanyi.jpg');

INSERT INTO inquiries (
  id, name, email, phone, message, property_id, status, created_at
) VALUES
  (1777471683488, 'Public Lead', 'lead@example.com', '0720000000', 'Please call me about properties.', 1, 'New', '2026-04-29 14:08:03');

INSERT INTO owner_posts (
  id, user_id, listing_goal, property_type, title, location, expected_price,
  bedrooms, bathrooms, owner_notes, contact_preference, status, created_at
) VALUES
  (1777555809532, 1777555808523, 'sell', 'Apartment', 'Owner Apartment', 'Durban, South Africa', 950000, '2', '1', 'Near beach.', 'both', 'New owner request', '2026-04-30 13:30:09');
