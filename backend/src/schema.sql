CREATE DATABASE IF NOT EXISTS simulation_visualizer;

USE simulation_visualizer;

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
% mysql -u root -p
mysql> source ../schema.sql;
mysql> SHOW DATABASES;
mysql> USE simulation_visualizer; show TABLES;
mysql> ALTER TABLE telemetry
mysql> CHANGE COLUMN heading angle DOUBLE NOT NULL;
mysql> DESCRIBE telemetry;
mysql> USE simulation_visualizer;
mysql> SELECT * FROM telemetry;
*/