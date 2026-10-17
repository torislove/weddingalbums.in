import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppShell from './layout/AppShell';
import ErrorBoundary from './components/ErrorBoundary';

/* ── App ─────────────────────────────────────────────────────────────
 * Thin composer: providers + shell. Layout lives in layout/, the
 * overview page in pages/Dashboard.jsx, auth in context/AuthContext.jsx. */
function App() {
  return (
    <ErrorBoundary label="Ops Center" accent="#0ea5e9">
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
