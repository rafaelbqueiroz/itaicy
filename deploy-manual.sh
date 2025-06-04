#!/bin/bash

echo "🚀 Manual Vercel Deploy Script"
echo "==============================="

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Make sure you're in the project root."
    exit 1
fi

# Navigate to ItaicyEcoLodge directory
cd ItaicyEcoLodge

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Go back to root
cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod --yes

echo "✅ Deploy completed!"
echo "🌐 Check your Vercel dashboard for the deployment URL"
