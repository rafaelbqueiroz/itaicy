module.exports = {
  ci: {
    collect: {
      // URLs to test
      url: [
        'https://staging.itaicy.com.br/',
        'https://staging.itaicy.com.br/acomodacoes',
        'https://staging.itaicy.com.br/experiencias',
        'https://staging.itaicy.com.br/gastronomia',
        'https://staging.itaicy.com.br/blog'
      ],
      // Number of runs per URL for more reliable results
      numberOfRuns: 3,
      // Lighthouse settings
      settings: {
        // Use mobile by default (most critical for Core Web Vitals)
        formFactor: 'mobile',
        // Throttling settings
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 150,
          downloadThroughputKbps: 1638.4,
          uploadThroughputKbps: 675
        },
        // Screen emulation
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false
        },
        // Additional settings
        onlyCategories: ['performance', 'accessibility', 'seo'],
        skipAudits: [
          'uses-http2', // Not always controllable
          'redirects-http', // May not be applicable
          'uses-long-cache-ttl' // CDN dependent
        ]
      }
    },
    assert: {
      // Performance thresholds
      assertions: {
        // Core Web Vitals
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Specific metrics
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Resource optimization
        'unused-css-rules': ['warn', { maxLength: 1 }],
        'unused-javascript': ['warn', { maxLength: 1 }],
        'modern-image-formats': ['error', { maxLength: 0 }],
        'uses-responsive-images': ['error', { maxLength: 0 }],
        'efficient-animated-content': ['error', { maxLength: 0 }],
        
        // Best practices
        'uses-text-compression': ['error', { maxLength: 0 }],
        'render-blocking-resources': ['warn', { maxLength: 2 }],
        'unminified-css': ['error', { maxLength: 0 }],
        'unminified-javascript': ['error', { maxLength: 0 }],
        
        // Accessibility
        'color-contrast': ['error', { maxLength: 0 }],
        'image-alt': ['error', { maxLength: 0 }],
        'heading-order': ['error', { maxLength: 0 }],
        'link-name': ['error', { maxLength: 0 }],
        
        // SEO
        'meta-description': ['error', { maxLength: 0 }],
        'document-title': ['error', { maxLength: 0 }],
        'hreflang': ['warn', { maxLength: 0 }],
        'canonical': ['warn', { maxLength: 0 }]
      }
    },
    upload: {
      // Store results for comparison
      target: 'temporary-public-storage'
    },
    server: {
      // Optional: run local server for testing
      command: 'npm run build && npm start',
      port: 5000,
      timeout: 120000
    }
  }
};

// Environment-specific configurations
if (process.env.CI_ENVIRONMENT === 'production') {
  // Production URLs
  module.exports.ci.collect.url = [
    'https://itaicy.com.br/',
    'https://itaicy.com.br/acomodacoes',
    'https://itaicy.com.br/experiencias',
    'https://itaicy.com.br/gastronomia',
    'https://itaicy.com.br/blog'
  ];
  
  // Stricter thresholds for production
  module.exports.ci.assert.assertions = {
    ...module.exports.ci.assert.assertions,
    'categories:performance': ['error', { minScore: 0.95 }],
    'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
    'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }]
  };
}

if (process.env.CI_ENVIRONMENT === 'development') {
  // Local development URLs
  module.exports.ci.collect.url = [
    'http://localhost:5000/',
    'http://localhost:5000/acomodacoes',
    'http://localhost:5000/experiencias',
    'http://localhost:5000/gastronomia',
    'http://localhost:5000/blog'
  ];
  
  // More lenient thresholds for development
  module.exports.ci.assert.assertions = {
    ...module.exports.ci.assert.assertions,
    'categories:performance': ['warn', { minScore: 0.8 }],
    'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
    'cumulative-layout-shift': ['warn', { maxNumericValue: 0.15 }]
  };
}
