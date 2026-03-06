CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PHOTOS
-- =========================
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- FOLLOWERS (self relation)
-- =========================
CREATE TABLE followers (
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (follower_id, following_id),

    CONSTRAINT fk_follower
        FOREIGN KEY(follower_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_following
        FOREIGN KEY(following_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- LIKES
-- =========================
CREATE TABLE likes (
    user_id UUID NOT NULL,
    photo_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, photo_id),

    CONSTRAINT fk_like_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_like_photo
        FOREIGN KEY(photo_id)
        REFERENCES photos(id)
        ON DELETE CASCADE
);

-- =========================
-- INDEXES (rendimiento)
-- =========================
CREATE INDEX idx_photos_user ON photos(user_id);
CREATE INDEX idx_likes_photo ON likes(photo_id);
CREATE INDEX idx_followers_following ON followers(following_id);


-- DESDE AQUI ESTAMOS ACTUALIZANDO LA BASE////////////////////////////////////////////
-- ///////////////////////////////////////////////////////////////////////////////////

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE photo_tags (
    photo_id UUID NOT NULL,
    tag_id UUID NOT NULL,

    PRIMARY KEY(photo_id, tag_id),

    CONSTRAINT fk_photo
        FOREIGN KEY(photo_id)
        REFERENCES photos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tag
        FOREIGN KEY(tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);

ALTER TABLE photos
ADD COLUMN censored BOOLEAN DEFAULT FALSE;


SELECT * FROM users;
SELECT * FROM photos;
SELECT * FROM followers;
SELECT * FROM tags;
SELECT * FROM photo_tags;
