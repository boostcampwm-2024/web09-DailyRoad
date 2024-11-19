#!/bin/bash

# Elasticsearch 준비 상태 확인
until curl -s -XGET "http://localhost:9200/_cluster/health" -u "elastic:${ELASTIC_PASSWORD}" | grep '"status":"green"' > /dev/null; do
  echo "Waiting for Elasticsearch to be ready..."
  sleep 5
done

# Kibana 시스템 계정 비밀번호 설정
echo "Setting kibana_system password..."
curl -s -X POST -u "elastic:${ELASTIC_PASSWORD}" \
     -H "Content-Type: application/json" \
     -d "{\"password\":\"${ELASTIC_PASSWORD}\"}" \
     "http://localhost:9200/_security/user/kibana_system/_password"

# "place" 인덱스 확인 및 생성
echo "Checking if 'place' index exists..."
response=$(curl -s -o /dev/null -w "%{http_code}" -XGET "http://localhost:9200/place" -u "elastic:${ELASTIC_PASSWORD}")

if [ "$response" -eq 404 ]; then
  echo "Index 'place' does not exist. Creating it..."
  curl -X PUT "http://localhost:9200/place" \
       -u "elastic:${ELASTIC_PASSWORD}" \
       -H "Content-Type: application/json" \
       --data-binary @/usr/share/elasticsearch/place-index.json
  echo "'place' index created successfully."
elif [ "$response" -eq 200 ]; then
  echo "Index 'place' already exists."
else
  echo "Unexpected response while checking for 'place' index: HTTP $response"
fi
