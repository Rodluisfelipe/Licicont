import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import LandingPage from '@/pages/LandingPage';
import AccesoPage from '@/pages/AccesoPage';
import ForbiddenPage from '@/pages/ForbiddenPage';

export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.07, duration: 1.2, smoothWheel: true }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/acceso/:codigo" element={<AccesoPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ReactLenis>
  );
}
