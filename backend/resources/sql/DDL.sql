-- 무결성 제약 조건 비활성화
SET FOREIGN_KEY_CHECKS = 0;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS COURSE_PLACE;
DROP TABLE IF EXISTS COURSE;
DROP TABLE IF EXISTS MAP_PLACE;
DROP TABLE IF EXISTS MAP;
DROP TABLE IF EXISTS PLACE;
DROP TABLE IF EXISTS USER;
DROP TABLE IF EXISTS REFRESH_TOKEN;
DROP TABLE IF EXISTS BANNER;

-- 무결성 제약 조건 재활성화
SET FOREIGN_KEY_CHECKS = 1;

SET time_zone = '+09:00';

-- USER 테이블
CREATE TABLE USER
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    provider          VARCHAR(255)        NOT NULL,
    nickname          VARCHAR(255)        NOT NULL,
    oauth_id          VARCHAR(255) UNIQUE NOT NULL,
    role              VARCHAR(50)         NOT NULL,
    profile_image_url VARCHAR(255),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at        TIMESTAMP           NULL
);

-- PLACE 테이블
CREATE TABLE PLACE
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    google_place_id   CHAR(50) UNIQUE NOT NULL,
    name              VARCHAR(255)    NOT NULL,
    thumbnail_url     VARCHAR(255),
    rating            DECIMAL(3, 2),
    longitude         DECIMAL(10, 7), -- 경도
    latitude          DECIMAL(10, 7), -- 위도
    formatted_address VARCHAR(255),
    category          VARCHAR(50),
    description       TEXT,
    detail_page_url   VARCHAR(255),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at        TIMESTAMP       NULL
);

-- MAP 테이블
CREATE TABLE MAP
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT          NOT NULL,
    thumbnail_url VARCHAR(255),
    title         VARCHAR(255) NOT NULL,
    is_public     BOOLEAN      NOT NULL,
    description   TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP    NULL,
    FOREIGN KEY (user_id) REFERENCES USER (id) ON DELETE CASCADE
);

-- MAP_PLACE 테이블
CREATE TABLE MAP_PLACE
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    place_id    INT                       NOT NULL,
    map_id      INT                       NOT NULL,
    description TEXT,
    color       VARCHAR(20) DEFAULT 'RED' NOT NULL,
    created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP                 NULL,
    FOREIGN KEY (place_id) REFERENCES PLACE (id) ON DELETE CASCADE,
    FOREIGN KEY (map_id) REFERENCES MAP (id) ON DELETE CASCADE
);

-- COURSE 테이블
CREATE TABLE COURSE
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT          NOT NULL,
    thumbnail_url VARCHAR(255),
    title         VARCHAR(255) NOT NULL,
    is_public     BOOLEAN      NOT NULL,
    description   TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP    NULL,
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

-- REFRESH_TOKEN 테이블
CREATE TABLE REFRESH_TOKEN
(
    token      VARCHAR(255) PRIMARY KEY,
    user_id    INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USER (id) ON DELETE CASCADE,
    UNIQUE INDEX idx_user_id (user_id)
);

CREATE TABLE BANNER
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    image_url    VARCHAR(255) NOT NULL,
    redirect_url VARCHAR(255) NOT NULL,
    started_at   TIMESTAMP    NOT NULL,
    ended_at     TIMESTAMP    NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   TIMESTAMP    NULL
)