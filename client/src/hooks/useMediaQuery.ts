import { useCallback, useSyncExternalStore } from 'react';

/**
 * Consulta de medios reactiva.
 *
 * Usa useSyncExternalStore, que es la API de React para leer de una fuente
 * externa: no hay estado duplicado ni efecto que sincronizar.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // En servidor se asume la versión compacta.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Atajo para el corte de escritorio del sistema (lg). */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
