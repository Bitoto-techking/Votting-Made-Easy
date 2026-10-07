"""
create_admin.py — Run ONCE to create the first admin account.
Usage:
    python create_admin.py
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Import app and extensions
from app import app, bcrypt, mysql

ADMIN_USERNAME = os.environ.get("ADMIN_USER", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASS", "Admin@123")


def create_admin():
    with app.app_context():
        password_hash = bcrypt.generate_password_hash(ADMIN_PASSWORD).decode("utf-8")
        conn = mysql.connection
        cur  = conn.cursor()

        try:
            cur.execute(
                "INSERT INTO admins (username, password_hash) VALUES (%s, %s)",
                (ADMIN_USERNAME, password_hash),
            )
            conn.commit()
            print(f"[✓] Admin '{ADMIN_USERNAME}' created successfully.")
            print(f"    Default password: {ADMIN_PASSWORD}")
            print("    ⚠  Change this password immediately via the Admin Settings page!")
        except Exception as exc:
            if "duplicate" in str(exc).lower() or "1062" in str(exc):
                print(f"[!] Admin '{ADMIN_USERNAME}' already exists. Skipping.")
            else:
                print(f"[✗] Error: {exc}")
        finally:
            cur.close()


if __name__ == "__main__":
    create_admin()
