# Windows PowerShell Database Backup Script for SHIVIL AI
# Purpose: Creates a compressed PostgreSQL custom-format dump of the database.
# Usage: .\scripts\backup.ps1

$ContainerName = "shivil_postgres"
$DbUser = "shivil_admin"
$DbName = "shivil_db"
$BackupDir = ".\backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\${DbName}_backup_$Timestamp.dump"

if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

Write-Host "=========================================================="
Write-Host "Starting PostgreSQL backup for SHIVIL AI (Windows PowerShell)..."
Write-Host "Container: $ContainerName"
Write-Host "Database:  $DbName"
Write-Host "Target:    $BackupFile"
Write-Host "=========================================================="

# Check container status
$Running = docker ps --format '{{.Names}}' | Select-String -Pattern "^$ContainerName$"
if (!$Running) {
    Write-Error "ERROR: Docker container '$ContainerName' is not running."
    exit 1
}

# Execute pg_dump inside the container and stream to host file system
# Using -i in docker exec to stream properly
docker exec -i $ContainerName pg_dump -U $DbUser -d $DbName -F c -b -v > $BackupFile
if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup successfully completed!"
    Write-Host "File location: $BackupFile"
} else {
    Write-Error "ERROR: PostgreSQL backup failed."
    exit 1
}
Write-Host "=========================================================="
