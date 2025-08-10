#!/bin/bash

# Start the backend server
NODE_ENV=development tsx server/index.ts &

# Wait a moment for the server to start
sleep 2

# Change to Angular client directory and start the Angular dev server
cd angular-client && npm start