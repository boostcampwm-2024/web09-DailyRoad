-- USER 데이터 삽입
INSERT INTO USER (provider, nickname, oauth_id, role, profile_image_url)
VALUES ('google', '홍길동', 'oauth1', 'USER', 'https://example.com/profile1.jpg'),
       ('google', '이순신', 'oauth2', 'USER', 'https://example.com/profile2.jpg'),
       ('google', '신사임당', 'oauth3', 'USER', 'https://example.com/profile3.jpg'),
       ('google', '유관순', 'oauth4', 'USER', 'https://example.com/profile4.jpg'),
       ('google', '장보고', 'oauth5', 'USER', 'https://example.com/profile5.jpg');


-- PLACE 데이터 삽입
INSERT INTO PLACE (google_place_id, name, thumbnail_url, rating, longitude, latitude, formatted_address, description,
                   detail_page_url)
VALUES ('place1', '서울타워', 'https://example.com/place1.jpg', 4.5, 126.9882, 37.5512, '서울, 대한민국',
        '서울을 한눈에 볼 수 있는 인기 명소입니다.', 'https://example.com/detail1'),
       ('place2', '북촌 한옥마을', 'https://example.com/place2.jpg', 4.0, 126.9849, 37.5826, '서울, 대한민국',
        '전통 한옥들이 모여있는 아름다운 마을입니다.', 'https://example.com/detail2'),
       ('place3', '광장시장', 'https://example.com/place3.jpg', 4.2, 126.9961, 37.5704, '서울, 대한민국',
        '다양한 전통 음식을 맛볼 수 있는 서울의 대표 시장입니다.', 'https://example.com/detail3'),
       ('place4', '경복궁', 'https://example.com/place4.jpg', 4.1, 126.9769, 37.5796, '서울, 대한민국',
        '한국의 전통 궁궐로 역사적 가치가 높은 명소입니다.', 'https://example.com/detail4'),
       ('place5', '남산', 'https://example.com/place5.jpg', 3.9, 126.9906, 37.5532, '서울, 대한민국',
        '아름다운 야경과 자연을 즐길 수 있는 남산입니다.', 'https://example.com/detail5'),
       ('place6', '이태원', 'https://example.com/place6.jpg', 4.3, 126.9945, 37.5340, '서울, 대한민국',
        '다양한 문화를 경험할 수 있는 인기 관광지입니다.', 'https://example.com/detail6'),
       ('place7', '동대문 디자인 플라자', 'https://example.com/place7.jpg', 4.4, 127.0074, 37.5663, '서울, 대한민국',
        '혁신적인 디자인과 건축물로 유명한 문화 공간입니다.', 'https://example.com/detail7'),
       ('place8', '청계천', 'https://example.com/place8.jpg', 4.6, 126.9895, 37.5703, '서울, 대한민국',
        '서울 중심을 가로지르는 아름다운 하천 산책로입니다.', 'https://example.com/detail8'),
       ('place9', '롯데월드', 'https://example.com/place9.jpg', 4.7, 127.0980, 37.5110, '서울, 대한민국',
        '다양한 놀이기구와 어트랙션을 즐길 수 있는 테마파크입니다.', 'https://example.com/detail9'),
       ('place10', '잠실야구장', 'https://example.com/place10.jpg', 4.8, 127.0726, 37.5152, '서울, 대한민국',
        '서울의 인기 야구 경기를 즐길 수 있는 장소입니다.', 'https://example.com/detail10');


