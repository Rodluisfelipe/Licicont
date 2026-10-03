/**
 * LICICONT — Menú de Servicios
 * Fuente única de verdad de los 4 servicios. Tanto el diagnóstico interactivo
 * como la grilla de planes se renderizan desde aquí: agregar o ajustar un
 * servicio solo requiere tocar este archivo.
 */

export type ServiceId = 'socio' | 'proceso' | 'alto-valor' | 'rup';

export type PricingType = 'fijo' | 'suscripcion' | 'hibrido' | 'exito';

export type ServiceIcon = 'FileSearch' | 'Handshake' | 'Trophy' | 'BadgeCheck';

/** Tabla de precios por modalidad o trámite. */
export interface PriceTable {
  title: string;
  /** Texto corto bajo el título (entrega, alcance). */
  note?: string;
  rows: { label: string; price: string }[];
  /** Condiciones o aclaraciones de esta tabla. */
  footnotes?: string[];
}

export interface Service {
  id: ServiceId;
  order: number;
  name: string;
  /** Frase en primera persona que dice el cliente — el gancho del enrutador del menú. */
  clientVoice: string;
  tagline: string;
  forWho: string;
  includes: string[];
  /** Título de la lista `includes` en el detalle (por defecto, "Incluye"). */
  includesTitle?: string;
  /** Lista adicional con título propio (cómo funciona, rubros, etc.). */
  extra?: { title: string; items: string[] };
  conditions?: string[];
  priceTables?: PriceTable[];
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
    id: 'socio',
    order: 1,
    name: 'Socio Licitador',
    clientVoice: 'Quiero un aliado permanente que licite conmigo',
    tagline: 'Tu área de licitaciones, sin contratar un equipo.',
    forWho:
      'Empresas que quieren presentarse a procesos todos los meses con un aliado permanente.',
    includesTitle: 'Cada mes incluye',
    includes: [
      'Búsqueda y filtro de procesos de tu sector.',
      'Hasta 10 análisis de pliego con concepto de participar o no, incluida la detección de direccionamiento.',
      'Hasta 4 ofertas estructuradas y presentadas en SECOP.',
      'Para esas ofertas: observaciones al pliego, subsanaciones, respuestas a requerimientos y observaciones al informe de evaluación.',
      'Acompañamiento hasta la legalización del contrato (garantías y registro presupuestal).',
    ],
    conditions: [
      'Permanencia mínima de 3 meses.',
      'Una licitación pública o un concurso de méritos cuenta como 2 ofertas.',
      'Oferta adicional: $350.000.',
      'Los cupos no usados no se acumulan.',
      'El 1% se calcula sobre el valor inicial del contrato con IVA y se cobra solo cuando el contrato está firmado, con registro presupuestal expedido y garantías aprobadas.',
    ],
    notIncludes: [
      'Costo de pólizas',
      'Documentos propios de la empresa',
      'Desplazamientos a audiencias presenciales (se cotizan aparte)',
    ],
    pricingType: 'hibrido',
    pricingModel: '$1.500.000 al mes + 1% del valor del contrato, solo si ganas.',
    price: '$1.500.000 / mes + 1%',
    priceNote: 'el 1% solo si ganas',
    differentiator:
      'Modelo alineado: gano cuando tú ganas. Es el servicio estrella de Licicont.',
    commitment: 5,
    badge: 'Producto estrella',
    featured: true,
    icon: 'Handshake',
  },
  {
    id: 'proceso',
    order: 2,
    name: 'Por Proceso',
    clientVoice: 'Necesito armar un proceso puntual',
    tagline: 'Para un proceso puntual, sin mensualidad.',
    forWho: 'Empresas que quieren participar en un proceso puntual, sin mensualidad.',
    includes: [
      'Análisis de viabilidad: ¿participo o no? Informe en 48 horas hábiles.',
      'Estructuración y presentación de la oferta en SECOP II, con defensa hasta la adjudicación.',
      'Rescate de oferta: si te descalificaron, en 24 horas hábiles te digo sin costo si se puede pelear.',
    ],
    priceTables: [
      {
        title: '2.1 Análisis de viabilidad',
        note: 'Entrega en 48 horas hábiles. Requisitos habilitantes (jurídicos, financieros, técnicos y de experiencia) contrastados con tu empresa, riesgos y causales de rechazo, alertas de direccionamiento y concepto final: participar, no participar u observar el pliego primero.',
        rows: [
          { label: 'Mínima cuantía', price: '$150.000' },
          { label: 'Selección abreviada / subasta inversa', price: '$250.000' },
          { label: 'Licitación pública / concurso de méritos', price: '$400.000' },
        ],
        footnotes: [
          'Si decides presentarte conmigo, el 100% del análisis se descuenta de la estructuración.',
        ],
      },
      {
        title: '2.2 Estructuración y presentación',
        note: 'Incluye el análisis de viabilidad, el armado completo de la oferta, el diligenciamiento de formatos, la revisión documental y la presentación en SECOP II. Defensa incluida hasta la adjudicación: subsanaciones, respuestas a requerimientos y observaciones al informe de evaluación de esa oferta.',
        rows: [
          { label: 'Mínima cuantía', price: '$400.000' },
          { label: 'Selección abreviada / subasta inversa', price: '$650.000' },
          { label: 'Licitación pública / concurso de méritos', price: '$900.000' },
        ],
        footnotes: [
          'Cierre en menos de 72 horas: +30%.',
          'Opción de riesgo compartido: pagas el 50% del valor y el 1% del valor adjudicado solo si ganas.',
        ],
      },
      {
        title: '2.3 Rescate de oferta',
        note: '¿Te descalificaron o te marcaron "no cumple"? Envíame el informe de evaluación y tu oferta. En 24 horas hábiles te digo, sin costo, si se puede pelear. Si se puede, redacto el oficio de observaciones o la subsanación con sustento técnico y jurídico.',
        rows: [
          {
            label: 'Mínima cuantía y selección abreviada / subasta inversa',
            price: '$350.000',
          },
          { label: 'Licitación pública / concurso de méritos', price: '$600.000' },
        ],
        footnotes: [
          'Precio por oficio.',
          'Envíalo apenas se publique: los plazos para observar el informe son de pocos días hábiles, y en mínima cuantía solo uno.',
        ],
      },
    ],
    notIncludes: [],
    pricingType: 'fijo',
    pricingModel:
      'Análisis y rescate, 100% al iniciar. Estructuración, 50% al iniciar y 50% antes del cierre.',
    price: 'Desde $150.000',
    priceNote: 'por proceso, según modalidad',
    differentiator:
      'Detección de direccionamiento: sabes si el pliego está amarrado ANTES de gastar en presentarte.',
    commitment: 3,
    badge: 'Sin mensualidad',
    icon: 'FileSearch',
  },
  {
    id: 'alto-valor',
    order: 3,
    name: 'Alto Valor',
    clientVoice: 'Quiero oportunidades grandes',
    tagline: 'Oportunidades grandes, detectadas por mí y presentadas listas para ganar.',
    forWho: 'Empresas con capacidad de ejecutar contratos de $300 millones en adelante.',
    includesTitle: 'Cómo funciona',
    includes: [
      'Detecto el proceso y verifico que tu empresa cumple los requisitos habilitantes.',
      'Te lo presento con un análisis de viabilidad, sin costo.',
      'Si no cumples solo, te propongo armar un consorcio o unión temporal con un aliado que complete la experiencia o los indicadores. La decisión sobre el aliado es tuya.',
      'Si aceptas, firmamos acuerdo de confidencialidad y de prestación de servicios. Desde ese momento, esa oportunidad no se le presenta a ningún competidor tuyo.',
      'Estructuro, presento y defiendo la oferta hasta la adjudicación, y te acompaño en la legalización del contrato.',
    ],
    priceTables: [
      {
        title: 'Honorario de arranque',
        rows: [
          { label: 'Selección abreviada / subasta inversa', price: '$325.000' },
          { label: 'Licitación pública / concurso de méritos', price: '$450.000' },
        ],
        footnotes: ['Más el 1% del valor adjudicado, solo si ganas.'],
      },
    ],
    extra: {
      title: 'Rubros que trabajo',
      items: [
        'Papelería y útiles de oficina (UNSPSC segmento 44). Suministro para alcaldías, gobernaciones, universidades y entidades nacionales.',
        'Aseo, cafetería y abarrotes (segmentos 47 y 50).',
        'Tecnología (segmentos 43 y 45). Cómputo, periféricos, licenciamiento y audiovisuales. Suelen exigir certificación de fabricante o de canal autorizado.',
        'Tiquetes aéreos y turismo (78111500 y 90121500). Suelen exigir afiliación IATA, GDS, Registro Nacional de Turismo y certificaciones de aerolíneas.',
        'Ferretería y materiales (segmentos 27, 30, 31 y 39). Herramientas, materiales de construcción, eléctricos e iluminación.',
        'Dotación y mobiliario (segmentos 53 y 56).',
        'Obras civiles (segmento 72). Exigen capacidad residual (K de contratación) suficiente.',
      ],
    },
    notIncludes: [],
    pricingType: 'exito',
    pricingModel:
      'Honorario de arranque de $325.000 (selección abreviada / subasta inversa) o $450.000 (licitación pública / concurso de méritos) + 1% del valor adjudicado, solo si ganas.',
    price: 'Desde $325.000 + 1%',
    priceNote: 'el 1% solo si ganas',
    differentiator:
      'No solo ejecuto: te llevo oportunidades listas que no habrías encontrado, con exclusividad frente a tus competidores.',
    commitment: 4,
    badge: 'Alto ticket',
    icon: 'Trophy',
  },
  {
    id: 'rup',
    order: 4,
    name: 'RUP',
    clientVoice: 'Necesito mi RUP en regla',
    tagline: 'Tu RUP armado para ganar, no solo para estar inscrito.',
    forWho:
      'Empresas que necesitan inscribir, renovar o actualizar su Registro Único de Proponentes.',
    includes: [
      'Revisión de documentos y verificación de requisitos jurídicos, financieros y de experiencia.',
      'Clasificación UNSPSC contrastada con procesos reales de tu sector en SECOP, para que tu RUP tenga los códigos que piden los pliegos que quieres ganar.',
      'Organización de tu experiencia: qué contratos inscribir, con qué códigos y su valor en SMMLV.',
      'Diagnóstico de indicadores financieros: te digo a qué tamaño de procesos te alcanzan tus indicadores y en cuáles te quedas por fuera.',
      'Preparación, radicación y acompañamiento hasta la publicación.',
      'Recordatorio anual: el RUP se renueva a más tardar el quinto día hábil de abril; si no, pierde efectos. Te aviso con tiempo.',
    ],
    priceTables: [
      {
        title: 'Precio por trámite',
        rows: [
          { label: 'Inscripción', price: '$500.000' },
          { label: 'Renovación', price: '$400.000' },
          { label: 'Actualización', price: '$300.000' },
        ],
        footnotes: ['Más los derechos de la Cámara de Comercio, que pagas directamente.'],
      },
    ],
    notIncludes: ['Derechos de la Cámara de Comercio (los pagas directamente)'],
    pricingType: 'fijo',
    pricingModel:
      'Precio fijo por trámite + derechos de la Cámara de Comercio, que pagas directamente.',
    price: 'Desde $300.000',
    priceNote: '+ derechos de Cámara de Comercio',
    differentiator:
      'Bono: si contratas el Socio Licitador dentro de los 60 días siguientes, el valor del RUP se descuenta de tu primer mes.',
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
      'Foco en 7 nichos: papelería, cafetería, aseo, tecnología, ferretería, tiquetes aéreos y obras civiles. Hablo su idioma técnico y sé qué exige cada pliego.',
    icon: 'Target',
  },
  {
    title: 'IA con habilidades supervisadas',
    description:
      'Uso IA en la estructuración de licitaciones mediante Skills (habilidades) debidamente estructuradas y supervisadas, para que tu oferta sea 99% efectiva en la adjudicación.',
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
