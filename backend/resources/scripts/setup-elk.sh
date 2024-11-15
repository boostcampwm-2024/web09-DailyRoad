#!/bin/bash

# ELK 스택 설정 초기화 스크립트

# 환경 설정
export ELASTIC_PASSWORD="example" # 변경해 사용
export LOGSTASH_PASSWORD="example"
export KIBANA_PASSWORD="example"
export ELASTIC_VERSION="8.15.3"

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

if [ ! -d "docker-elk" ]; then
    echo "Cloning ELK stack repository..."
    git clone https://github.com/deviantony/docker-elk.git
fi

cd docker-elk || exit

# .env 파일에서 버전 설정 및 초기 패스워드 변경
echo "Setting up environment file..."
sed -i "s/^ELASTIC_VERSION=.*/ELASTIC_VERSION=${ELASTIC_VERSION}/" .env
sed -i "s/^ELASTIC_PASSWORD=.*/ELASTIC_PASSWORD=${ELASTIC_PASSWORD}/" .env
sed -i "s/^LOGSTASH_PASSWORD=.*/LOGSTASH_PASSWORD=${LOGSTASH_PASSWORD}/" .env
sed -i "s/^KIBANA_PASSWORD=.*/KIBANA_PASSWORD=${KIBANA_PASSWORD}/" .env
sed -i "s/'//g" .env # 작은 따옴표 제거

# 초기 사용자 및 권한 설정
echo "Setting up initial users and permissions..."
docker-compose up setup

# ELK 스택 시작
echo "Starting ELK stack..."
docker-compose up -d

# Kibana 초기화 대기
echo "Waiting for Kibana to initialize..."
sleep 60

# ELK 스택 상태 확인
docker-compose ps

echo "ELK stack setup completed. Access Kibana at http://localhost:5601 with the default user credentials."
