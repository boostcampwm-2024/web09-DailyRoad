#!/bin/bash
echo "Checking if 'place' index exists..."
response=$(curl -s -o /dev/null -w "%{http_code}" -XGET "http://elasticsearch:9200/place" -u "elastic:${ELASTIC_PASSWORD}")
if [ "$response" -eq 404 ]; then
  echo "Index 'place' does not exist. Creating it..."
  curl -X PUT "http://elasticsearch:9200/place" \
       -H "Content-Type: application/json" \
       -u "elastic:${ELASTIC_PASSWORD}" \
       --data-binary @/usr/share/elasticsearch/place-index.json
  echo "'place' index created successfully."
elif [ "$response" -eq 200 ]; then
  echo "Index 'place' already exists."
else
  echo "Unexpected response while checking for 'place' index: HTTP $response"
fi