## [여기서 나만의 지도를 공유해 보세요! 🚗](https://preview.dailyroad.site/)

<div align="center">
    <a href="https://preview.dailyroad.site/">
        <img src="https://github.com/user-attachments/assets/d1b124e0-682c-4665-a418-600e97d15a35" width="1000" alt="오늘의 길">
    </a>
</div>

### 프로젝트 소개

> **오늘의 길**은 사람들이 자신의 경험과 취향을 반영한 지도를 만들고 공유할 수 있는 플랫폼입니다.
>
> 맛집이나 여행지를 기록할 때 다양한 앱과 도구를 사용하는 대신,  
> 이곳에서는 장소와 코스를 자유롭게 구성하고,다른 사람들과 공유하며 소통할 수 있습니다.
>
> 개인적인 기억과 감상을 담은 지도를 통해 새로운 발견을 하고,  
> 일상의 영감을 얻어보세요!
>
> <a href="https://boostcampwm-2024.github.io/web09-DailyRoad/" target='_blank'>🌈 소개 페이지를 구경해보세요!</a>
>
> <a href="https://forms.gle/Hkckwm6vtZxoEnxH6" target='_blank'>📝 피드백을 남겨주세요!</a>

<br/>
<br/>

### 핵심 기능

---

### 나만의 지도 만들기

> 장소 검색하기  
> 핀 추가하기

### 나만의 코스 만들기

> 경로 표시

<br/>
<br/>

### 핵심 경험

_더 자세히 보려면 제목을 클릭해 주세요!_

---

### [Elasticsearch 를 사용한 검색 기능 개선]()

> Elasticsearch를 도입해 검색 로직의 가중치를 조정하고 RDB와 동기화를 유지하여 검색 정확도를 개선했습니다.  
> 싱글 노드 환경에서의 장애 상황에 대비해 SFP 대처 로직을 추가했고,  
> 결과적으로 동의어 처리와 오타 교정 기능을 통해 검색 신뢰도를 높였습니다.

### [마커 클러스터링]()

> 지도 상 수많은 마커를 효과적으로 표현하기 위해 위해 클러스터링을 도입했습니다.  
> 그 과정에서 마커의 과도한 렌더링과 깜빡임 문제를 만났습니다.  
> 이를 해결하기 위해 렌더링 조건을 최적화함으로써 렌더링 빈도를 줄이고, 사용자 경험을 향상시켰습니다.

### [로그 모니터링 시스템]()

> 로깅 라이브러리와 로그 레벨 기준을 명확히 하고,  
> Kibana와 Slack을 연동해 실시간 모니터링 시스템을 구축했습니다.  
> 이를 통해 서버 장애 시 문제 파악이 빨라졌고, 운영 신뢰도를 향상시켰습니다.

### [테스트]()

> 모킹 없이 실제 환경과 유사한 조건에서 테스트를 수행했습니다.  
> 컨테이너를 사용해 다양한 환경에서 안정적으로 테스트를 진행했으며,  
> 이를 통해 리팩터링 및 버그 수정 시 점검이 용이해졌고, 코드 품질과 신뢰도가 향상되었습니다.

### [React로 래핑되지 않은 JS 라이브러리 사용]()

> JS 라이브러리와 React의 결합 과정에서 높은 자유도로 인해  
> 마커 관리 주체가 분산되는 문제를 겪었습니다.  
> 이를 해결하기 위해 코드 작성 규칙을 정립해 마커 관리 체계를 통합하고, 사용성과 안정성을 개선했습니다.

<br/>
<br/>

### 시스템 아키텍처

---

<img src="https://github.com/user-attachments/assets/d568b413-526c-4412-adbc-516aeb2bf1ef" width=1000 alt="아키텍처">

<br/>
<br/>

### 기술 스택

---

| **도메인**     | **기술 스택**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **공통**       | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=ffffff) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=ffffff) ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=ffffff)                                                                                                                                                                                                                                                                                                                                        |
| **프론트엔드** | ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=Vite&logoColor=ffffff) ![React](https://img.shields.io/badge/React-61DAFB?logo=React&logoColor=ffffff) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=ffffff) ![React Query](https://img.shields.io/badge/React_Query-FF4154?logo=reactquery&logoColor=ffffff) ![Zustand](https://img.shields.io/badge/Zustand-443E38?logo=react&logoColor=ffffff)                                                                                                                                                             |
| **백엔드**     | ![Node.js](https://img.shields.io/badge/Node.js-114411?logo=node.js) ![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=ffffff) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=ffffff) ![TypeORM](https://img.shields.io/badge/TypeORM-3178C6?logo=typeorm&logoColor=ffffff) ![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?logo=elasticsearch&logoColor=ffffff) ![Kibana](https://img.shields.io/badge/Kibana-005571?logo=kibana&logoColor=ffffff) ![Logstash](https://img.shields.io/badge/Logstash-005571?logo=logstash&logoColor=ffffff) |
| **배포**       | ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=githubactions&logoColor=ffffff) ![Nginx](https://img.shields.io/badge/nginx-014532?logo=Nginx&logoColor=009639&) ![Naver Cloud Platform](https://img.shields.io/badge/Naver%20Cloud%20Platform-03C75A?logo=naver&logoColor=ffffff)                                                                                                                                                                                                                                                                                                    |
| **협업 도구**  | ![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=ffffff) ![Notion](https://img.shields.io/badge/Notion-000000?logo=notion) ![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=ffffff) ![Slack](https://img.shields.io/badge/Slack-4A154B?logo=slack&logoColor=ffffff)                                                                                                                                                                                                                                                                                              |

<br/>
<br/>

### 팀원 소개

|                 [J088\_도원진](https://github.com/1119wj)                  |                [J151\_안금장](https://github.com/koomchang)                |                [J105\_박민서](https://github.com/Miensoap)                 |                [J270 \_한동효](https://github.com/hyohyo12)                 |
| :------------------------------------------------------------------------: | :------------------------------------------------------------------------: | :------------------------------------------------------------------------: | :-------------------------------------------------------------------------: |
| <img src="https://avatars.githubusercontent.com/u/95432846?v=4" width=150> | <img src="https://avatars.githubusercontent.com/u/90228925?v=4" width=150> | <img src="https://avatars.githubusercontent.com/u/87180146?v=4" width=150> | <img src="https://avatars.githubusercontent.com/u/129946082?v=4" width=150> |
|                                     FE                                     |                                     BE                                     |                                     BE                                     |                                     BE                                      |

| 🏷️ 바로가기 | [**팀 Notion**](https://elastic-bread-9ef.notion.site/12963e6f4ee98074b6f9f70cfa9ac836) | [위키](https://github.com/boostcampwm-2024/web09-DailyRoad/wiki) |
| :---------: | :-------------------------------------------------------------------------------------: | :--------------------------------------------------------------: |
