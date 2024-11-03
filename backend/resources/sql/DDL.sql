-- USER 테이블
CREATE TABLE USER
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    provider      VARCHAR(255)        NOT NULL,
    nickname      VARCHAR(255)        NOT NULL,
    oauth_id      VARCHAR(255) UNIQUE NOT NULL,
    role          VARCHAR(50)         NOT NULL,
    profile_image VARCHAR(255),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP           NULL
);

-- PLACE 테이블
CREATE TABLE PLACE
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    google_place_id   VARCHAR(255) UNIQUE NOT NULL,
    name              VARCHAR(255)        NOT NULL,
    thumbnail         VARCHAR(255),
    rating            FLOAT,
    longitude         DECIMAL(10, 7), -- 경도
    latitude          DECIMAL(10, 7), -- 위도
    formatted_address VARCHAR(255),
    description       TEXT,
    detail_page_url   VARCHAR(255),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at        TIMESTAMP           NULL
);

-- MAP 테이블
CREATE TABLE MAP
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT          NOT NULL,
    thumbnail   VARCHAR(255),
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP    NULL,
    FOREIGN KEY (user_id) REFERENCES USER (id) ON DELETE CASCADE
);

-- MAP_PLACE 테이블
CREATE TABLE MAP_PLACE
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    place_id    INT       NOT NULL,
    map_id      INT       NOT NULL,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP NULL,
    FOREIGN KEY (place_id) REFERENCES PLACE (id) ON DELETE CASCADE,
    FOREIGN KEY (map_id) REFERENCES MAP (id) ON DELETE CASCADE
);

-- COURSE 테이블
CREATE TABLE COURSE
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT          NOT NULL,
    thumbnail   VARCHAR(255),
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP    NULL,
    FOREIGN KEY (user_id) REFERENCES USER (id) ON DELETE CASCADE
);

-- COURSE_PLACE 테이블
CREATE TABLE COURSE_PLACE
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    `order`     INT       NOT NULL,
    place_id    INT       NOT NULL,
    course_id   INT       NOT NULL,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP NULL,
    FOREIGN KEY (place_id) REFERENCES PLACE (id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES COURSE (id) ON DELETE CASCADE
);