-- MAP 데이터 삽입
INSERT INTO MAP (user_id, thumbnail_url, title, is_public, description)
VALUES (1, 'https://example.com/map1.jpg', '서울 명소 지도', TRUE, '서울의 주요 명소를 안내하는 지도입니다.'),
       (2, 'https://example.com/map2.jpg', '부산 여행 지도', TRUE, '부산의 명소와 맛집을 포함한 여행 안내 지도입니다.'),
       (3, 'https://example.com/map3.jpg', '제주도 맛집 지도', TRUE, '제주도의 인기 맛집을 정리한 지도입니다.'),
       (4, 'https://example.com/map4.jpg', '강원도 자연 지도', TRUE, '강원도의 자연 관광지를 소개하는 지도입니다.'),
       (5, 'https://example.com/map5.jpg', '전주 한옥마을 지도', TRUE, '전주 한옥마을과 주변 볼거리를 포함한 지도입니다.'),
       (1, 'https://example.com/map6.jpg', '인천 공항 안내 지도', TRUE, '인천 공항 내의 주요 위치와 시설을 안내합니다.'),
       (2, 'https://example.com/map7.jpg', '대구 문화유산 지도', TRUE, '대구의 문화유산을 중심으로 한 관광 지도입니다.'),
       (3, 'https://example.com/map8.jpg', '광주 예술 지도', TRUE, '광주의 예술적 장소와 전시회 정보를 담은 지도입니다.'),
       (4, 'https://example.com/map9.jpg', '수도권 출퇴근 지도', TRUE, '수도권의 출퇴근 최적 경로를 안내하는 지도입니다.'),
       (5, 'https://example.com/map10.jpg', '해운대 바다 지도', TRUE, '해운대 해변과 인근 관광 명소를 표시한 지도입니다.'),
       (1, 'https://example.com/map1.jpg', '서울 역사 탐방 지도', TRUE, '서울의 역사적 장소들을 탐방할 수 있는 지도입니다.'),
       (2, 'https://example.com/map2.jpg', '부산 해변 코스', TRUE, '부산의 해변을 중심으로 여행할 수 있는 안내 지도입니다.'),
       (3, 'https://example.com/map3.jpg', '제주도 휴양지 지도', TRUE, '제주도의 휴양지와 자연을 즐길 수 있는 지도입니다.'),
       (4, 'https://example.com/map4.jpg', '강원도 산악 지도', TRUE, '강원도의 산과 계곡을 탐방할 수 있는 산악 지도입니다.'),
       (5, 'https://example.com/map5.jpg', '전주 맛집 지도', TRUE, '전주의 유명 맛집과 카페를 소개하는 지도입니다.'),
       (1, 'https://example.com/map6.jpg', '인천 쇼핑 명소 지도', TRUE, '인천의 인기 쇼핑 명소를 모은 지도입니다.'),
       (2, 'https://example.com/map7.jpg', '대구 핫플레이스 지도', TRUE, '대구의 핫플레이스를 즐길 수 있는 안내 지도입니다.'),
       (3, 'https://example.com/map8.jpg', '광주 먹거리 지도', TRUE, '광주의 다양한 먹거리와 맛집을 소개하는 지도입니다.'),
       (4, 'https://example.com/map9.jpg', '경기도 가족 여행 지도', TRUE, '경기도에서 가족이 함께 즐길 수 있는 여행 코스 지도입니다.'),
       (1, 'https://example.com/map11.jpg', '서울 야경 명소 지도', TRUE, '서울에서 멋진 야경을 볼 수 있는 명소들을 정리한 지도입니다.'),
       (2, 'https://example.com/map12.jpg', '부산 해변 명소 지도', TRUE, '부산의 해변 명소와 인근 여행지를 소개하는 지도입니다.'),
       (3, 'https://example.com/map13.jpg', '제주도 카페 지도', TRUE, '제주도의 유명 카페를 모아놓은 지도입니다.'),
       (4, 'https://example.com/map14.jpg', '강원도 산책로 지도', TRUE, '강원도의 아름다운 산책로를 안내하는 지도입니다.'),
       (5, 'https://example.com/map15.jpg', '전주 전통 음식점 지도', TRUE, '전주의 전통 음식점을 중심으로 한 지도입니다.'),
       (1, 'https://example.com/map16.jpg', '인천 공원 및 녹지 지도', TRUE, '인천 내의 공원과 녹지를 안내하는 지도입니다.'),
       (2, 'https://example.com/map17.jpg', '대구 중심가 명소 지도', TRUE, '대구의 중심가에 위치한 명소들을 소개하는 지도입니다.'),
       (3, 'https://example.com/map18.jpg', '광주 문화 행사 지도', TRUE, '광주에서 열리는 문화 행사를 확인할 수 있는 지도입니다.'),
       (4, 'https://example.com/map19.jpg', '경기 북부 여행 지도', TRUE, '경기 북부의 여행지와 관광 명소를 소개하는 지도입니다.'),
       (5, 'https://example.com/map20.jpg', '해운대 일몰 명소 지도', TRUE, '해운대에서 아름다운 일몰을 감상할 수 있는 명소들입니다.');

