import type { Recommendation } from '@/lib/recommendation';

export const WA_PHONE = '573023805967';
export const CONTACT_EMAIL = 'licitacionesycontratas@gmail.com';

export interface LeadContact {
  fullName: string;
  company: string;
  phone: string;
  email?: string;
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Mensaje del diagnóstico: llega a WhatsApp con el plan recomendado y el
 * perfil completo, para que la primera respuesta ya sea una propuesta.
 */
export function buildDiagnosticMessage(
  rec: Recommendation,
  lead: LeadContact
): string {
  const lines = [
    `Hola Andrés, hice el diagnóstico en licicont.me y mi plan recomendado es *${rec.primary.name}*.`,
    '',
    '*Mi empresa:*',
    `• Nombre: ${lead.fullName}`,
    `• Empresa: ${lead.company}`,
  ];

  if (lead.email) lines.push(`• Email: ${lead.email}`);

  lines.push('', '*Mi diagnóstico:*');
  for (const item of rec.profile) {
    lines.push(`• ${item.label}: ${item.value}`);
  }

  lines.push('', `*Resultado:* ${rec.primary.name} (${rec.affinity}% de afinidad)`);
  lines.push(`*Inversión estimada:* ${rec.primary.price}`);

  if (rec.complements.length > 0) {
    lines.push(`*Complementos sugeridos:* ${rec.complements.map((c) => c.name).join(', ')}`);
  }

  lines.push('', '¿Podemos hablar de cómo arrancamos?');

  return lines.join('\n');
}

/** Mensaje corto cuando el interés nace desde una tarjeta de plan. */
export function buildServiceMessage(serviceName: string, price: string): string {
  return [
    `Hola Andrés, me interesa el servicio *${serviceName}* de Licicont.`,
    '',
    `Vi que la inversión estimada es ${price}.`,
    '',
    '¿Me cuentas cómo funciona y si aplica para mi empresa?',
  ].join('\n');
}

/** Alternativa al WhatsApp: el mismo mensaje por correo, sin el formato de WhatsApp. */
export function mailtoUrl(subject: string, body: string): string {
  const plain = body.replace(/\*/g, '');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(plain)}`;
}
