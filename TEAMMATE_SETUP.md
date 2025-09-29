# Team Setup Guide - Azure Static Web Apps Deployment

This guide will help your teammate set up their own Azure environment to deploy this application using the existing GitHub Actions workflow.

## Overview

The GitHub Actions workflow is configured to deploy to any Azure Static Web App using a deployment token stored as a repository secret. Each team member can deploy to their own Azure environment by following these steps.

## Prerequisites

- Azure account with active subscription
- Azure CLI installed
- Access to this GitHub repository
- Node.js 18+ installed locally (for testing)

## Step-by-Step Setup

### 1. Create Azure Resources

#### 1.1 Login to Azure CLI
```bash
az login
```

#### 1.2 Create Resource Group
```bash
# Use your own naming convention
az group create --name "your-name-copilot-rg" --location "East US"
```

#### 1.3 Create SQL Server
```bash
az sql server create \
  --name "your-name-copilot-sql" \
  --resource-group "your-name-copilot-rg" \
  --location "East US" \
  --admin-user copilotadmin \
  --admin-password "YourSecurePassword123!"
```

#### 1.4 Create SQL Database
```bash
az sql db create \
  --resource-group "your-name-copilot-rg" \
  --server "your-name-copilot-sql" \
  --name copilot-features \
  --service-objective Basic
```

#### 1.5 Configure Firewall Rules
```bash
# Allow Azure services
az sql server firewall-rule create \
  --resource-group "your-name-copilot-rg" \
  --server "your-name-copilot-sql" \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your IP (get your IP from https://whatismyipaddress.com/)
az sql server firewall-rule create \
  --resource-group "your-name-copilot-rg" \
  --server "your-name-copilot-sql" \
  --name AllowMyIP \
  --start-ip-address YOUR.PUBLIC.IP.ADDRESS \
  --end-ip-address YOUR.PUBLIC.IP.ADDRESS
```

### 2. Create Static Web App

#### 2.1 Fork the Repository
1. Fork this repository to your GitHub account
2. Clone your fork locally

#### 2.2 Create Static Web App
```bash
az staticwebapp create \
  --name "your-name-copilot-app" \
  --resource-group "your-name-copilot-rg" \
  --location "East US2" \
  --sku Free
```

**Note**: We're not linking to GitHub yet - we'll do that manually to get more control.

### 3. Update Database Configuration

#### 3.1 Edit API Configuration
In your forked repository, edit `api/features/index.js`:

```javascript
const config = {
    server: 'your-name-copilot-sql.database.windows.net',  // Update this
    database: 'copilot-features',
    user: 'copilotadmin',
    password: 'YourSecurePassword123!',  // Update this
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};
```

#### 3.2 Commit Your Changes
```bash
git add api/features/index.js
git commit -m "Update database config for my Azure environment"
git push origin main
```

### 4. Get Deployment Token

#### 4.1 Get the Deployment Token
```bash
az staticwebapp secrets list \
  --name "your-name-copilot-app" \
  --resource-group "your-name-copilot-rg" \
  --query "properties.apiKey" \
  --output tsv
```

Copy the returned token - you'll need it in the next step.

### 5. Configure GitHub Repository

#### 5.1 Add Repository Secret
1. Go to your forked repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
6. Value: Paste the deployment token from step 4.1
7. Click **Add secret**

### 6. Test the Deployment

#### 6.1 Trigger a Deployment
1. Make a small change to the repository (e.g., update README.md)
2. Commit and push to the main branch
3. Go to the **Actions** tab in GitHub to watch the deployment

#### 6.2 Get Your App URL
```bash
az staticwebapp show \
  --name "your-name-copilot-app" \
  --resource-group "your-name-copilot-rg" \
  --query "defaultHostname" \
  --output tsv
```

Visit the URL to see your deployed application!

### 7. Verify Everything Works

1. **Check the app loads**: Visit your Static Web App URL
2. **Test features load**: The 6 hardcoded features should appear
3. **Test voting**: Try upvoting and starring features
4. **Test admin features**: Try editing a feature

## Repository Secret Naming

The GitHub Actions workflow looks for this specific secret name:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

Make sure you use exactly this name, or the deployment will fail.

## Troubleshooting

### Deployment Fails
1. **Check the secret name** - Must be exactly `AZURE_STATIC_WEB_APPS_API_TOKEN`
2. **Verify the token** - Get a fresh token from Azure and update the secret
3. **Check the database config** - Make sure your server name and password are correct

### Database Connection Issues
1. **Firewall rules** - Make sure Azure services and your IP are allowed
2. **Connection string** - Verify server name, database name, username, and password
3. **Database exists** - Make sure the database was created successfully

### Features Don't Load
1. **API errors** - Check the browser console for API errors
2. **Database seeding** - The API should automatically seed the database on first run
3. **CORS issues** - The API includes CORS headers, but check browser dev tools

## Alternative: Manual Deployment

If GitHub Actions isn't working, you can deploy manually:

```bash
# Build the application
npm ci
npm run build

# Deploy using Azure CLI
az staticwebapp environment set \
  --name "your-name-copilot-app" \
  --resource-group "your-name-copilot-rg" \
  --source "./dist"
```

## Environment Variables (Optional)

If you want to use environment variables instead of hardcoding database credentials:

1. Add application settings to your Static Web App:
```bash
az staticwebapp appsettings set \
  --name "your-name-copilot-app" \
  --resource-group "your-name-copilot-rg" \
  --setting-names \
    DATABASE_SERVER="your-name-copilot-sql.database.windows.net" \
    DATABASE_NAME="copilot-features" \
    DATABASE_USER="copilotadmin" \
    DATABASE_PASSWORD="YourSecurePassword123!"
```

2. Update `api/features/index.js` to use environment variables:
```javascript
const config = {
    server: process.env.DATABASE_SERVER || 'your-name-copilot-sql.database.windows.net',
    database: process.env.DATABASE_NAME || 'copilot-features',
    user: process.env.DATABASE_USER || 'copilotadmin',
    password: process.env.DATABASE_PASSWORD || 'YourSecurePassword123!',
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};
```

## Questions?

If you run into issues:
1. Check the GitHub Actions logs in the **Actions** tab
2. Check the Azure Portal for Static Web App logs
3. Verify all Azure resources were created successfully
4. Make sure the deployment token is correct and not expired

## Resource Cleanup

When you're done testing, you can delete all resources:
```bash
az group delete --name "your-name-copilot-rg" --yes --no-wait
```

This will delete the resource group and all resources within it.