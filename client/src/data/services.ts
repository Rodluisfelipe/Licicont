/**
 * LICICONT — Menú de Servicios
 * Fuente única de verdad de los 6 servicios. Tanto el diagnóstico interactivo
 * como la grilla de planes se renderizan desde aquí: agregar o ajustar un
 * servicio solo requiere tocar este archivo.
 */

export type ServiceId =
  | 'formacion'
  | 'radar'
  | 'proceso'
  | 'socio'
  | 'alto-valor'
  | 'rup';

export type PricingType = 'fijo' | 'suscripcion' | 'hibrido' | 'exito';

export type ServiceIcon =
  | 'GraduationCap'
  | 'Radar'
  | 'FileSearch'
  | 'Handshake'
  | 'Trophy'
  | 'BadgeCheck';

export interface Service {
  id: ServiceId;
  order: number;
  name: string;
  /** Frase en primera persona que dice el cliente — el gancho del enrutador del menú. */
  clientVoice: string;
  tagline: string;
  forWho: string;
  includes: string[];
  notIncludes: string[];
  pricingType: PricingType;
  pricingModel: string;
  price: string;
  priceNote?: string;
  differentiator: string;
  /** Nivel de compromiso (1 = puntual, 5 = alianza permanente). Ordena la grilla. */
  commitment: 1 | 2 | 3 | 4 | 5;
  badge?: string;
  /** Producto estrella: se resalta visualmente. */
  featured?: boolean;
  icon: ServiceIcon;
}

