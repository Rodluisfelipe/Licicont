import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { invitationEmailTemplate } from '../templates/invitation-email.js';
import { INVITATION_EXPIRY_HOURS } from '../config/constants.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

interface SendInvitationParams {
  to: string;
  fullName: string;
  code: string;
}

export async function sendInvitationEmail(params: SendInvitationParams): Promise<void> {
  const { to, fullName, code } = params;
  const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_HOURS * 60 * 60 * 1000);
  const accessUrl = `${env.CLIENT_URL}/acceso/${code}`;

  const html = invitationEmailTemplate({
    fullName,
    code,
    accessUrl,
    expiresAt,
  });

  await transporter.sendMail({
    from: `"LICICONT" <${env.GMAIL_USER}>`,
    to,
    subject: 'LICICONT — Su acceso ha sido concedido',
    html,
  });

  console.log(`[EMAIL] Invitación enviada → ${to} (code: ${code})`);
}

/** Verificar conexión SMTP al iniciar */
export async function verifyEmailTransport(): Promise<boolean> {
  try {
    if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
      console.warn('[EMAIL] SMTP credentials not configured — email sending disabled');
      return false;
    }
    await transporter.verify();
    console.log('[EMAIL] SMTP transport verified ✓');
    return true;
  } catch {
    console.warn('[EMAIL] SMTP verification failed — email sending may not work');
    return false;
  }
}
