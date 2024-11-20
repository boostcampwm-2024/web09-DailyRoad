# Production 환경  ES 및 Kibana 설정

1. `.env` 설정 (`sample_env` 참고)
2. `docker compose -f docker-compose.production.yml up setup`
3. 2가 끝난 이후 `docker compose -f docker-compose.production.yml up -d`

## 디렉토리 구조

- `index` : ES index 설정 파일
    - `place-index.json` : place index 설정 파일
    - `synonyms.txt` : 대한민국 지역 별 동의어 설정 파일
- `Dockerfile`: `norianalyzer` 를 설치한 `elasticsearch:8.16.0` 이미지
- `docker-compose.yml`: 회원 인증 없이 ES 및 Kibana를 실행하는 설정 파일 (Local 환경)
    - `init-es.local.sh`: ES index 설정 파일을 적용하는 스크립트
- `docker-compose.production.yml`: 회원 인증을 통해 ES 및 Kibana를 실행하는 설정 파일 (Production 환경)
    - `init-es.production.sh`: ES index 설정 파일을 적용하는 스크립트

### 초기 json 데이터 bulk

```shell
# place index 예시
curl -H "Content-Type: application/json" -XPOST '127.0.0.1:9200/place/_bulk' -u "elastic:${ELASTIC_PASSWORD}" --data-binary @{이름}.json
```

참고 : [elastic - Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html)

## Kibana 배포

https://search.dailyroad.site

---

### 수정

241120 초안 작성