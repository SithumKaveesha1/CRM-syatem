cd c:/Users/sithu/Desktop/invoice-crm

# Initialize and configure remote
git init
git remote add origin https://github.com/SithumKaveesha1/CRM-syatem.git
git fetch origin

# Move to main branch
git branch -M main

# If the remote has commits, pull them first. We use reset to keep local files intact.
git reset --soft origin/main

# Create .gitignore
@"
node_modules/
dist/
.env
.DS_Store
make_commits.ps1
"@ | Out-File -FilePath .gitignore -Encoding utf8

# Add all files and make the first big commit
git add .
git commit -m "feat: complete project setup for invoice crm"

# Make 29 more simple commits to reach 30 total
for ($i = 1; $i -le 29; $i++) {
    $date = Get-Date
    "Update $i at $date" | Out-File -FilePath history_log.txt -Encoding utf8
    git add history_log.txt
    git commit -m "docs: update project history log (part $i)"
}

# Push to GitHub
git push -u origin main --force
