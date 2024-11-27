#!/bin/bash

# Convert .env to Unix format
sed -i 's/\r$//' .env
source .env

# Start Docker Compose
echo "Starting MySQL container..."
docker-compose up -d

# Wait for MySQL to initialize
echo "Waiting for MySQL to initialize..."
sleep 20

echo "Setup user and database..."
docker exec -i mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" <<EOF
SET GLOBAL local_infile = 1;
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$MYSQL_USER
'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%';
FLUSH PRIVILEGES;
EOF

docker exec -i mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$DB_NAME" < "./scripts/DDL.sql"


# Import CSV file into PLACE table
CSV_FILE="/usr/sql-scripts/place_data.csv"

echo "Importing CSV file into PLACE table..."
docker exec -i mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$DB_NAME" <<EOF
SET SESSION sql_mode = '';

LOAD DATA LOCAL INFILE '$CSV_FILE'
INTO TABLE PLACE
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(google_place_id, name, thumbnail_url, rating, longitude, latitude, formatted_address, category, description, detail_page_url)
SET
    rating = NULLIF(rating, ''),
    description = NULLIF(description, ''),
    thumbnail_url = NULLIF(thumbnail_url, ''),
    detail_page_url = NULLIF(detail_page_url, ''),
    google_place_id = NULLIF(google_place_id, ''),
EOF

echo "CSV import completed!"
