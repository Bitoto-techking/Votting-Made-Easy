-- ============================================================
-- schema.sql — Campus Vote database schema
-- Run once:  mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS campus_vote
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE campus_vote;

-- ── Students ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
    id            INT           AUTO_INCREMENT PRIMARY KEY,
    student_id    VARCHAR(20)   UNIQUE NOT NULL,   -- e.g. CT/2024/001
    full_name     VARCHAR(100)  NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    has_voted     BOOLEAN       DEFAULT FALSE,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Candidates ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS candidates (
    id              INT           AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(100)  NOT NULL,
    position        VARCHAR(100)  NOT NULL DEFAULT 'Delegate',
    bio             TEXT,
    photo_filename  VARCHAR(255),
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Votes ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS votes (
    id              INT       AUTO_INCREMENT PRIMARY KEY,
    student_db_id   INT       NOT NULL,
    candidate_id    INT       NOT NULL,
    voted_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_db_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id)  REFERENCES candidates(id) ON DELETE CASCADE,
    -- One vote per student — enforced at DB level
    UNIQUE KEY one_vote_per_student (student_db_id)
) ENGINE=InnoDB;

-- ── Admins ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
    id            INT          AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Voting settings (single row, id=1) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS voting_settings (
    id              INT          PRIMARY KEY DEFAULT 1,
    voting_open     BOOLEAN      DEFAULT TRUE,
    start_time      DATETIME,
    end_time        DATETIME,
    election_title  VARCHAR(200) DEFAULT 'Computer Technology Delegate Election'
) ENGINE=InnoDB;

-- Seed default settings row (safe to re-run)
INSERT IGNORE INTO voting_settings (id, voting_open, election_title)
VALUES (1, TRUE, 'Computer Technology Delegate Election');
