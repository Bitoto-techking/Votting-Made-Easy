"""
config.py — Application configuration loaded from environment variables.
Copy .env.example to .env and fill in your values before running.
"""
import os


class Config:
    # ── Security ──────────────────────────────────────────────────────────────
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-this-in-production-super-secret")

    # ── MySQL / MariaDB ───────────────────────────────────────────────────────
    MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")
    MYSQL_USER = os.environ.get("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "")
    MYSQL_DB = os.environ.get("MYSQL_DB", "campus_vote")
    MYSQL_CURSORCLASS = "DictCursor"   # rows returned as dicts, not tuples

    # ── Upload folder (candidate photos) ─────────────────────────────────────
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "static", "img")
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024   # 5 MB
