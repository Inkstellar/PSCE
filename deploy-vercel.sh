#!/bin/bash

# Purple Skull Comics Vercel Deployment Script

echo "🚀 Starting Purple Skull Comics Vercel Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "   npm install -g vercel"
    echo "   or visit: https://vercel.com/docs/cli"
    exit 1
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

echo "✅ Vercel CLI is installed and you're logged in"

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "🎉 Your Purple Skull Comics application is now live on Vercel!"
echo ""
echo "Next steps:"
echo "1. Set up environment variables in Vercel dashboard if not already done"
echo "2. Configure your domain (optional)"
echo "3. Monitor the deployment in Vercel dashboard"
