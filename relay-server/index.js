// import { RealtimeRelay } from './lib/relay.js';
// import dotenv from 'dotenv';
// dotenv.config({ override: true });

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// if (!OPENAI_API_KEY) {
//   console.error(
//     `Environment variable "OPENAI_API_KEY" is required.\n` +
//       `Please set it in your .env file.`
//   );
//   process.exit(1);
// }

// const PORT = parseInt(process.env.PORT) || 8081;

// const relay = new RealtimeRelay(OPENAI_API_KEY);
// relay.listen(PORT);

// relay-server/index.js

// relay-server/index.js

import express from 'express';
import cors from 'cors';
import { RealtimeRelay } from './lib/relay.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ override: true });

// Retrieve the OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error(
    `Environment variable "OPENAI_API_KEY" is required.\n` +
      `Please set it in your .env file.`
  );
  process.exit(1);
}

// Retrieve the port from environment variables or default to 8081
const PORT = parseInt(process.env.PORT, 10) || 8081;

// Initialize the Express application
const app = express();

// Configure CORS to allow requests from your frontend domain
const allowedOrigins = [
  'https://openai-realtime-console-production-bbd6.up.railway.app',
  'http://localhost:3000', // Include this if you’re testing locally
];

// CORS Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

// Initialize the RealtimeRelay with the OpenAI API key
const relay = new RealtimeRelay(OPENAI_API_KEY);

// Mount the relay's routes on the Express app
app.use('/api', relay.app); // Prefix routes with /api for clarity

// Health Check Endpoint (optional but recommended)
app.get('/health', (req, res) => {
  res.status(200).send('Relay server is healthy!');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Relay server is running on port ${PORT}`);
});

// Graceful Shutdown (optional but recommended)
const shutdown = () => {
  console.log('Shutting down relay server...');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
