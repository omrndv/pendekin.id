#!/bin/bash
# ==============================================================================
# Pendekin SaaS Emergency Database Restore Script
# ==============================================================================

if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore.sh /path/to/backup.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"
SET_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file '${BACKUP_FILE}' does not exist!"
    exit 1
fi

if [ -f "${SET_DIR}/.env" ]; then
    export $(grep -v '^#' "${SET_DIR}/.env" | xargs)
fi

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_DATABASE="${DB_DATABASE:-pendekin}"
DB_USERNAME="${DB_USERNAME:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"

echo "[$(date)] Restoring database from '${BACKUP_FILE}'..."

gunzip -c "${BACKUP_FILE}" | mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USERNAME}" -p"${DB_PASSWORD}" "${DB_DATABASE}"

if [ $? -eq 0 ]; then
    echo "[$(date)] Restoration successful!"
else
    echo "[$(date)] Restoration failed!" >&2
    exit 1
fi
