import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import issuerRoutes from './routes/issuer';
import cardholderRoutes from './routes/cardholder';
import cardRoutes from './routes/card';
import merchantRoutes from './routes/merchant';
import transactionRoutes from './routes/transaction';
import disputeRoutes from './routes/dispute';
import settlementRoutes from './routes/settlement';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
const allowedOrigins = [
  'http://localhost:5137',
  'http://localhost:3001',
  ...(process.env.API_CORS_ORIGINS?.split(',') ?? []),
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /\.app\.github\.dev$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(express.json());

// Swagger
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PayFlow Network API',
      version: '1.0.0',
      description: 'REST API for the PayFlow payment network operations platform',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./src/models/*.ts', './src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

// Routes
app.use('/api/issuers', issuerRoutes);
app.use('/api/cardholders', cardholderRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/settlements', settlementRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'payflow-api' }));

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`PayFlow API running on http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}

export default app;
