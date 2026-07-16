#!/usr/bin/env bash

# Database Recovery Script for SHIVIL AI
# Purpose: Restores database from a compressed pg_dump file.
# Usage: ./restore.sh <path_to_backup_file>

set -euo pipefail

CONTAINER_NAME="shivil_postgres"
DB_USER="shivil_admin"
DB_NAME="shivil_db"

if [ "$#" -ne 1 ]; then
  echo "ERROR: Missing backup file path."
  echo "Usage: $0 <path_to_backup_file>"
  exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
  echo "ERROR: Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

echo "=========================================================="
echo "WARNING: This will drop and overwrite existing records!"
echo "Starting PostgreSQL restore for SHIVIL AI..."
echo "Container:   ${CONTAINER_NAME}"
echo "Database:    ${DB_NAME}"
echo "Source File: ${BACKUP_FILE}"
echo "=========================================================="

# Check if PostgreSQL container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "ERROR: Docker container '${CONTAINER_NAME}' is not running."
  exit 1
fi

# Confirm with user before proceeding
read -p "Are you sure you want to restore? All current data will be replaced! (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Restore aborted by user."
  exit 0
fi

# Run pg_restore in container
# --clean: Drop database objects before recreating them
# --if-exists: Use IF EXISTS when dropping objects
# --no-owner: Skip restoration of object ownership
echo "Executing restoration..."
if docker exec -i "${CONTAINER_NAME}" pg_restore -U "${DB_USER}" -d "${DB_NAME}" -v -c --if-exists --no-owner < "${BACKUP_FILE}"; then
  echo "Database restoration completed successfully!"
else
  echo "ERROR: Database restoration failed."
  exit 1
fi

echo "=========================================================="
