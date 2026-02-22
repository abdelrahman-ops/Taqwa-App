import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout.tsx';

const Home = lazy(() => import('./pages/Home.tsx'));
const Quran = lazy(() => import('./pages/Quran.tsx'));
const Prayers = lazy(() => import('./pages/Prayers.tsx'));
const Progress = lazy(() => import('./pages/Progress.tsx'));
const Settings = lazy(() => import('./pages/Settings.tsx'));
const Onboarding = lazy(() => import('./pages/Onboarding.tsx'));
const Azkar = lazy(() => import('./pages/Azkar.tsx'));
const Auth = lazy(() => import('./pages/Auth.tsx'));

/** Scrolls to top whenever the route path changes. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const { isOnboarded, isAuthenticated, isGuestMode, loading } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-gray-50 dark:bg-gray-950">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated && !isGuestMode) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-dvh"><div className="w-8 h-8 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" /></div>}>
        <Auth />
      </Suspense>
    );
  }

  if (!isOnboarded) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-dvh"><div className="w-8 h-8 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" /></div>}>
        <Onboarding />
      </Suspense>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/prayers" element={<Prayers />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/azkar" element={<Azkar />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}
