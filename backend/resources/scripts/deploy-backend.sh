#!/bin/bash

# 파일 경로 설정
DETAIL_SLACK_SCRIPT="./detail-slack.sh"    # 상세 로그 전송 스크립트
SEND_TO_SLACK_SCRIPT="./send-to-slack.sh" # 간단 메시지 전송 스크립트
PRE_DEPLOY_LOG_FILE="./slack/pre_deploy_logs.txt"
DEPLOY_LOG_FILE="./slack/deploy_logs.txt"

# Docker 설정
IMAGE_NAME="${NCP_REGISTRY_URL}/${DOCKER_IMAGE_NAME}:latest"
CONTAINER_NAME="nest"

# 타임스탬프 생성
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 배포 전 컨테이너 로그 수집
echo "배포 전 기존 컨테이너 로그 저장 중..."
docker logs "$CONTAINER_NAME" > "$PRE_DEPLOY_LOG_FILE" 2>&1 || echo "기존 로그 없음" > "$PRE_DEPLOY_LOG_FILE"

# Slack에 배포 전 로그 전송
PRE_DEPLOY_LINK=$($DETAIL_SLACK_SCRIPT "$PRE_DEPLOY_LOG_FILE")
if [ -z "$PRE_DEPLOY_LINK" ]; then
  echo "배포 전 로그 Slack 전송 실패"
  exit 1
fi

# Docker 작업 시작
echo "Docker 배포 진행 중..."
{
  docker login $NCP_REGISTRY_URL -u $NCP_ACCESS_KEY -p $NCP_SECRET_KEY &&
  echo "Docker 로그인 성공." &&
  docker pull "$IMAGE_NAME" &&
  echo "이미지 가져오기 성공: $IMAGE_NAME" &&
  docker stop "$CONTAINER_NAME" || echo "기존 컨테이너 중지 실패" &&
  docker rm "$CONTAINER_NAME" || echo "기존 컨테이너 삭제 실패" &&
  docker image prune -f &&
  docker container prune -f &&
  docker run -d --name "$CONTAINER_NAME" -p 8080:8080 "$IMAGE_NAME" &&
  echo "새 컨테이너 실행 성공."
} > "$DEPLOY_LOG_FILE" 2>&1

# 배포 결과 확인
if [ $? -eq 0 ]; then
  DEPLOY_STATUS="배포 성공"
  COLOR="#36a64f" # Green
else
  DEPLOY_STATUS="배포 실패"
  COLOR="#ff0000" # Red
fi

# Slack에 배포 로그 전송
DEPLOY_LINK=$($DETAIL_SLACK_SCRIPT "$DEPLOY_LOG_FILE")
if [ -z "$DEPLOY_LINK" ]; then
  echo "배포 로그 Slack 전송 실패"
  exit 1
fi

# Slack에 배포 결과 전송
echo "배포 결과를 Slack에 전송 중..."
RESULT_MESSAGE="*배포 상태:* $DEPLOY_STATUS\n*배포 시간:* $TIMESTAMP\n*배포 전 로그:* <$PRE_DEPLOY_LINK|배포 전 상세 로그 보기>\n*배포 로그:* <$DEPLOY_LINK|배포 상세 로그 보기>"
$SEND_TO_SLACK_SCRIPT "배포 결과" "$RESULT_MESSAGE" "$COLOR"

# 배포 완료 메시지 출력
if [ "$DEPLOY_STATUS" == "배포 성공" ]; then
  echo "배포가 성공적으로 완료되었습니다."
else
  echo "배포 중 오류가 발생했습니다. Slack 메시지를 확인하세요."
fi
