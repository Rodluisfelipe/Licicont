import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { verifyEmailTransport } from './services/email.service.js';
import { errorHandler } from './middleware/errorHandler.js';
import invitationRoutes from './routes/invitation.routes.js';

const app = express();

// ── Security & Parsing ──
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));

// ── Routes ──
app.use('/api/invitations', invitationRoutes);

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'operational', timestamp: new Date().toISOString() });
});

// ── Error Handler ──
app.use(errorHandler);

// ── Boot ──
async function bootstrap(): Promise<void> {
  await connectDB();
  await verifyEmailTransport();

  app.listen(env.PORT, () => {
    console.log(`\n  ╔══════════════════════════════════════╗`);
    console.log(`  ║  LICICONT API — Port ${env.PORT}            ║`);
    console.log(`  ║  Environment: ${env.NODE_ENV.padEnd(20)}║`);
    console.log(`  ╚══════════════════════════════════════╝\n`);
  });
}

bootstrap().catch(console.error);