-- COURSE 데이터 삽입
INSERT INTO COURSE (user_id, thumbnail_url, title, is_public, description)
VALUES (1, 'https://example.com/course1.jpg', '서울 1일 코스', TRUE, '서울 주요 관광지를 하루 만에 돌아볼 수 있는 코스입니다.'),
       (2, 'https://example.com/course2.jpg', '부산 2일 코스', TRUE, '부산의 명소를 2일에 걸쳐 돌아보는 코스입니다.'),
       (3, 'https://example.com/course3.jpg', '제주도 3일 코스', TRUE, '제주도 전역을 3일간 여행할 수 있는 코스입니다.'),
       (4, 'https://example.com/course4.jpg', '강원도 힐링 코스', TRUE, '강원도의 자연 속에서 힐링할 수 있는 코스입니다.'),
       (5, 'https://example.com/course5.jpg', '전주 문화 체험 코스', TRUE, '전주에서 다양한 문화 체험을 할 수 있는 코스입니다.'),
       (1, 'https://example.com/course6.jpg', '인천 해양 체험 코스', TRUE, '인천의 해양 체험 활동을 중심으로 한 코스입니다.'),
       (2, 'https://example.com/course7.jpg', '대구 역사 탐방 코스', TRUE, '대구의 역사적 장소를 방문하는 코스입니다.'),
       (3, 'https://example.com/course8.jpg', '광주 예술 투어 코스', TRUE, '광주의 예술적 명소를 탐방하는 코스입니다.'),
       (4, 'https://example.com/course9.jpg', '경기도 농촌 체험 코스', TRUE, '경기도에서 농촌 체험을 할 수 있는 코스입니다.'),
       (5, 'https://example.com/course10.jpg', '해운대 바다 코스', TRUE, '해운대 해변과 인근 관광 명소를 둘러볼 수 있는 코스입니다.'),
       (2, 'https://example.com/course2.jpg', '부산 미식 여행 코스', TRUE, '부산의 다양한 맛집을 둘러보는 미식 여행 코스입니다.'),
       (3, 'https://example.com/course3.jpg', '제주도 오름 코스', TRUE, '제주도의 오름을 탐방할 수 있는 코스입니다.'),
       (4, 'https://example.com/course4.jpg', '강원도 캠핑 코스', TRUE, '강원도에서 캠핑과 자연을 즐길 수 있는 코스입니다.'),
       (5, 'https://example.com/course5.jpg', '전주 전통 체험 코스', TRUE, '전주에서 전통 문화를 체험하는 코스입니다.'),
       (1, 'https://example.com/course11.jpg', '서울 카페 투어 코스', TRUE, '서울에서 인기 있는 카페들을 방문하는 투어 코스입니다.'),
       (2, 'https://example.com/course12.jpg', '부산 해안 드라이브 코스', TRUE, '부산의 아름다운 해안을 따라 드라이브할 수 있는 코스입니다.'),
       (3, 'https://example.com/course13.jpg', '제주도 사진 스팟 코스', TRUE, '제주도의 유명 사진 명소를 돌아보는 코스입니다.'),
       (4, 'https://example.com/course14.jpg', '강원도 겨울 여행 코스', TRUE, '강원도의 겨울철 명소들을 탐방할 수 있는 코스입니다.'),
       (5, 'https://example.com/course15.jpg', '전주 벚꽃 구경 코스', TRUE, '전주의 벚꽃 명소들을 방문하는 봄철 코스입니다.'),
       (1, 'https://example.com/course16.jpg', '인천 미술관 투어 코스', TRUE, '인천의 다양한 미술관을 방문하는 코스입니다.'),
       (2, 'https://example.com/course17.jpg', '대구 축제 투어 코스', TRUE, '대구에서 열리는 다양한 축제를 경험할 수 있는 코스입니다.'),
       (3, 'https://example.com/course18.jpg', '광주 역사 문화 코스', TRUE, '광주의 역사적 유적지를 탐방하는 코스입니다.'),
       (4, 'https://example.com/course19.jpg', '경기 남부 캠핑 코스', TRUE, '경기 남부 지역에서 즐길 수 있는 캠핑 명소를 소개하는 코스입니다.'),
       (5, 'https://example.com/course20.jpg', '해운대 해양 스포츠 코스', TRUE, '해운대에서 해양 스포츠를 체험할 수 있는 코스입니다.');

