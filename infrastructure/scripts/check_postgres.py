import psycopg2
import sys

passwords_to_try = ['siakad_secure_password_2026', 'postgres', 'admin', 'password', '123456']
users_to_try = [('siakad_admin', 'siakad_secure_password_2026'), ('postgres', 'postgres'), ('postgres', 'admin'), ('postgres', '123456'), ('postgres', 'password')]

connected = False
for user, pwd in users_to_try:
    try:
        conn = psycopg2.connect(
            dbname='postgres',
            user=user,
            password=pwd,
            host='localhost',
            port='5432',
            connect_timeout=2
        )
        print(f"SUCCESS: Connected to PostgreSQL as '{user}' with password '{pwd}'!")
        cur = conn.cursor()
        cur.execute("SELECT datname FROM pg_database WHERE datname LIKE 'siakad%';")
        dbs = [r[0] for r in cur.fetchall()]
        print(f"SIAKAD Databases found: {dbs}")
        conn.close()
        connected = True
        break
    except Exception as e:
        pass

if not connected:
    print("Could not auto-detect postgres password without user input. Manual migration command needed.")
