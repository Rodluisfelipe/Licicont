/**
 * Curvas y tiempos compartidos.
 *
 * Una sola familia de easings mantiene el movimiento coherente: todo entra con
 * la misma desaceleración, lo que se percibe como intención y no como efecto.
 */

/** Salida suave y larga — la curva principal de la página. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Entrada y salida equilibradas, para elementos que se desplazan. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
} as const;

/** Muelle para lo que sigue al scroll: sin rebote, solo inercia. */
export const SCROLL_SPRING = {
  stiffness: 120,
  damping: 30,
  restDelta: 0.001,
} as const;
