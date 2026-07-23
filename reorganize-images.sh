#!/bin/bash
# Restructures public/images into: public/images/projects/<slug>/thumbnail.<ext>
# Run this from the BuildSpace project root: bash reorganize-images.sh
set -e

cd public/images

mkdir -p projects/ecommerce-platform
mkdir -p projects/realtime-chat
mkdir -p projects/ai-resume-builder
mkdir -p projects/netflix-clone
mkdir -p projects/microservices-architecture
mkdir -p projects/social-media-dashboard
mkdir -p projects/task-management-api
mkdir -p projects/fitness-tracker-mobile
mkdir -p projects/nft-marketplace
mkdir -p projects/vulnerability-scanner
mkdir -p projects/smart-home-hub

# ecommerce-platform: you already replaced this one with ecom.jpeg
cp "ecom.jpeg" "projects/ecommerce-platform/thumbnail.jpeg"

cp "Image (Real-Time Chat App with Socket.io, Redis & React).png" "projects/realtime-chat/thumbnail.png"
cp "Image (AI-Powered Resume Builder with OpenAI & FastAPI).png" "projects/ai-resume-builder/thumbnail.png"
cp "Image (Netflix Clone with React, Firebase & TMDb API).png" "projects/netflix-clone/thumbnail.png"
cp "Image (Microservices Architecture with Docker, Kubernetes & Node.js).png" "projects/microservices-architecture/thumbnail.png"
cp "Image (Social Media Dashboard with React, GraphQL & MongoDB).png" "projects/social-media-dashboard/thumbnail.png"

# These originally reused another project's placeholder image — copy the same
# source so nothing goes blank; replace with real images later via the admin panel.
cp "Image (Microservices Architecture with Docker, Kubernetes & Node.js).png" "projects/task-management-api/thumbnail.png"
cp "Image (AI-Powered Resume Builder with OpenAI & FastAPI).png" "projects/fitness-tracker-mobile/thumbnail.png"
cp "Image (Netflix Clone with React, Firebase & TMDb API).png" "projects/nft-marketplace/thumbnail.png"
cp "Image (Social Media Dashboard with React, GraphQL & MongoDB).png" "projects/vulnerability-scanner/thumbnail.png"
cp "ecom.jpeg" "projects/smart-home-hub/thumbnail.jpeg"

echo "Done. New files are under public/images/projects/<slug>/thumbnail.*"
echo "Once you confirm the site looks right, you can delete the old top-level"
echo "duplicate image files (the ones still sitting loose in public/images/)."
