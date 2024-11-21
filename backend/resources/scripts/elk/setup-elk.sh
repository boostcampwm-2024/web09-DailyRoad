#!/bin/bash

# ELK 스택 설정 초기화 스크립트

# 환경 설정
export ELASTIC_PASSWORD="example" # 변경 필요
export LOGSTASH_PASSWORD="example"
export KIBANA_PASSWORD="example"
export ELASTIC_VERSION="8.15.3"

export SERVICE_NAME="dailyroad"

# 기본 경로 설정
SETUP_DIR=$(dirname "$(readlink -f "$0")")
DOCKER_ELK_DIR="$SETUP_DIR/../docker-elk"  # ELK 스택 클론 경로

LOGSTASH_CONFIG="$SETUP_DIR/logstash/logstash.conf"
TEMPLATE_FILE="$SETUP_DIR/elasticsearch/log_index_template.json"
KIBANA_SCRIPTS_DIR="$SETUP_DIR/kibana"

# 필요 패키지 업데이트 및 설치
echo "Updating packages..."
sudo apt update -y && sudo apt upgrade -y
echo "Installing Docker and Docker Compose..."
sudo apt install -y docker.io docker-compose

# Docker와 Docker Compose 설치 확인
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "Docker or Docker Compose installation failed. Please check your setup."
    exit 1
fi

# Docker-ELK 클론 또는 디렉토리로 이동
if [ ! -d "$DOCKER_ELK_DIR" ]; then
    echo "Cloning ELK stack repository to $DOCKER_ELK_DIR..."
    git clone https://github.com/deviantony/docker-elk.git "$DOCKER_ELK_DIR"
fi

cd "$DOCKER_ELK_DIR" || exit

# .env 파일에서 버전 및 비밀번호 설정
echo "Setting up environment file..."
sed -i "s/^ELASTIC_VERSION=.*/ELASTIC_VERSION=${ELASTIC_VERSION}/" .env
sed -i "s/^ELASTIC_PASSWORD=.*/ELASTIC_PASSWORD=${ELASTIC_PASSWORD}/" .env
sed -i "s/^LOGSTASH_PASSWORD=.*/LOGSTASH_PASSWORD=${LOGSTASH_PASSWORD}/" .env
sed -i "s/^KIBANA_PASSWORD=.*/KIBANA_PASSWORD=${KIBANA_PASSWORD}/" .env

sed -i "s/'//g" .env # 작은 따옴표 제거

# Logstash 구성 복사
if [ -f "$LOGSTASH_CONFIG" ]; then
    echo "Copying Logstash configuration..."
    sed -i "s|%SERVICE_NAME%|${SERVICE_NAME}|g" "$LOGSTASH_CONFIG"
    cp "$LOGSTASH_CONFIG" logstash/pipeline/logstash.conf
else
    echo "Logstash configuration file not found: $LOGSTASH_CONFIG"
    exit 1
fi

# 초기 사용자 및 권한 설정
echo "Setting up initial users and permissions..."
docker-compose up setup

# ELK 스택 시작
echo "Starting ELK stack..."
docker-compose up -d

echo "Waiting for Elasticsearch to be ready..."
until curl -s -o /dev/null -w "%{http_code}" -u elastic:"${ELASTIC_PASSWORD}" http://localhost:9200 | grep -q "200"; do
    sleep 10
    echo "Waiting for Elasticsearch..."
done
echo "Elasticsearch is ready."


# Logstash 사용자에게 writer 권한 부여
echo "Assigning writer role to Logstash user..."
if ! curl -u elastic:"${ELASTIC_PASSWORD}" -X PUT "http://localhost:9200/_security/role/logstash_writer" \
    -H "Content-Type: application/json" \
    -d "{\"cluster\": [\"manage_index_templates\", \"monitor\", \"manage_ilm\"], \"indices\": [{\"names\": [\"${SERVICE_NAME}-*\"], \"privileges\": [\"write\", \"create_index\"]}]}"; then
    echo "Failed to assign writer role to Logstash user."
    exit 1
fi


# Elasticsearch 인덱스 템플릿 등록
if [ -f "$TEMPLATE_FILE" ]; then
    echo "Registering Elasticsearch index template..."
    curl -u elastic:"${ELASTIC_PASSWORD}" -X PUT "http://localhost:9200/_index_template/${SERVICE_NAME}-template" \
    -H "Content-Type: application/json" \
    -d @"$TEMPLATE_FILE"
else
    echo "Index template file not found: $TEMPLATE_FILE"
    exit 1
fi

# Kibana 초기화 대기
echo "Waiting for Kibana to initialize..."
until curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:5601/api/status | grep -q "200"; do
    sleep 10
    echo "Kibana is still initializing..."
done
echo "Kibana is ready."


# ELK 스택 상태 확인
docker-compose ps

echo "ELK stack setup completed. Access Kibana at http://localhost:5601 with the default user credentials."
