# Sprint 4 Quick Setup Guide

## 🚀 Quick Setup Steps

### 1. Run the Setup Script
```bash
npm run setup-sprint4
```

### 2. Manual Database Setup
The setup script will show you what needs to be done manually. Follow these steps:

#### A. Create webhook_logs table
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/create-webhook-logs-table.sql`
4. Click "Run" to execute the SQL

#### B. Sync Schema with Drizzle
```bash
npm run db:push
```

### 3. Storage Setup
1. Go to Supabase Storage
2. Ensure "media" bucket exists (create if needed)
3. Create these folders in the media bucket:
   - `sitemap/`
   - `rss/`

### 4. Environment Variables
Add to your `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 5. Start the Server
```bash
npm run dev
```

### 6. Test the Features
```bash
npm run test-sprint4
```

### 7. Generate Initial Files
```bash
# Generate sitemap
curl -X POST http://localhost:5000/api/automation/webhooks/generate-sitemap

# Generate RSS
curl -X POST http://localhost:5000/api/automation/webhooks/generate-rss
```

## 🔧 Troubleshooting

### If webhook_logs table creation fails:
1. Check if you have the correct permissions in Supabase
2. Try running the SQL manually in Supabase SQL Editor
3. Ensure your database connection is working

### If storage setup fails:
1. Check RLS (Row Level Security) policies in Supabase
2. Ensure the media bucket has proper permissions
3. You may need to disable RLS temporarily for setup

### If sitemap/RSS generation fails:
1. Ensure the storage folders exist
2. Check that content tables have data
3. Verify Supabase storage permissions

## 🎯 Verification

After setup, you should be able to:

1. ✅ Access webhook status: `GET /api/automation/webhooks/status`
2. ✅ Generate sitemap: `POST /api/automation/webhooks/generate-sitemap`
3. ✅ Generate RSS: `POST /api/automation/webhooks/generate-rss`
4. ✅ Get link suggestions: `POST /api/automation/internal-links/suggestions`
5. ✅ Manage redirects: `GET /api/automation/redirects`
6. ✅ Access public files: `GET /sitemap.xml` and `GET /rss.xml`

## 📚 Next Steps

1. **Configure Google Search Console** (optional):
   ```bash
   curl -X PUT http://localhost:5000/api/automation/google-search-console/config \
     -H "Content-Type: application/json" \
     -d '{"siteVerificationToken": "your_token", "enabled": true}'
   ```

2. **Enable Automatic Webhooks** (optional):
   - The database triggers are created but not enabled by default
   - To enable, uncomment the trigger creation lines in the SQL file

3. **Test Internal Link Suggestions**:
   ```bash
   curl -X POST http://localhost:5000/api/automation/internal-links/suggestions \
     -H "Content-Type: application/json" \
     -d '{"content": "Este artigo fala sobre pesca no Pantanal..."}'
   ```

4. **Create Test Redirects**:
   ```bash
   curl -X POST http://localhost:5000/api/automation/redirects \
     -H "Content-Type: application/json" \
     -d '{"fromPath": "/old-page", "toPath": "/new-page", "statusCode": 301}'
   ```

## 🎉 Success!

Once all steps are complete, you'll have a fully functional automation system with:
- ✅ Automatic sitemap generation
- ✅ Automatic RSS feed generation  
- ✅ AI-powered internal link suggestions
- ✅ Redirect management with 301 handling
- ✅ Google Search Console integration
- ✅ Comprehensive webhook system

All features are production-ready and include full error handling, logging, and monitoring capabilities.
