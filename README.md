# 🗳️ Campus Delegate Voting Platform

**Course:** Computer Technology | **Stack:** Flask · MySQL · Bootstrap 5

A complete, production-ready web voting system for electing class/department delegates.  
Features student login, single-vote enforcement (application + DB level), live results, admin panel, countdown timer, and CSV export.

---

## 📁 Project Structure

```
campus_vote/
├── app.py                    # Main Flask application
├── config.py                 # DB & app configuration
├── create_admin.py           # One-time admin account creator
├── requirements.txt          # Python dependencies
├── schema.sql                # MySQL database schema
├── README.md
├── static/
│   ├── css/style.css         # Custom styles (blue + gold theme)
│   ├── js/countdown.js       # Countdown timer + card interaction
│   └── img/                  # Uploaded candidate photos
└── templates/
    ├── base.html             # Student-facing base layout
    ├── login.html            # Student login
    ├── vote.html             # Voting page
    ├── results.html          # Live results
    ├── voted.html            # Post-vote confirmation
    └── admin/
        ├── base_admin.html   # Admin base with sidebar
        ├── login.html        # Admin login
        ├── dashboard.html    # Stats overview
        ├── candidates.html   # Manage candidates
        ├── students.html     # Manage students
        ├── settings.html     # Election settings
        └── results.html      # Admin results view
```

---

## ⚙️ Prerequisites

| Requirement | Version |
|-------------|---------|
| Python      | 3.9+    |
| MySQL / MariaDB | 5.7+ / 10.3+ |
| pip         | Latest  |

---

## 🚀 Setup & Installation

### 1. Install MySQL and create the database

```bash
# Log into MySQL
mysql -u root -p

# Then run the schema
SOURCE path/to/campus_vote/schema.sql;
# OR from terminal:
mysql -u root -p < schema.sql
```

### 2. Install Python dependencies

```bash
# Navigate to the project folder
cd campus_vote

# (Recommended) create a virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Linux/Mac

# Install packages
pip install -r requirements.txt
```

> **Note (Windows):** `Flask-MySQLdb` requires `mysqlclient` which needs the MySQL C connector.  
> Install [MySQL Connector/C](https://dev.mysql.com/downloads/connector/c/) or use the unofficial wheel:
> ```bash
> pip install mysqlclient
> ```

### 3. Set environment variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-super-secret-key-change-this
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=campus_vote
```

Or set them directly in your shell before running:

```powershell
# Windows PowerShell
$env:SECRET_KEY="your-super-secret-key"
$env:MYSQL_PASSWORD="your_mysql_password"
```

### 4. Create the first admin account

Run the included helper script **once**:

```bash
python create_admin.py
```

This inserts an admin with:
- **Username:** `admin`
- **Password:** `Admin@123`

> ⚠️ **Change the default password immediately** after first login via Admin → Settings (or update the DB directly).

You can also customise the credentials via environment variables before running:

```bash
ADMIN_USER=myadmin ADMIN_PASS=StrongPass@2025 python create_admin.py
```

### 5. Run the application

```bash
# Development server (auto-reloads on code changes)
python app.py

# OR using the Flask CLI
flask run
```

The app will be available at: **http://localhost:5000**

---

## 👤 Admin Panel

Navigate to **http://localhost:5000/admin/login**

| Feature | Description |
|---------|-------------|
| Dashboard | Live stats: students, votes, turnout %, candidates |
| Candidates | Add (name, position, bio, photo) / delete |
| Students | Add (student ID, name, password) / delete / export CSV |
| Settings | Election title, start/end datetime, open/close toggle |
| Results | Full results with animated bars + tabular breakdown |
| Export CSV | Download votes as spreadsheet |

---

## 🗳️ Student Voting Flow

1. Student visits **http://localhost:5000**
2. Logs in with **Student ID** + **Password** (set by admin)
3. Reviews candidate cards and selects one
4. Confirms and submits — vote is recorded atomically
5. Sees confirmation page → can view live results

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---------------|
| Password hashing | `flask-bcrypt` (bcrypt rounds) |
| Session management | Flask signed sessions with `SECRET_KEY` |
| One vote per student | **Both** application-level check AND `UNIQUE KEY` in DB |
| SQL injection | Parameterised queries via `MySQLdb` |
| Admin/Student separation | Separate session keys (`admin_id` vs `student_db_id`) |
| File upload | `werkzeug.secure_filename` + extension allowlist |

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `students` | Voter accounts with `has_voted` flag |
| `candidates` | Election candidates |
| `votes` | Cast votes — `UNIQUE(student_db_id)` enforces one vote |
| `admins` | Admin accounts |
| `voting_settings` | Single-row election configuration |

---

## 🔧 Troubleshooting

**`mysqlclient` fails to install on Windows:**
```bash
pip install pipwin
pipwin install mysqlclient
```
Or download the pre-built wheel from [Christoph Gohlke's site](https://www.lfd.uci.edu/~gohlke/pythonlibs/#mysqlclient).

**`OperationalError: (1045) Access denied`:**  
Check your `MYSQL_USER` / `MYSQL_PASSWORD` env vars match your MySQL credentials.

**Flash messages not appearing:**  
Ensure `SECRET_KEY` is set — Flask sessions require it.

**Votes being counted on closed election:**  
Set `voting_open = FALSE` in Admin → Settings, or let `end_time` expire automatically.

---

## 📝 create_admin.py (reference)

```python
# create_admin.py  (run once)
from app import app, bcrypt, mysql

with app.app_context():
    pw_hash = bcrypt.generate_password_hash("Admin@123").decode("utf-8")
    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO admins (username, password_hash) VALUES (%s, %s)",
        ("admin", pw_hash)
    )
    mysql.connection.commit()
    cur.close()
    print("Admin created.")
```

---

## 📄 License

MIT — For educational/institutional use.  
**Computer Technology Department — Campus Elections**
