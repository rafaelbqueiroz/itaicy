# Sprint 4 - Automation Features Documentation

## Overview

Sprint 4 implements comprehensive automation features for the Itaicy Eco Lodge CMS, including webhook-driven sitemap/RSS generation, AI-powered internal link suggestions, redirect management, and Google Search Console integration.

## Features Implemented

### 1. Webhook System ("onPublish")

**Purpose**: Automatically trigger actions when content is published, updated, or deleted.

**Components**:
- `WebhookService` - Core webhook processing logic
- `webhook_logs` table - Track all webhook executions
- Database triggers - Automatically fire webhooks on content changes

**Events Supported**:
- `publish` - Content is published
- `unpublish` - Content is unpublished
- `update` - Content is updated
- `delete` - Content is deleted

**Content Types**:
- `page` - CMS pages
- `blog_post` - Blog articles
- `experience` - Tourism experiences
- `accommodation` - Lodge accommodations
- `gastronomy_item` - Menu items

### 2. Automatic Sitemap.xml Generation

**Purpose**: Generate and maintain an up-to-date XML sitemap for search engines.

**Features**:
- Automatic generation on content changes
- Includes all published content types
- Proper XML formatting with lastmod, changefreq, priority
- Saves to Supabase Storage at `/sitemap/sitemap.xml`
- Serves publicly at `https://itaicy.com.br/sitemap.xml`
- Automatic Google ping notification
- CDN cache purging support

**Configuration**:
```json
{
  "enabled": true,
  "baseUrl": "https://itaicy.com.br",
  "includeImages": true,
  "changefreq": "weekly",
  "priority": 0.8
}
```

### 3. Automatic RSS.xml Generation

**Purpose**: Generate RSS feed for blog posts with automatic updates.

**Features**:
- Automatic generation when blog posts change
- Includes latest 20 published posts
- Full RSS 2.0 compliance
- Featured image enclosures
- Proper XML formatting
- Saves to Supabase Storage at `/rss/rss.xml`
- Serves publicly at `https://itaicy.com.br/rss.xml`

**Configuration**:
```json
{
  "enabled": true,
  "title": "Itaicy Pantanal Eco Lodge - Blog",
  "description": "Histórias, dicas e experiências do Pantanal no Itaicy Eco Lodge",
  "maxItems": 20,
  "includeImages": true
}
```

### 4. AI-Powered Internal Link Suggestions

**Purpose**: Suggest relevant internal links using OpenAI GPT-4o-mini.

**Features**:
- Extract keywords from content using AI
- Match keywords against existing content
- Relevance scoring algorithm
- Support for all content types
- Fallback to basic keyword extraction
- Configurable suggestion limits

**API Endpoint**: `POST /api/automation/internal-links/suggestions`

**Request**:
```json
{
  "content": "Article content here...",
  "contentType": "blog_post",
  "excludeSlug": "current-article-slug"
}
```

**Response**:
```json
{
  "success": true,
  "suggestions": [
    {
      "keyword": "pesca esportiva",
      "url": "https://itaicy.com.br/experiencias/pesca-esportiva",
      "title": "Pesca Esportiva no Pantanal",
      "contentType": "experience",
      "relevanceScore": 85
    }
  ],
  "count": 10
}
```

### 5. Redirect Management System

**Purpose**: Manage 301/302 redirects with automatic creation on slug changes.

**Features**:
- Automatic redirect creation when slugs change
- Manual redirect management via API
- Support for 301, 302, 307, 308 status codes
- Redirect validation and circular detection
- Statistics and monitoring
- Middleware for handling redirects

**API Endpoints**:
- `GET /api/automation/redirects` - List all redirects
- `POST /api/automation/redirects` - Create redirect
- `PUT /api/automation/redirects/:id` - Update redirect
- `DELETE /api/automation/redirects/:id` - Delete redirect
- `GET /api/automation/redirects/check/*` - Check if path has redirect

### 6. Google Search Console Integration

**Purpose**: Integrate with Google Search Console for sitemap submission and monitoring.

**Features**:
- Site verification token management
- Automatic sitemap submission
- Submission logging and monitoring
- Configuration management
- Dashboard URL generation

**Configuration**:
```json
{
  "enabled": false,
  "siteVerificationToken": null,
  "propertyUrl": "https://itaicy.com.br"
}
```