export const SERVICES: Service[] = [
  {
    id: 'formacion',
    order: 1,
    name: 'Formación: Domina tus Licitaciones',
    clientVoice: 'Quiero aprender a licitar',
    tagline: 'Aprende a venderle al Estado desde cero, con casos reales de tu nicho.',
    forWho:
      'Emprendedores y pequeñas empresas que quieren aprender a venderle al Estado desde cero.',
    includes: [
      'Fundamentos de contratación estatal',
      'Búsqueda y filtrado en SECOP II',
      'Análisis de pliegos paso a paso',
      'Presentación de ofertas',
      'Grupos reducidos, en vivo, con material y casos reales',
    ],
    notIncludes: ['Acompañamiento en procesos reales (eso va en otro servicio)'],
    pricingType: 'fijo',
    pricingModel: 'Precio fijo por participante',
    price: '$1.000.000 – $1.200.000',
    priceNote: 'por participante',
    differentiator:
      'Casos reales de tu nicho + herramientas de IA que los demás no enseñan.',
    commitment: 1,
    badge: 'Punto de partida',
    icon: 'GraduationCap',
  },
  {
    id: 'radar',
    order: 2,
    name: 'Radar de Oportunidades',
    clientVoice: 'Quiero que vigilen las oportunidades por mí',
    tagline: 'Dejas de revisar SECOP a diario: las oportunidades afines te llegan filtradas.',
    forWho:
      'Empresas que quieren vender al Estado pero no tienen tiempo de revisar SECOP a diario.',
    includes: [
      'Vigilancia de procesos por sector',
      'Resúmenes mensuales de oportunidades afines',
      'Alertas de procesos con afinidad real',
    ],
    notIncludes: [
      'Estructuración o presentación de ofertas (se cotiza aparte o se sube a Socio Licitador)',
    ],
    pricingType: 'suscripcion',
    pricingModel: 'Suscripción mensual. Permanencia mínima 3 meses.',
    price: '$450.000 – $600.000',
    priceNote: '/ mes · mínimo 3 meses',
    differentiator:
      'Rastreo potenciado con IA: filtro por afinidad real, no listados genéricos.',
    commitment: 2,
    icon: 'Radar',
  },
  {
    id: 'proceso',
    order: 3,
    name: 'Análisis y Estructuración por Proceso',
    clientVoice: 'Necesito armar un proceso puntual',
    tagline: 'Un proceso concreto, sin comprometerte a un mensual.',
    forWho:
      'Empresas que quieren participar en un proceso puntual sin comprometerse a un mensual.',
    includes: [
      'Análisis de pliego con detección de riesgos y direccionamiento',
      'Estructuración y presentación de la oferta en SECOP',
    ],
    notIncludes: [
      'Vigilancia continua ni seguimiento posterior, salvo que se contrate aparte',
    ],
    pricingType: 'fijo',
    pricingModel:
      'Por entregable (fijo) + opción de comisión por éxito sobre la adjudicación',
    price: 'Análisis $150.000 – $400.000 · Estructuración $400.000 – $900.000',
    priceNote: 'por proceso',
    differentiator:
      'Detección de direccionamiento: sabes si el pliego está amarrado ANTES de gastar en presentarte.',
    commitment: 3,
    badge: 'Sin mensualidad',
    icon: 'FileSearch',
  },
  {
    id: 'socio',
    order: 4,
    name: 'Socio Licitador',
    clientVoice: 'Quiero un aliado permanente que licite conmigo',
    tagline: 'Todo el ciclo, mes a mes: yo gano cuando tú ganas.',
    forWho:
      'Empresas que quieren un aliado permanente que licite con ellas mes a mes.',
    includes: [
      'Vigilancia continua de oportunidades',
      'Análisis de pliegos y evaluación Go / No-Go',
      'Estructuración y presentación de ofertas',
      'Subsanaciones y seguimiento del proceso',
      'Acompañamiento hasta la ejecución del contrato',
    ],
    notIncludes: [],
    pricingType: 'hibrido',
    pricingModel:
      'Híbrido: honorario mensual fijo + 1% de comisión por cada contrato adjudicado',
    price: 'Desde $1.500.000 / mes + 1%',
    priceNote: 'por adjudicación',
    differentiator:
      'Modelo alineado: gano cuando el cliente gana. Es el servicio estrella de Licicont.',
    commitment: 5,
    badge: 'Más elegido',
    featured: true,
    icon: 'Handshake',
  },
  {
    id: 'alto-valor',
    order: 5,
    name: 'Intermediación de Alto Valor',
    clientVoice: 'Tengo o quiero una oportunidad grande',
    tagline: 'Te llevo procesos grandes que no habrías encontrado, y los ejecutamos juntos.',
    forWho:
      'Empresas con capacidad de ejecutar procesos grandes que Licicont detecta y les lleva.',
    includes: [
      'Detección de la oportunidad de alto valor',
      'Análisis de viabilidad y capacidad de ejecución',
      'Estructuración completa de la oferta',
      'Acompañamiento del proceso hasta la adjudicación',
    ],
    notIncludes: [],
    pricingType: 'exito',
    pricingModel:
      'Comisión por éxito sobre la adjudicación (+ honorario de acompañamiento opcional)',
    price: '1% – 3% negociado',
    priceNote: 'según el tamaño del proceso',
    differentiator:
      'No solo ejecuto: llevo oportunidades listas que el cliente no habría encontrado.',
    commitment: 4,
    badge: 'Alto ticket',
    icon: 'Trophy',
  },
  {
    id: 'rup',
    order: 6,
    name: 'Gestión de RUP',
    clientVoice: 'Necesito mi RUP en regla',
    tagline: 'Sin RUP vigente no puedes licitar. Lo dejamos en regla.',
    forWho:
      'Empresas que necesitan inscribir, renovar o actualizar su Registro Único de Proponentes.',
    includes: [
      'Revisión documental completa',
      'Verificación de requisitos habilitantes',
      'Clasificación UNSPSC',
      'Radicación y acompañamiento del trámite',
    ],
    notIncludes: ['Gastos de Cámara de Comercio (van aparte)'],
    pricingType: 'fijo',
    pricingModel: 'Precio fijo + gastos de Cámara de Comercio',
    price: '$500.000',
    priceNote: '+ gastos de cámara',
    differentiator:
      'Se ofrece como complemento o puerta de entrada a los demás servicios.',
    commitment: 1,
    badge: 'Requisito previo',
    icon: 'BadgeCheck',
  },
];

export const SERVICE_MAP: Record<ServiceId, Service> = SERVICES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<ServiceId, Service>
);

export function getService(id: ServiceId): Service {
  return SERVICE_MAP[id];
}

/** Los 4 diferenciadores del menú de servicios. */
export const DIFFERENTIATORS = [
  {
    title: 'Especialista, no generalista',
    description:
      'Foco en empresas de tecnología y dotación: hablo su idioma técnico y encuentro el producto que cumple la ficha.',
    icon: 'Target',
  },
  {
    title: 'Potenciado con IA propia',
    description:
      'Herramientas propias que aceleran el análisis, la identificación de productos y las matrices de cumplimiento.',
    icon: 'Sparkles',
  },
  {
    title: 'Detección de direccionamiento',
    description:
      'Sé leer cuándo un pliego está amarrado. Te evito gastar tiempo y dinero en procesos perdidos.',
    icon: 'ShieldAlert',
  },
  {
    title: 'Comisión por éxito',
    description:
      'Alineo mi pago con tu resultado. La mayoría solo cobra fijo — yo comparto el riesgo y el premio.',
    icon: 'HandCoins',
  },
] as const;
