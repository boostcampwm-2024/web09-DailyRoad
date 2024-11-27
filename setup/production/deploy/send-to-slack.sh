#!/bin/bash

# Slack Webhook URL 설정
WEBHOOK_URL="https://hooks.slack.com/services/example"

# Slack 메시지 전송 함수
send_slack_message() {
  local title="$1"
  local content="$2"
  local color="$3" # 색상 추가

  curl -X POST -H 'Content-Type: application/json' -d "{
    \"attachments\": [
      {
        \"color\": \"$color\",
        \"blocks\": [
          {
            \"type\": \"header\",
            \"text\": {
              \"type\": \"plain_text\",
              \"text\": \"$title\"
            }
          },
          {
            \"type\": \"section\",
            \"text\": {
              \"type\": \"mrkdwn\",
              \"text\": \"$content\"
            }
          }
        ]
      }
    ]
  }" "$WEBHOOK_URL"
}

# 메인 실행
if [ "$#" -lt 3 ]; then
  echo "사용법: $0 <제목> <내용> <색상>"
  exit 1
fi

send_slack_message "$1" "$2" "$3"
echo "Slack 메시지 전송 완료."
