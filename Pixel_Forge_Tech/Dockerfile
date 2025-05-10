# Use Node.js LTS version
FROM node:20-alpine

# Install necessary dependencies
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Install Expo CLI globally
RUN npm install -g expo-cli

# Expose the port the app runs on
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Command to run the application
CMD ["npm", "start"] 