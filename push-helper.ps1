# GitHub Push Helper for Nexus Storage
# PowerShell version for Windows

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  GitHub Push Helper for Nexus Storage" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will help you push to GitHub." -ForegroundColor Yellow
Write-Host ""
Write-Host "Do you have a GitHub Personal Access Token?"
Write-Host "1. Yes, I have a token"
Write-Host "2. No, help me create one"
Write-Host "3. Exit"
Write-Host ""
$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        $token = Read-Host "Paste your GitHub token here" -AsSecureString
        $tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
        )
        
        if ([string]::IsNullOrWhiteSpace($tokenPlain)) {
            Write-Host "❌ Error: No token provided" -ForegroundColor Red
            exit 1
        }
        
        Write-Host ""
        Write-Host "Configuring remote URL..." -ForegroundColor Yellow
        git remote set-url origin "https://$tokenPlain@github.com/Balasujith2007/Nexus-storage.git"
        
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        git push origin master
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Railway will now automatically:" -ForegroundColor Cyan
            Write-Host "  1. Detect the new commits"
            Write-Host "  2. Pull the fixed code"
            Write-Host "  3. Build successfully"
            Write-Host "  4. Deploy your application"
            Write-Host ""
            Write-Host "Check your Railway dashboard in a few minutes!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Push failed. Please check the error above." -ForegroundColor Red
        }
    }
    "2" {
        Write-Host ""
        Write-Host "To create a GitHub Personal Access Token:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. Open: https://github.com/settings/tokens" -ForegroundColor Cyan
        Write-Host "2. Click 'Generate new token (classic)'"
        Write-Host "3. Name it: 'Nexus Deploy'"
        Write-Host "4. Check the 'repo' checkbox"
        Write-Host "5. Click 'Generate token'"
        Write-Host "6. Copy the token (starts with ghp_)"
        Write-Host ""
        Write-Host "Then run this script again and choose option 1." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Opening GitHub tokens page..." -ForegroundColor Cyan
        Start-Process "https://github.com/settings/tokens"
    }
    "3" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
        exit 1
    }
}
