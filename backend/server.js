import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import apiRouter from './routes/index.js';
import { hasToken } from './config/githubClient.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount central API router under /api
app.use('/api', apiRouter);

// Fallback 404 handler for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: `No route for ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
  console.log(`\n  GitHub Profile Analyzer API → http://localhost:${PORT}\n`);
  if (!hasToken()) {
    console.warn(
      '  ⚠  No GITHUB_TOKEN set — using the unauthenticated GitHub API (60 requests/hour).\n' +
        '     Copy .env.example to .env and add a token to raise it to 5,000/hour.\n'
    );
  }
});
