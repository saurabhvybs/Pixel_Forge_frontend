# Pixel Forge Tech - Frontend

## Overview
This is the frontend application for Pixel Forge Tech, built with React Native, Expo, TypeScript, and TailwindCSS.

## Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)
- Docker and Docker Compose (for containerized development)

## Project Structure
```
frontend/Pixel_Forge_Tech/
├── src/
│   ├── api/            # API integration
│   ├── components/     # Reusable components
│   ├── config/         # Configuration files
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # Screen components
│   ├── store/          # State management
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── assets/             # Images, fonts, etc.
├── .env.example        # Example environment variables
├── .gitignore         # Git ignore file
├── App.tsx            # Root component
├── Dockerfile         # Docker configuration
├── app.json           # Expo configuration
├── babel.config.js    # Babel configuration
├── package.json       # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

## Environment Variables
Create a `.env` file in the root directory based on `.env.example`:

```env
# API Configuration
API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development

# Expo Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Authentication
EXPO_PUBLIC_AUTH_ENABLED=true

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=false

# App Configuration
EXPO_PUBLIC_APP_NAME=Pixel Forge Tech
EXPO_PUBLIC_APP_VERSION=1.0.0

# Development
EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
```

## Installation

### Local Development
1. Clone the repository
```bash
git clone <repository-url>
cd frontend/Pixel_Forge_Tech
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server
```bash
npm start
```

### Docker Development
1. Build and start the containers
```bash
docker-compose up --build
```

2. To stop the containers
```bash
docker-compose down
```

## Available Scripts
- `npm start`: Start the Expo development server
- `npm run android`: Run on Android device/emulator
- `npm run ios`: Run on iOS simulator
- `npm run web`: Run in web browser
- `npm run test`: Run tests
- `npm run lint`: Run linter
- `npm run format`: Format code with Prettier

## Development Workflow
1. Start the backend server first
2. Start the frontend development server
3. Use Expo Go app on your device or simulator to test

## Common Issues and Solutions

### Expo Issues
- If Metro bundler fails to start, try clearing cache:
  ```bash
  expo start -c
  ```
- For iOS build issues, ensure Xcode is properly configured
- For Android build issues, ensure Android Studio and SDK are properly set up

### Environment Variables
- All Expo public variables must be prefixed with `EXPO_PUBLIC_`
- Ensure backend URL is correctly set in environment variables
- Check if API endpoints are accessible

### Docker Issues
- If containers fail to start, check port conflicts
- Ensure all environment variables are properly set
- Check Docker logs for detailed error messages

## Contributing
1. Create a new branch for your feature
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## License
[Your License Here] 