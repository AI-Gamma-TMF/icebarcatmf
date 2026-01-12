#!/bin/bash
# Trigger manual deployment for icebarcatmf-admin-demo

APP_ID="80d47f82-65f1-4536-870d-c58df310d0f7"

echo "🚀 Triggering deployment for icebarcatmf-admin-demo..."
echo ""

# Check if DIGITALOCEAN_TOKEN is set
if [ -z "$DIGITALOCEAN_TOKEN" ]; then
    echo "❌ ERROR: DIGITALOCEAN_TOKEN environment variable is not set"
    echo ""
    echo "Please set it:"
    echo "export DIGITALOCEAN_TOKEN='your_token_here'"
    echo ""
    echo "Or manually trigger deployment from:"
    echo "https://cloud.digitalocean.com/apps/80d47f82-65f1-4536-870d-c58df310d0f7"
    exit 1
fi

# Trigger deployment by updating the app (forces redeploy)
curl -X POST \
  "https://api.digitalocean.com/v2/apps/${APP_ID}/deployments" \
  -H "Authorization: Bearer $DIGITALOCEAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "force_build": true
  }'

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "Monitor progress at:"
echo "https://cloud.digitalocean.com/apps/${APP_ID}"
