#!/bin/bash
# Render.com Build Script

echo "🔨 Starting build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🏗️ Building frontend..."
npm run build

echo "✅ Build complete!"
cd ..

# Show build output
echo "📁 Build output:"
ls -la frontend/dist/
