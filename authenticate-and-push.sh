#!/bin/bash

echo "=== GitHub Authentication and Push ==="
echo ""
echo "Choose authentication method:"
echo "1. Personal Access Token (Recommended)"
echo "2. SSH Key"
echo "3. Exit"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Creating a Personal Access Token:"
        echo "1. Go to: https://github.com/settings/tokens"
        echo "2. Click 'Generate new token (classic)'"
        echo "3. Name it: 'Nexus Storage Deploy'"
        echo "4. Check the 'repo' scope"
        echo "5. Generate and copy the token"
        echo ""
        read -p "Paste your token here: " token
        
        if [ -z "$token" ]; then
            echo "Error: No token provided"
            exit 1
        fi
        
        git remote set-url origin "https://${token}@github.com/Balasujith2007/Nexus-storage.git"
        echo "Remote URL updated with token"
        ;;
    2)
        git remote set-url origin "git@github.com:Balasujith2007/Nexus-storage.git"
        echo "Remote URL updated to use SSH"
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

echo ""
echo "Pushing to GitHub..."
git push origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "Railway will now automatically redeploy with the fixed code."
else
    echo ""
    echo "❌ Push failed. Check the error message above."
    echo "You may need to:"
    echo "  - Verify your token has 'repo' permissions"
    echo "  - Check if you're added as a collaborator"
    echo "  - Ensure your SSH key is configured"
fi
