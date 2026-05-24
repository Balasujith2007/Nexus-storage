# ⚡ Quick Push to GitHub

## Step 1: Get Your Personal Access Token

1. Open: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `Nexus Storage Deploy`
4. Check: ✅ **repo** (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)

## Step 2: Push with Token

Replace `YOUR_TOKEN_HERE` with your actual token:

```bash
cd Nexus-storage

git remote set-url origin https://YOUR_TOKEN_HERE@github.com/Balasujith2007/Nexus-storage.git

git push origin master
```

## Example:
If your token is `ghp_abc123xyz`, run:
```bash
git remote set-url origin https://ghp_abc123xyz@github.com/Balasujith2007/Nexus-storage.git
git push origin master
```

## ✅ After Successful Push

Railway will automatically:
1. Detect the new code
2. Start building with the fixed code
3. Deploy successfully (no more errors!)

## 🔒 Security Note

After pushing, you can remove the token from the remote URL:
```bash
git remote set-url origin https://github.com/Balasujith2007/Nexus-storage.git
```

The token will remain valid for future pushes if you save it securely.
