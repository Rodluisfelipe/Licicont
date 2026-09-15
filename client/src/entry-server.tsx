import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';

/**
 * Punto de entrada del prerenderizado.
 *
 * La landing se renderiza a HTML en tiempo de compilación para que los
 * rastreadores que no ejecutan JavaScript —buscadores y asistentes de IA— vean
 * el contenido. Se monta solo la landing, sin el enrutador de la aplicación ni
 * el scroll suave, porque el resto de rutas son privadas y no deben indexarse.
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <LandingPage />
      </StaticRouter>
    </StrictMode>
  );
}