-- MAP_PLACE 데이터 삽입
INSERT INTO MAP_PLACE (place_id, map_id, description)
VALUES (1, 1, '서울 명소 지도에 포함된 인기 명소 1입니다.'),
       (2, 2, '부산 여행 지도에 추가된 해변 명소 2입니다.'),
       (3, 3, '제주도 맛집 지도에 등록된 유명한 식당 3입니다.'),
       (4, 4, '강원도 자연 지도에서 산책하기 좋은 장소 4입니다.'),
       (5, 5, '전주 한옥마을 지도에 표시된 전통적인 명소 5입니다.'),
       (6, 6, '인천 공항 안내 지도에 포함된 주요 위치 6입니다.'),
       (7, 7, '대구 문화유산 지도에서 역사적 의미가 큰 장소 7입니다.'),
       (8, 8, '광주 예술 지도에 소개된 독특한 예술 공간 8입니다.'),
       (9, 9, '수도권 출퇴근 지도에서 편리한 환승역 9입니다.'),
       (10, 10, '해운대 바다 지도에 표시된 아름다운 해변 명소 10입니다.'),
       (1, 2, '부산 여행 지도에 특별히 포함된 명소 1입니다.'),
       (2, 3, '제주도 맛집 지도에 추천된 맛집 2입니다.'),
       (3, 4, '강원도 자연 지도에서 자연을 만끽할 수 있는 장소 3입니다.');

-- COURSE_PLACE 데이터 삽입
INSERT INTO COURSE_PLACE (`order`, place_id, course_id, description)
VALUES (1, 1, 1, '서울 1일 코스에 포함된 필수 방문지 1입니다.'),
       (2, 2, 2, '부산 2일 코스에 추가된 추천 장소 2입니다.'),
       (3, 3, 3, '제주도 3일 코스에서 꼭 들러야 할 명소 3입니다.'),
       (4, 4, 4, '강원도 힐링 코스에 포함된 자연 휴양지 4입니다.'),
       (5, 5, 5, '전주 문화 체험 코스에 추가된 문화적 명소 5입니다.'),
       (6, 6, 6, '인천 해양 체험 코스에서 즐길 수 있는 해양 명소 6입니다.'),
       (7, 7, 7, '대구 역사 탐방 코스에서 볼 수 있는 유서 깊은 장소 7입니다.'),
       (8, 8, 8, '광주 예술 투어 코스에서 예술적 영감을 주는 장소 8입니다.'),
       (9, 9, 9, '경기도 농촌 체험 코스에 포함된 체험형 명소 9입니다.'),
       (10, 10, 10, '해운대 바다 코스에서 일몰이 아름다운 장소 10입니다.'),
       (2, 1, 3, '제주도 3일 코스에 추가된 특별한 장소 1입니다.'),
       (3, 2, 4, '강원도 힐링 코스에서 자연을 느낄 수 있는 장소 2입니다.'),
       (4, 3, 5, '전주 문화 체험 코스에 포함된 전통적인 명소 3입니다.');

