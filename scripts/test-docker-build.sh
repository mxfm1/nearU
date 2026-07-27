#!/bin/bash

# Script to test Docker build locally before pushing
# Usage: ./scripts/test-docker-build.sh

set -e

echo "🔨 Building Docker image..."

docker build \
  --tag nearu-frontend:test \
  .

echo ""
echo "✅ Docker build successful!"
echo "📦 Image: nearu-frontend:test"

# Optional: run the container to verify it starts
echo ""
echo "🚀 Testing container startup..."
docker run -d --name nearu-test -p 3000:3000 nearu-frontend:test
sleep 5

if curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
  echo "✅ Health check passed!"
else
  echo "⚠️  Health check failed (this might be normal if API is not configured)"
fi

# Cleanup
docker rm -f nearu-test > /dev/null 2>&1 || true

echo ""
echo "Done!"
