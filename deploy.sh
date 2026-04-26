#!/bin/bash

# Production deployment script for Parcel Connect Frontend

echo "🚀 Starting production deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run production build
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files located in: dist/parcel-frontend-new/"
    echo "🌐 Ready for deployment to server"
    
    # Optional: Copy to deployment directory
    # cp -r dist/parcel-frontend-new/* /var/www/html/
    
    echo "🎉 Deployment ready!"
else
    echo "❌ Build failed!"
    exit 1
fi
