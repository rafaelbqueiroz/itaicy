# Manual Sprint 4 Setup Guide

Since the automated setup script encountered issues, here's a step-by-step manual setup guide for Sprint 4 automation features.

## 🎯 Overview

Sprint 4 adds these automation features:
- ✅ Webhook system for content changes
- ✅ Automatic sitemap.xml generation  
- ✅ Automatic RSS.xml generation
- ✅ AI-powered internal link suggestions
- ✅ Redirect management system
- ✅ Google Search Console integration

## 📋 Manual Setup Steps

### Step 1: Database Setup

#### A. Check your table structure (optional)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run `scripts/check-table-columns.sql` to see your current table structure

#### B. Create webhook_logs table
1. In the **SQL Editor**
2. Copy and paste the contents of `scripts/create-webhook-logs-simple.sql`
3. Or use this simplified SQL:

```sql
-- Simple Sprint 4 webhook_logs table creation
CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  event VARCHAR(50) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  content_id INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,
  response JSONB,
  error TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for webhook_logs
CREATE INDEX IF NOT EXISTS idx_webhook_logs_content ON webhook_logs(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_executed_at ON webhook_logs(executed_at);

-- Create webhook trigger function
CREATE OR REPLACE FUNCTION trigger_content_webhook()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO webhook_logs (event, content_type, content_id, status)
    VALUES ('publish', TG_TABLE_NAME, NEW.id, 'pending');
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO webhook_logs (event, content_type, content_id, status)
    VALUES ('update', TG_TABLE_NAME, NEW.id, 'pending');
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO webhook_logs (event, content_type, content_id, status)
    VALUES ('delete', TG_TABLE_NAME, OLD.id, 'pending');
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

4. Click **Run** to execute

#### C. Insert default configurations
```sql
-- Insert default automation configurations
INSERT INTO site_settings (key, value, description, category) VALUES
('webhook_config', '{
  "enabled": true,
  "sitemapEnabled": true,
  "rssEnabled": true,
  "redirectsEnabled": true,
  "googlePingEnabled": true
}', 'Webhook automation configuration', 'automation')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value, description, category) VALUES
('google_search_console', '{
  "enabled": false,
  "siteVerificationToken": null,
  "propertyUrl": "https://itaicy.com.br"
}', 'Google Search Console configuration', 'seo')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value, description, category) VALUES
('sitemap_config', '{
  "enabled": true,
  "baseUrl": "https://itaicy.com.br",
  "includeImages": true,
  "changefreq": "weekly",
  "priority": 0.8
}', 'Sitemap generation configuration', 'seo')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value, description, category) VALUES
('rss_config', '{
  "enabled": true,
  "title": "Itaicy Pantanal Eco Lodge - Blog",
  "description": "Histórias, dicas e experiências do Pantanal no Itaicy Eco Lodge",
  "maxItems": 20,
  "includeImages": true
}', 'RSS feed configuration', 'content')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value, description, category) VALUES
('internal_links_config', '{
  "enabled": true,
  "maxSuggestions": 10,
  "aiEnabled": true,
  "keywordMinLength": 3
}', 'Internal link suggestions configuration', 'content')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

### Step 2: Storage Setup

#### A. Create storage bucket and folders
1. Go to **Storage** in your Supabase dashboard
2. Ensure the **media** bucket exists (create if needed)
3. Create these folders in the media bucket:
   - `sitemap/`
   - `rss/`

#### B. Set storage permissions (if needed)
If you encounter permission issues, you may need to adjust RLS policies for the media bucket.

### Step 3: Environment Variables

Add to your `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 4: Start the Server

```bash
npm run dev
```

### Step 5: Test the Features

#### A. Test webhook status
```bash
curl http://localhost:5000/api/automation/webhooks/status
```

#### B. Generate initial sitemap
```bash
curl -X POST http://localhost:5000/api/automation/webhooks/generate-sitemap
```

#### C. Generate initial RSS
```bash
curl -X POST http://localhost:5000/api/automation/webhooks/generate-rss
```

#### D. Test internal link suggestions
```bash
curl -X POST http://localhost:5000/api/automation/internal-links/suggestions \
  -H "Content-Type: application/json" \
  -d '{"content": "Este artigo fala sobre pesca esportiva no Pantanal..."}'
```

#### E. Test redirects
```bash
curl http://localhost:5000/api/automation/redirects
```

### Step 6: Verify Public URLs

After generating sitemap and RSS:
- Visit: `http://localhost:5000/sitemap.xml`
- Visit: `http://localhost:5000/rss.xml`

## 🔧 Optional: Enable Automatic Webhooks

To enable automatic webhook triggers on content changes, run this SQL:

```sql
-- Enable triggers for automatic webhook firing
CREATE TRIGGER webhook_trigger_pages
  AFTER INSERT OR UPDATE OR DELETE ON pages
  FOR EACH ROW EXECUTE FUNCTION trigger_content_webhook();

CREATE TRIGGER webhook_trigger_blog_posts
  AFTER INSERT OR UPDATE OR DELETE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION trigger_content_webhook();

CREATE TRIGGER webhook_trigger_experiences
  AFTER INSERT OR UPDATE OR DELETE ON experiences
  FOR EACH ROW EXECUTE FUNCTION trigger_content_webhook();

CREATE TRIGGER webhook_trigger_accommodations
  AFTER INSERT OR UPDATE OR DELETE ON accommodations
  FOR EACH ROW EXECUTE FUNCTION trigger_content_webhook();

CREATE TRIGGER webhook_trigger_gastronomy_items
  AFTER INSERT OR UPDATE OR DELETE ON gastronomy_items
  FOR EACH ROW EXECUTE FUNCTION trigger_content_webhook();
```

## 🎯 Verification Checklist

After setup, verify these work:

- [ ] ✅ Webhook status endpoint responds
- [ ] ✅ Sitemap generation works
- [ ] ✅ RSS generation works  
- [ ] ✅ Internal link suggestions work (with OpenAI key)
- [ ] ✅ Redirect management works
- [ ] ✅ Public sitemap.xml serves correctly
- [ ] ✅ Public rss.xml serves correctly
- [ ] ✅ Google Search Console config accessible

## 🚀 Production Deployment

For production:

1. **Set environment variables**:
   ```env
   OPENAI_API_KEY=your_production_key
   DATABASE_URL=your_production_db_url
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   ```

2. **Configure Google Search Console**:
   ```bash
   curl -X PUT https://your-domain.com/api/automation/google-search-console/config \
     -H "Content-Type: application/json" \
     -d '{"siteVerificationToken": "your_gsc_token", "enabled": true}'
   ```

3. **Test all endpoints** with your production domain

## 📚 Documentation

- **Full API docs**: `docs/SPRINT4-AUTOMATION.md`
- **All endpoints**: 23 new automation endpoints
- **Error handling**: Comprehensive logging and monitoring
- **Performance**: Optimized for production use

## 🎉 Success!

Once complete, you'll have:
- ✅ Fully automated sitemap generation
- ✅ Automatic RSS feed updates
- ✅ AI-powered internal link suggestions  
- ✅ Complete redirect management
- ✅ Google Search Console integration
- ✅ Production-ready automation system

All Sprint 4 objectives achieved! 🚀
