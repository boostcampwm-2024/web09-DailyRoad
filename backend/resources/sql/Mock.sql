-- USER 데이터 삽입
INSERT INTO USER (provider, nickname, oauth_id, role, profile_image_url)
VALUES ('google', 'user1', 'oauth1', 'USER', 'https://example.com/profile1.jpg'),
       ('google', 'user2', 'oauth2', 'USER', 'https://example.com/profile2.jpg'),
       ('google', 'user3', 'oauth3', 'USER', 'https://example.com/profile3.jpg'),
       ('google', 'user4', 'oauth4', 'USER', 'https://example.com/profile4.jpg'),
       ('google', 'user5', 'oauth5', 'USER', 'https://example.com/profile5.jpg');

-- PLACE 데이터 삽입
INSERT INTO PLACE (google_place_id, name, thumbnail_url, rating, longitude, latitude, formatted_address, description,
                   detail_page_url)
VALUES ('place1', 'Place 1', 'https://example.com/place1.jpg', 4.5, 127.001, 37.501, 'Seoul, South Korea',
        'Beautiful place 1', 'https://example.com/detail1'),
       ('place2', 'Place 2', 'https://example.com/place2.jpg', 4.0, 127.002, 37.502, 'Seoul, South Korea',
        'Beautiful place 2', 'https://example.com/detail2'),
       ('place3', 'Place 3', 'https://example.com/place3.jpg', 4.2, 127.003, 37.503, 'Seoul, South Korea',
        'Beautiful place 3', 'https://example.com/detail3'),
       ('place4', 'Place 4', 'https://example.com/place4.jpg', 4.1, 127.004, 37.504, 'Seoul, South Korea',
        'Beautiful place 4', 'https://example.com/detail4'),
       ('place5', 'Place 5', 'https://example.com/place5.jpg', 3.9, 127.005, 37.505, 'Seoul, South Korea',
        'Beautiful place 5', 'https://example.com/detail5'),
       ('place6', 'Place 6', 'https://example.com/place6.jpg', 4.3, 127.006, 37.506, 'Seoul, South Korea',
        'Beautiful place 6', 'https://example.com/detail6'),
       ('place7', 'Place 7', 'https://example.com/place7.jpg', 4.4, 127.007, 37.507, 'Seoul, South Korea',
        'Beautiful place 7', 'https://example.com/detail7'),
       ('place8', 'Place 8', 'https://example.com/place8.jpg', 4.6, 127.008, 37.508, 'Seoul, South Korea',
        'Beautiful place 8', 'https://example.com/detail8'),
       ('place9', 'Place 9', 'https://example.com/place9.jpg', 4.7, 127.009, 37.509, 'Seoul, South Korea',
        'Beautiful place 9', 'https://example.com/detail9'),
       ('place10', 'Place 10', 'https://example.com/place10.jpg', 4.8, 127.010, 37.510, 'Seoul, South Korea',
        'Beautiful place 10', 'https://example.com/detail10');

-- MAP 데이터 삽입
INSERT INTO MAP (user_id, thumbnail_url, title, is_public, description)
VALUES (1, 'https://example.com/map1.jpg', 'Map 1', TRUE, 'Description for Map 1'),
       (2, 'https://example.com/map2.jpg', 'Map 2', TRUE, 'Description for Map 2'),
       (3, 'https://example.com/map3.jpg', 'Map 3', TRUE, 'Description for Map 3'),
       (4, 'https://example.com/map4.jpg', 'Map 4', TRUE, 'Description for Map 4'),
       (5, 'https://example.com/map5.jpg', 'Map 5', TRUE, 'Description for Map 5'),
       (1, 'https://example.com/map6.jpg', 'Map 6', TRUE, 'Description for Map 6'),
       (2, 'https://example.com/map7.jpg', 'Map 7', TRUE, 'Description for Map 7'),
       (3, 'https://example.com/map8.jpg', 'Map 8', TRUE, 'Description for Map 8'),
       (4, 'https://example.com/map9.jpg', 'Map 9', TRUE, 'Description for Map 9'),
       (5, 'https://example.com/map10.jpg', 'Map 10', TRUE, 'Description for Map 10');

-- COURSE 데이터 삽입
INSERT INTO COURSE (user_id, thumbnail_url, title, is_public, description)
VALUES (1, 'https://example.com/course1.jpg', 'Course 1', TRUE, 'Description for Course 1'),
       (2, 'https://example.com/course2.jpg', 'Course 2', TRUE, 'Description for Course 2'),
       (3, 'https://example.com/course3.jpg', 'Course 3', TRUE, 'Description for Course 3'),
       (4, 'https://example.com/course4.jpg', 'Course 4', TRUE, 'Description for Course 4'),
       (5, 'https://example.com/course5.jpg', 'Course 5', TRUE, 'Description for Course 5'),
       (1, 'https://example.com/course6.jpg', 'Course 6', TRUE, 'Description for Course 6'),
       (2, 'https://example.com/course7.jpg', 'Course 7', TRUE, 'Description for Course 7'),
       (3, 'https://example.com/course8.jpg', 'Course 8', TRUE, 'Description for Course 8'),
       (4, 'https://example.com/course9.jpg', 'Course 9', TRUE, 'Description for Course 9'),
       (5, 'https://example.com/course10.jpg', 'Course 10', TRUE, 'Description for Course 10');

-- MAP_PLACE 데이터 삽입
INSERT INTO MAP_PLACE (place_id, map_id, description)
VALUES (1, 1, 'Place 1 in Map 1'),
       (2, 2, 'Place 2 in Map 2'),
       (3, 3, 'Place 3 in Map 3'),
       (4, 4, 'Place 4 in Map 4'),
       (5, 5, 'Place 5 in Map 5'),
       (6, 6, 'Place 6 in Map 6'),
       (7, 7, 'Place 7 in Map 7'),
       (8, 8, 'Place 8 in Map 8'),
       (9, 9, 'Place 9 in Map 9'),
       (10, 10, 'Place 10 in Map 10'),
       (1, 2, 'Place 1 in Map 2'),
       (2, 3, 'Place 2 in Map 3'),
       (3, 4, 'Place 3 in Map 4');

-- COURSE_PLACE 데이터 삽입
INSERT INTO COURSE_PLACE (`order`, place_id, course_id, description)
VALUES (1, 1, 1, 'Place 1 in Course 1'),
       (2, 2, 2, 'Place 2 in Course 2'),
       (3, 3, 3, 'Place 3 in Course 3'),
       (4, 4, 4, 'Place 4 in Course 4'),
       (5, 5, 5, 'Place 5 in Course 5'),
       (6, 6, 6, 'Place 6 in Course 6'),
       (7, 7, 7, 'Place 7 in Course 7'),
       (8, 8, 8, 'Place 8 in Course 8'),
       (9, 9, 9, 'Place 9 in Course 9'),
       (10, 10, 10, 'Place 10 in Course 10'),
       (2, 1, 3, 'Place 1 in Course 3'),
       (3, 2, 4, 'Place 2 in Course 4'),
       (4, 3, 5, 'Place 3 in Course 5');
