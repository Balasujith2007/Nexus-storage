#!/bin/bash

echo "=========================================="
echo "  GitHub Push Helper for Nexus Storage"
echo "=========================================="
echo ""
echo "This script will help you push to GitHub."
echo ""
echo "Do you have a GitHub Personal Access Token?"
echo "1. Yes, I have a token"
echo "2. No, help me create one"
echo "3. Exit"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        read -p "Paste your GitHub token here: " token
        
        if [ -z "$token" ]; then
            echo "❌ Error: No token provided"
            exit 1
        fi
        
        echo ""
        echo "Configuring remote URL..."
        git remote set-url origin "https://${token}@github.com/Balasujith2007/Nexus-storage.git"
        
        echo "Pushing to GitHub..."
        git push origin master
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ SUCCESS! Code pushed to GitHub!"
            echo ""
            echo "Railway will now automatically:"
            echo "  1. Detect the new commits"
            echo "  2. Pull the fixed code"
            echo "  3. Build successfully"
            echo "  4. Deploy your application"
            echo ""
            echo "Check your Railway dashboard in a few minutes!"
        else
            echo ""
            echo "❌ Push failed. Please check the error above."
        fi
        ;;
    2)
        echo ""
        echo "To create a GitHub Personal Access Token:"
        echo ""
        echo "1. Open: https://github.com/settings/tokens"
        echo "2. Click 'Generate new token (classic)'"
        echo "3. Name it: 'Nexus Deploy'"
        echo "4. Check the 'repo' checkbox"
        echo "5. Click 'Generate token'"
        echo "6. Copy the token (starts with ghp_)"
        echo ""
        echo "Then run this script again and choose option 1."
        ;;
    3)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