## API Endpoints

### Webhook Management
- `POST /api/automation/webhooks/content` - Process webhook event
- `POST /api/automation/webhooks/generate-sitemap` - Manual sitemap generation
- `POST /api/automation/webhooks/generate-rss` - Manual RSS generation
- `GET /api/automation/webhooks/status` - Get webhook status
- `GET /api/automation/webhooks/logs` - Get webhook logs

### Internal Links
- `POST /api/automation/internal-links/suggestions` - Get link suggestions
- `GET /api/automation/internal-links/popular-targets` - Get popular targets
- `POST /api/automation/internal-links/validate` - Validate URLs
- `GET /api/automation/internal-links/stats` - Get statistics

### Redirects
- `GET /api/automation/redirects` - List redirects
- `POST /api/automation/redirects` - Create redirect
- `PUT /api/automation/redirects/:id` - Update redirect
- `DELETE /api/automation/redirects/:id` - Delete redirect
- `GET /api/automation/redirects/check/*` - Check redirect
- `GET /api/automation/redirects/stats` - Get statistics

### Google Search Console
- `GET /api/automation/google-search-console/config` - Get configuration
- `PUT /api/automation/google-search-console/config` - Update configuration
- `GET /api/automation/google-search-console/verification-tag` - Get verification tag
- `POST /api/automation/google-search-console/submit-sitemap` - Submit sitemap
- `GET /api/automation/google-search-console/indexing-status` - Get indexing status
- `GET /api/automation/google-search-console/search-performance` - Get performance data
- `GET /api/automation/google-search-console/submission-logs` - Get submission logs
- `GET /api/automation/google-search-console/dashboard-url` - Get dashboard URL

## Database Schema

### webhook_logs Table
```sql
CREATE TABLE webhook_logs (
  id SERIAL PRIMARY KEY,
  event VARCHAR(50) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  content_id INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,
  response JSONB,
  error TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Site Settings
All configuration is stored in the `site_settings` table with these keys:
- `webhook_config` - Webhook system configuration
- `google_search_console` - GSC integration settings
- `sitemap_config` - Sitemap generation settings
- `rss_config` - RSS feed settings
- `internal_links_config` - Internal link suggestion settings

## Setup Instructions

### 1. Run Migration
```bash
npx zx scripts/setup-sprint4.mjs
```

### 2. Configure Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=https://hcmrlpevcpkclqubnmmf.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Server
```bash
npm run dev
```

### 4. Test Features
```bash
npx zx scripts/test-sprint4.mjs
```

## Configuration

### Enable Webhook Triggers (Optional)
To enable automatic webhook triggers on content changes, run these SQL commands:

```sql
-- Enable triggers for automatic webhook firing
CREATE TRIGGER webhook_trigger_pages
  AFTER INSERT OR UPDATE OR DELETE ON pages
  FOR EACH ROW EXECUTE FUNCTION trigger_content_webhook();

CREATE TRIGGER webhook_trigger_blog_posts
  AFTER INSERT OR UPDATE OR DELETE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION trigger_content_webhook();

-- Add similar triggers for other content types
```

### Google Search Console Setup
1. Get verification token from Google Search Console
2. Update configuration via API:
```bash
curl -X PUT http://localhost:5000/api/automation/google-search-console/config \
  -H "Content-Type: application/json" \
  -d '{"siteVerificationToken": "your_token_here", "enabled": true}'
```

## Monitoring and Logs

### Webhook Logs
All webhook executions are logged in the `webhook_logs` table with:
- Event type and content information
- Execution status (pending, success, error)
- Response data and error messages
- Execution timestamp

### GSC Submission Logs
Google Search Console submissions are logged in site settings for monitoring.

## Error Handling

All services include comprehensive error handling:
- Graceful degradation when external services fail
- Detailed error logging
- Fallback mechanisms for AI features
- Retry logic for network operations

## Performance Considerations

- Webhook processing is asynchronous
- Sitemap generation is optimized for large content volumes
- Internal link suggestions are cached
- Database queries use proper indexing
- CDN integration for static file serving

## Security

- All API endpoints include proper validation
- Sensitive configuration data is protected
- Rate limiting can be implemented
- CORS headers are properly configured
- Input sanitization for all user data
