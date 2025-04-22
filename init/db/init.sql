-- create if it doesn't exist
CREATE DATABASE IF NOT EXISTS checkin;
USE checkin;

-- create locations
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  realtime_auth BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- check_ins
CREATE TABLE IF NOT EXISTS check_ins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location_id INT NOT NULL,
  checkin_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(255),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- init
INSERT IGNORE INTO locations (name, slug, realtime_auth)
VALUES 
  ('Main Library', 'library', false),
  ('Tate Center', 'tate', false),
  ('Software Engineering', 'se-2025', true);
