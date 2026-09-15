import { useCallback, useMemo } from 'react';

/**
 * Respuesta háptica en el móvil.
 *
 * Usa la Vibration API, disponible en Android (Chrome, Samsung Internet,
 * Firefox). iOS/Safari no la expone: ahí el gesto simplemente no vibra, sin
 * error ni degradación visible. Nunca es la única señal de que algo ocurrió —
 * siempre acompaña a un cambio visual.
 */

export type HapticPattern =
  /** Toque seco: seleccionar una opción, marcar una respuesta. */
  | 'select'
  /** Cambio de contexto: avanzar de paso, abrir una hoja. */
  | 'step'
  /** Confirmación: envío completado. */
  | 'success'
  /** Aviso: acción no disponible o campo incompleto. */
  | 'warn'
  /** Roce mínimo: abrir un detalle, cambiar de pestaña. */
  | 'tick';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  tick: 8,
  select: 14,
  step: [10, 40, 16],
  success: [16, 45, 24, 45, 40],
  warn: [28, 60, 28],
};

export function useHaptics() {
  const supported = useMemo(
    () => typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function',
    []
  );

  const haptic = useCallback(
    (pattern: HapticPattern = 'select') => {
      if (!supported) return;

      // Algunos navegadores lanzan si el gesto no viene de una interacción real.
      try {
        navigator.vibrate(PATTERNS[pattern]);
      } catch {
        /* sin vibración: el cambio visual ya comunica el resultado */
      }
    },
    [supported]
  );

  return { haptic, supported };
}
