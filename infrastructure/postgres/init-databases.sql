-- ==============================================================================
-- PostgreSQL Database Initialization for SIAKAD Campus Microservices
-- Database-per-service pattern ensuring complete isolation & domain boundaries
-- ==============================================================================

-- 1. Create Role siakad_admin if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = 'siakad_admin') THEN
      CREATE ROLE siakad_admin WITH LOGIN PASSWORD 'siakad_secure_password_2026' SUPERUSER CREATEDB;
   END IF;
END
$do$;

-- 2. Create Isolated Databases for each Microservice
CREATE DATABASE siakad_auth_db;
CREATE DATABASE siakad_academic_db;
CREATE DATABASE siakad_enrollment_db;
CREATE DATABASE siakad_grade_db;
CREATE DATABASE siakad_attendance_db;
CREATE DATABASE siakad_notification_db;

-- 3. Grant Full Privileges to siakad_admin
GRANT ALL PRIVILEGES ON DATABASE siakad_auth_db TO siakad_admin;
GRANT ALL PRIVILEGES ON DATABASE siakad_academic_db TO siakad_admin;
GRANT ALL PRIVILEGES ON DATABASE siakad_enrollment_db TO siakad_admin;
GRANT ALL PRIVILEGES ON DATABASE siakad_grade_db TO siakad_admin;
GRANT ALL PRIVILEGES ON DATABASE siakad_attendance_db TO siakad_admin;
GRANT ALL PRIVILEGES ON DATABASE siakad_notification_db TO siakad_admin;
