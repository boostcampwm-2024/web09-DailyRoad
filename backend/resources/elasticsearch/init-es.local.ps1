# 현재 스크립트의 디렉터리 가져오기
$scriptPath = $PSScriptRoot
$indexFilePath = Join-Path -Path $scriptPath -ChildPath "index/place-index.json"

# Elasticsearch 상태 확인
do {
    Write-Output "Waiting for Elasticsearch to be ready..."
    Start-Sleep -Seconds 5
} while (-not (curl -s -XGET "http://localhost:9200/_cluster/health" | Select-String '"status":"green"'))

# Place 인덱스 확인 및 생성
Write-Output "Checking if 'place' index exists..."
$response = curl -s -o NUL -w "%{http_code}" -XGET "http://localhost:9200/place"

if ($response -eq "404") {
    Write-Output "Index 'place' does not exist. Creating it..."
    curl -X PUT "http://localhost:9200/place" `
         -H "Content-Type: application/json" `
         --data-binary "@$indexFilePath"
    Write-Output "'place' index created successfully."
} elseif ($response -eq "200") {
    Write-Output "Index 'place' already exists."
} else {
    Write-Output "Unexpected response while checking for 'place' index: HTTP $response"
}
