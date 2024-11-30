#!/bin/bash

source .env

# Docker Compose 실행
echo "Starting MySQL container..."
docker-compose up -d

# MySQL 초기화 대기
echo "Waiting for MySQL to become healthy..."
until [ "$(docker inspect -f '{{.State.Health.Status}}' mysql)" == "healthy" ]; do
  sleep 2
  echo "Waiting for MySQL to initialize..."
done

# MySQL 사용자 및 데이터베이스 설정
echo "Setup user and database..."
docker exec -i mysql mysql -h127.0.0.1 -uroot -p"${MYSQL_ROOT_PASSWORD}" <<EOF
SET GLOBAL local_infile = 1;
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'%';
FLUSH PRIVILEGES;
EOF

# DDL 실행
echo "Running DDL.sql..."
docker exec -i mysql mysql -h127.0.0.1 -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" < ./scripts/DDL.sql

# CSV 파일 로드
echo "Importing CSV file into PLACE table..."
docker exec -i mysql bash -c "echo '[client]' > /etc/my.cnf && echo 'local_infile=1' >> /etc/my.cnf"
CSV_FILE="/usr/sql-scripts/place_data.csv"
docker exec -i mysql mysql -h127.0.0.1 -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" <<EOF
SET SESSION sql_mode = '';
LOAD DATA LOCAL INFILE '${CSV_FILE}'
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
    google_place_id = NULLIF(google_place_id, '');
EOF

echo "CSV import completed!"
