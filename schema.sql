DROP TABLE IF EXISTS cities;
CREATE TABLE IF NOT EXISTS cities (
     id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
    
);
INSERT INTO cities (first_name,last_name) VALUES ('Ahmad','Swedani');
