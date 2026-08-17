CREATE TABLE IF NOT EXISTS telemetry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DECIMAL(10,2) NOT NULL,
    x DECIMAL(10,2) NOT NULL,
    y DECIMAL(10,2) NOT NULL,
    z DECIMAL(10,2) NOT NULL,
    velocity DECIMAL(10,2) NOT NULL,
    acceleration DECIMAL(10,2) NOT NULL,
    angle DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
Aiven
% mysql -h DB_HOST -P DB_PORT -u DB_USER -p
mysql> SELECT DATABASE();
mysql> USE defaultdb;
mysql> SHOW TABLES;
% mysql -h DB_HOST -P DB_PORT -u DB_USER -p defaultdb < .../aiven-schema.sql
mysql> USE defaultdb; SHOW TABLES; DESCRIBE telemetry;
mysql> USE defaultdb; SELECT * FROM telemetry;
*/