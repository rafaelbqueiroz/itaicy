#!/bin/bash

# Vercel Build Script for Itaicy Eco Lodge
echo "🚀 Starting Vercel build process..."

# Navigate to the project directory
cd ItaicyEcoLodge

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in ItaicyEcoLodge directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run health check
echo "🔍 Running health check..."
npm run health-check || echo "⚠️ Health check failed, continuing..."

# Validate schema
echo "📋 Validating schema..."
npm run validate-schema || echo "⚠️ Schema validation failed, continuing..."

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # List build output
    echo "📁 Build output:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Vercel build process completed!"
