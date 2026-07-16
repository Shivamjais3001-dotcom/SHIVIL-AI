# Windows PowerShell Database Restore Script for SHIVIL AI
# Purpose: Restores database from a compressed pg_dump file.
# Usage: .\scripts\restore.ps1 <path_to_backup_file>

$ContainerName = "shivil_postgres"
$DbUser = "shivil_admin"
$DbName = "shivil_db"

if ($args.Count -ne 1) {
    Write-Error "ERROR: Missing backup file path."
    Write-Host "Usage: .\scripts\restore.ps1 <path_to_backup_file>"
    exit 1
}

$BackupFile = $args[0]

if (!(Test-Path $BackupFile)) {
    Write-Error "ERROR: Backup file not found: $BackupFile"
    exit 1
}

Write-Host "=========================================================="
Write-Host "WARNING: This will drop and overwrite existing records!"
Write-Host "Starting PostgreSQL restore for SHIVIL AI (Windows PowerShell)..."
Write-Host "Container:   $ContainerName"
Write-Host "Database:    $DbName"
Write-Host "Source File: $BackupFile"
Write-Host "=========================================================="

# Check container status
$Running = docker ps --format '{{.Names}}' | Select-String -Pattern "^$ContainerName$"
if (!$Running) {
    Write-Error "ERROR: Docker container '$ContainerName' is not running."
    exit 1
}

# Prompt confirmation
$Confirmation = Read-Host "Are you sure you want to restore? All current data will be replaced! (y/N)"
if ($Confirmation -notmatch '^[Yy]$') {
    Write-Host "Restore aborted by user."
    exit 0
}

Write-Host "Executing restoration..."
# Read the file contents and pipe to the pg_restore command in docker
# Get-Content -Encoding Byte is used for binary file parsing in Powershell 5.1/Core
if ($PSVersionTable.PSVersion.Major -ge 6) {
    Get-Content $BackupFile -AsByteStream | docker exec -i $ContainerName pg_restore -U $DbUser -d $DbName -v -c --if-exists --no-owner
} else {
    Get-Content $BackupFile -Encoding Byte | docker exec -i $ContainerName pg_restore -U $DbUser -d $DbName -v -c --if-exists --no-owner
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database restoration completed successfully!"
} else {
    Write-Error "ERROR: Database restoration failed."
    exit 1
}
Write-Host "=========================================================="
