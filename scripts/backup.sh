#!/usr/bin/env bash

# Database Backup Script for SHIVIL AI
# Purpose: Creates a compressed PostgreSQL custom-format dump of the database.
# Usage: ./backup.sh

set -euo pipefail

# Configuration
CONTAINER_NAME="shivil_postgres"
DB_USER="shivil_admin"
DB_NAME="shivil_db"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_backup_${TIMESTAMP}.dump"

# Create backup directory if it does not exist
mkdir -p "${BACKUP_DIR}"

echo "=========================================================="
echo "Starting PostgreSQL backup for SHIVIL AI..."
echo "Container: ${CONTAINER_NAME}"
echo "Database:  ${DB_NAME}"
echo "Target:    ${BACKUP_FILE}"
echo "=========================================================="

# Check if PostgreSQL container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "ERROR: Docker container '${CONTAINER_NAME}' is not running."
  echo "Please ensure your docker-compose stack is active."
  exit 1
fi

# Execute pg_dump inside the container and pipe to host file system
# Using custom format (-F c) which is compressed and flexible for pg_restore
if docker exec -t "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" -F c -b -v > "${BACKUP_FILE}"; then
  echo "Backup successfully completed!"
  echo "File location: ${BACKUP_FILE}"
  echo "Size: $(du -sh "${BACKUP_FILE}" | cut -f1)"
  
  # Optional: Keep only last 10 backups (delete older custom dumps)
  find "${BACKUP_DIR}" -name "${DB_NAME}_backup_*.dump" -mtime +10 -type f -delete
  echo "Cleaned up custom backups older than 10 days."
else
  echo "ERROR: PostgreSQL backup failed."
  exit 1
fi

echo "=========================================================="
