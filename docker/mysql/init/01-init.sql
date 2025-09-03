-- Initialize the database with some default settings
CREATE DATABASE IF NOT EXISTS university_cms;
USE university_cms;

-- Add table creation and initial data here if needed
-- Example:
-- CREATE TABLE IF NOT EXISTS sample_table (
--    id INT AUTO_INCREMENT PRIMARY KEY,
--    name VARCHAR(100) NOT NULL
-- );

-- INSERT INTO sample_table (name) VALUES ('Sample Data');

-- Grant privileges (adjust as needed)
GRANT ALL PRIVILEGES ON university_cms.* TO 'root'@'%';
FLUSH PRIVILEGES;
