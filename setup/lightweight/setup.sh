#!/bin/bash

# 현재 디렉토리 아래 모든 .sh 파일에 실행 권한 부여
find . -type f -name "*.sh" -exec chmod +x {} \;

export DEBIAN_FRONTEND=noninteractive

# Docker 설치 스크립트 실행
sudo ./install_docker.sh

# MySQL 설정 스크립트 실행
cd mysql || exit
sudo ./setup-mysql.sh
