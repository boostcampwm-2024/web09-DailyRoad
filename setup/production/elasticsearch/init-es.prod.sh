#!/bin/bash

# 현재 스크립트의 디렉터리 가져오기
SCRIPT_DIR=$(dirname "$(realpath "$0")")
INDEX_FILE="$SCRIPT_DIR/index/place-index.json"

# Elasticsearch 상태 확인
until curl -s -XGET "http://localhost:9200/_cluster/health" | grep '"status":"green"' > /dev/null; do
  echo "Waiting for Elasticsearch to be ready..."
  sleep 5
done

echo "Checking if 'place' index exists..."
response=$(curl -s -o /dev/null -w "%{http_code}" -XGET "http://elasticsearch:9200/place" -u "elastic:${ELASTIC_PASSWORD}")
if [ "$response" -eq 404 ]; then
  echo "Index 'place' does not exist. Creating it..."
  curl -X PUT "http://elasticsearch:9200/place" \
       -H "Content-Type: application/json" \
       -u "elastic:${ELASTIC_PASSWORD}" \
       --data-binary @"$INDEX_FILE"
  echo "'place' index created successfully."
elif [ "$response" -eq 200 ]; then
  echo "Index 'place' already exists."
else
  echo "Unexpected response while checking for 'place' index: HTTP $response"
fi
