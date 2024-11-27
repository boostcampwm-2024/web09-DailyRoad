#!/bin/bash

# Slack Bot Token 및 채널 ID 설정
SLACK_BOT_TOKEN="xoxb-token" # Bot Token
CHANNEL_ID="id"                                                   # 메시지를 보낼 채널 ID
LOG_FILE="$1"

if [ -z "$LOG_FILE" ]; then
  echo "사용법: $0 <로그 파일 경로>"
  exit 1
fi

if [ ! -f "$LOG_FILE" ]; then
  echo "로그 파일이 존재하지 않습니다: $LOG_FILE"
  exit 1
fi

# 파일 읽기
LOG_CONTENT=$(<"$LOG_FILE")
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Slack API로 메시지 전송
response=$(curl -s -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"channel\": \"$CHANNEL_ID\",
    \"text\": \"*상세 로그: $TIMESTAMP*\n\`\`\`$LOG_CONTENT\`\`\`\",
    \"mrkdwn\": true
  }")

# Slack 메시지 ID 및 채널 ID 추출
message_ts=$(echo "$response" | jq -r '.ts')
channel_id=$(echo "$response" | jq -r '.channel')

# 값 검증
if [ -z "$message_ts" ] || [ -z "$channel_id" ] || [ "$message_ts" == "null" ] || [ "$channel_id" == "null" ]; then
  echo "Slack 메시지 전송 실패. 응답: $response"
  exit 1
fi

# Slack 메시지 링크 생성
permalink_response=$(curl -s -X GET "https://slack.com/api/chat.getPermalink?channel=$channel_id&message_ts=$message_ts" \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN")

permalink=$(echo "$permalink_response" | jq -r '.permalink')

if [ -z "$permalink" ] || [ "$permalink" == "null" ]; then
  echo "Slack 메시지 링크 생성 실패. 응답: $permalink_response"
  exit 1
fi

# Slack 메시지 링크 출력
echo "$permalink"
