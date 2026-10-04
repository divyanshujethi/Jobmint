#!/usr/bin/env bash
# ==============================================================================
# Role Nest - Production PostgreSQL Backup & Disaster Recovery Automation
# ==============================================================================
# Usage:
#   chmod +x scripts/db-backup.sh
#   ./scripts/db-backup.sh
#
# Environment variables supported:
#   DATABASE_URL       : PostgreSQL connection URI (e.g. postgresql://user:pass@host:5432/dbname)
#   BACKUP_DIR         : Destination directory (default: ./backups/db)
#   RETENTION_DAYS     : Number of days to retain backups (default: 14)
#   S3_BUCKET          : (Optional) Remote S3/R2/GCS bucket to sync backups (e.g. s3://my-backups)
# ==============================================================================

set -euo pipefail

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${BACKUP_DIR:-./backups/db}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
DB_URL="${DATABASE_URL:-}"

echo "=========================================="
echo " Starting Role Nest Database Backup"
echo " Time: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
echo "=========================================="

# Check for DATABASE_URL
if [ -z "$DB_URL" ]; then
  if [ -f ".env.production" ]; then
    echo "Reading DATABASE_URL from .env.production..."
    DB_URL=$(grep -E '^DATABASE_URL=' .env.production | cut -d '=' -f2- | tr -d '"' | tr -d "'")
  elif [ -f ".env" ]; then
    echo "Reading DATABASE_URL from .env..."
    DB_URL=$(grep -E '^DATABASE_URL=' .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
  fi
fi

if [ -z "$DB_URL" ]; then
  echo "[-] ERROR: DATABASE_URL is not set and could not be detected from .env."
  exit 1
fi

# Ensure backup destination directory exists
mkdir -p "$BACKUP_DIR"

BACKUP_FILE="${BACKUP_DIR}/rolenest_prod_${TIMESTAMP}.sql.gz"
CHECKSUM_FILE="${BACKUP_DIR}/rolenest_prod_${TIMESTAMP}.sha256"

echo "[+] Target file: ${BACKUP_FILE}"

# Execute pg_dump with gzip compression level 9
echo "[+] Streaming pg_dump to gzip..."
if command -v pg_dump >/dev/null 2>&1; then
  pg_dump "$DB_URL" --no-owner --no-acl --clean --if-exists | gzip -9 > "$BACKUP_FILE"
elif command -v docker >/dev/null 2>&1; then
  echo "[!] pg_dump not found locally, executing via postgres docker container..."
  docker run --rm -e DB_URL="$DB_URL" postgres:16-alpine \
    sh -c 'pg_dump "$DB_URL" --no-owner --no-acl --clean --if-exists' | gzip -9 > "$BACKUP_FILE"
else
  echo "[-] ERROR: Neither pg_dump nor docker is installed."
  exit 1
fi

# Verify backup was created and has non-zero size
if [ ! -s "$BACKUP_FILE" ]; then
  echo "[-] ERROR: Backup file was created but is empty (0 bytes)."
  rm -f "$BACKUP_FILE"
  exit 1
fi

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[+] Backup successfully created! Size: ${FILE_SIZE}"

# Generate SHA256 Checksum for verification
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$BACKUP_FILE" > "$CHECKSUM_FILE"
  echo "[+] SHA256 checksum generated: $(cat "$CHECKSUM_FILE")"
fi

# Verification test (test gzip stream integrity)
echo "[+] Verifying archive integrity..."
gzip -t "$BACKUP_FILE"
echo "[+] Integrity verified: Archive is valid and uncorrupted."

# Retention Policy: Clean up backups older than RETENTION_DAYS
echo "[+] Pruning backups older than ${RETENTION_DAYS} days in ${BACKUP_DIR}..."
find "$BACKUP_DIR" -type f \( -name "rolenest_prod_*.sql.gz" -o -name "rolenest_prod_*.sha256" \) -mtime "+${RETENTION_DAYS}" -exec rm -vf {} \;

# Optional: Sync to remote cloud storage if configured
if [ -n "${S3_BUCKET:-}" ] && command -v aws >/dev/null 2>&1; then
  echo "[+] Syncing backup to remote S3 bucket: ${S3_BUCKET}..."
  aws s3 cp "$BACKUP_FILE" "${S3_BUCKET}/db-backups/$(basename "$BACKUP_FILE")"
  echo "[+] Remote sync complete."
fi

echo "=========================================="
echo " Backup Completed Successfully!"
echo " File: ${BACKUP_FILE} (${FILE_SIZE})"
echo " Restore Command:"
echo "   gunzip -c ${BACKUP_FILE} | psql \"\$DATABASE_URL\""
echo "=========================================="
