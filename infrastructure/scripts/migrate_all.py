import os
import sys
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
PYTHON_EXE = sys.executable

services = [
    {
        'name': 'auth-service',
        'dir': BASE_DIR / 'services' / 'auth-service',
        'db': 'siakad_auth_db',
        'seed_cmd': 'seed_users'
    },
    {
        'name': 'academic-service',
        'dir': BASE_DIR / 'services' / 'academic-service',
        'db': 'siakad_academic_db',
        'seed_cmd': 'seed_academic'
    },
    {
        'name': 'enrollment-service',
        'dir': BASE_DIR / 'services' / 'enrollment-service',
        'db': 'siakad_enrollment_db',
        'seed_cmd': None
    },
    {
        'name': 'grade-service',
        'dir': BASE_DIR / 'services' / 'grade-service',
        'db': 'siakad_grade_db',
        'seed_cmd': None
    },
    {
        'name': 'attendance-service',
        'dir': BASE_DIR / 'services' / 'attendance-service',
        'db': 'siakad_attendance_db',
        'seed_cmd': None
    },
    {
        'name': 'notification-service',
        'dir': BASE_DIR / 'services' / 'notification-service',
        'db': 'siakad_notification_db',
        'seed_cmd': None
    },
]

def run_migrations(db_user='siakad_admin', db_password='siakad_secure_password_2026', db_host='localhost', db_port='5432'):
    print("=" * 65)
    print("  SIAKAD UDINUS - AUTOMATED DJANGO POSTGRESQL MIGRATION RUNNER")
    print("=" * 65)
    print(f"Target Host: {db_host}:{db_port}")
    print(f"Database User: {db_user}\n")

    env = os.environ.copy()
    env['USE_POSTGRES'] = 'True'
    env['DB_USER'] = db_user
    env['DB_PASSWORD'] = db_password
    env['DB_HOST'] = db_host
    env['DB_PORT'] = db_port

    success_count = 0

    for s in services:
        print(f"\n[+] Migrating {s['name']} -> Database: {s['db']}...")
        env['DB_NAME'] = s['db']

        # Run migrate
        res = subprocess.run(
            [PYTHON_EXE, 'manage.py', 'migrate', '--noinput'],
            cwd=str(s['dir']),
            env=env
        )

        if res.returncode == 0:
            print(f"  [OK] {s['name']} migrated successfully.")
            success_count += 1

            # Run seed if available
            if s['seed_cmd']:
                print(f"  -> Seeding data for {s['name']} ({s['seed_cmd']})...")
                subprocess.run(
                    [PYTHON_EXE, 'manage.py', s['seed_cmd']],
                    cwd=str(s['dir']),
                    env=env
                )
        else:
            print(f"  [FAIL] Failed migrating {s['name']}. Please verify database '{s['db']}' exists in PostgreSQL.")

    print("\n" + "=" * 65)
    print(f"Migration completed: {success_count}/{len(services)} services processed.")
    print("=" * 65)

if __name__ == '__main__':
    user = sys.argv[1] if len(sys.argv) > 1 else 'siakad_admin'
    password = sys.argv[2] if len(sys.argv) > 2 else 'siakad_secure_password_2026'
    host = sys.argv[3] if len(sys.argv) > 3 else 'localhost'
    port = sys.argv[4] if len(sys.argv) > 4 else '5432'

    run_migrations(db_user=user, db_password=password, db_host=host, db_port=port)
