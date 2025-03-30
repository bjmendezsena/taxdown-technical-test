#!/bin/sh

# Wait for databases to be ready
echo "Waiting for databases to be ready..."
sleep 5

# Run Prisma migrations
echo "Running database migrations..."
pnpx prisma migrate deploy

# Start the application
echo "Starting application..."
node dist/main.js
