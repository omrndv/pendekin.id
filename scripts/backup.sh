#!/bin/bash
# ==============================================================================
# Pendekin SaaS Automated Backup Script
# ==============================================================================

SET_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${SET_DIR}/storage/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_BACKUP_FILE="${BACKUP_DIR}/pendekin_db_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting Pendekin database backup..."

# Extract DB credentials from .env
if [ -f "${SET_DIR}/.env" ]; then
    export $(grep -v '^#' "${SET_DIR}/.env" | xargs)
fi

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_DATABASE="${DB_DATABASE:-pendekin}"
DB_USERNAME="${DB_USERNAME:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"

# Perform compressed MySQL database dump
mysqldump -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USERNAME}" -p"${DB_PASSWORD}" "${DB_DATABASE}" | gzip > "${DB_BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "[$(date)] Backup successful! File created: ${DB_BACKUP_FILE}"
else
    echo "[$(date)] Backup failed!" >&2
    exit 1
fi

# Cleanup old backups older than 7 days
find "${BACKUP_DIR}" -type f -name "pendekin_db_*.sql.gz" -mtime +7 -exec rm -f {} \;
echo "[$(date)] Cleaned up backups older than 7 days."
