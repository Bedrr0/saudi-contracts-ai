#!/bin/bash

# Script to prepare exportable project files for Saudi AI Contracts
# This script creates a zip file containing all necessary files for external hosting

echo "Preparing exportable project files for Saudi AI Contracts..."

# Create a directory for exportable files
mkdir -p /home/ubuntu/saudi_ai_contracts_export

# Copy the built static files
echo "Copying built static files..."
cp -r /home/ubuntu/saudi_ai_contracts_web/out/* /home/ubuntu/saudi_ai_contracts_export/

# Create a README file with instructions
cat > /home/ubuntu/saudi_ai_contracts_export/README.md << 'EOL'
# Saudi AI Contracts - Exportable Project Files

## Overview
This package contains the complete Saudi AI Contracts web application as static HTML/CSS/JS files that can be hosted on any web server.

## Hosting Instructions

### Option 1: Simple Web Server
1. Upload all files to your web server's root directory
2. Ensure index.html is set as the default document
3. No server-side processing is required as this is a fully static application

### Option 2: CDN Hosting (Recommended for Production)
1. Upload all files to a CDN service like Cloudflare Pages, Netlify, or Vercel
2. Configure the CDN to serve index.html for all routes (for SPA routing)
3. Set up a custom domain if desired

### Option 3: Local Testing
1. You can test locally using any simple HTTP server
2. Example with Python: `python -m http.server` in the directory containing these files
3. Then visit http://localhost:8000 in your browser

## Customization

### Updating Contact Information
1. Edit the contact email and phone number in the HTML files where they appear
2. Search for "support@saudi-ai-contracts.com" to find all instances

### Modifying Subscription Plans
1. Edit the subscription plan details in the HTML files
2. Search for plan names like "الباقة المجانية" or "Basic Plan" to find all instances

### Adding Payment Integration
1. To add payment integration, you'll need to modify the subscription buttons
2. Add JavaScript code to handle payment processing with services like PayTabs or Stripe

## Future Development
For more complex changes or to rebuild the application from source:
1. Visit the original GitHub repository (if applicable)
2. Contact the development team at support@saudi-ai-contracts.com

## License
This software is proprietary and confidential. Unauthorized copying, distribution, or use is prohibited.
EOL

# Create a zip file of the exportable files
echo "Creating zip archive..."
cd /home/ubuntu
zip -r saudi_ai_contracts_export.zip saudi_ai_contracts_export

echo "Exportable project files prepared successfully!"
echo "Zip file location: /home/ubuntu/saudi_ai_contracts_export.zip"
echo "Extracted files location: /home/ubuntu/saudi_ai_contracts_export/"
