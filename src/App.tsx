import React, { useState, useEffect } from 'react';
import { EnergyProvider, useEnergy } from './context/EnergyContext';
import { PublicNavbar } from './components/public/PublicNavbar';
import {
  HeroSection,
  AboutSection,
  ProblemSection,
  SolutionSection,
  HowItWorksSection,
  DashboardPreviewSection,
  WhyQyrenzaSection,
  VisionSection,
  FoundersSection,
  ContactSection,
  PublicFooter,
} from './components/public/LandingSections';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

function MainApp() {
  const { isAuthenticated } = useEnergy();

  // Page routing: 'landing' | 'dashboard'
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('autostart') === '1' || url.searchParams.get('view') === 'dashboard' || window.location.hash.includes('dashboard')) {
        return 'dashboard';
      }
    }
    return 'landing';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>('login');

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('dashboard')) {
        setCurrentPage('dashboard');
      } else if (window.location.hash.includes('login')) {
        setAuthMode('login');
        setAuthModalOpen(true);
      } else if (window.location.hash.includes('signup')) {
        setAuthMode('signup');
        setAuthModalOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAuth = (mode: 'login' | 'signup' | 'forgot-password' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const navigateToDashboard = () => {
    if (!isAuthenticated) {
      openAuth('login');
    } else {
      setCurrentPage('dashboard');
      window.scrollTo(0, 0);
    }
  };

  const navigateToHome = () => {
    setCurrentPage('landing');
    window.scrollTo(0, 0);
  };

  if (currentPage === 'dashboard') {
    return (
      <DashboardLayout
        onNavigateHome={navigateToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* 1. Navigation */}
      <PublicNavbar
        onOpenAuth={openAuth}
        onNavigateToDashboard={navigateToDashboard}
        isAuthenticated={isAuthenticated}
      />

      <main>
        {/* 2. Hero */}
        <HeroSection
          onOpenAuth={openAuth}
          onNavigateToDashboard={navigateToDashboard}
        />

        {/* 3. About Qyrenza Labs */}
        <AboutSection />

        {/* 4. The Problem */}
        <ProblemSection />

        {/* 5. Our Solution */}
        <SolutionSection />

        {/* 6. How It Works */}
        <HowItWorksSection />

        {/* 7. Dashboard Preview */}
        <DashboardPreviewSection
          onOpenAuth={openAuth}
          onNavigateToDashboard={navigateToDashboard}
        />

        {/* 8. Why Qyrenza Labs */}
        <WhyQyrenzaSection />

        {/* 9. Our Vision */}
        <VisionSection />

        {/* 10. Meet Our Founders (NAMA MOUNIKA & MEDAPATI MADHULIKA REDDY) */}
        <FoundersSection />

        {/* 11. Contact (n7282433@gmail.com with working form) */}
        <ContactSection />
      </main>

      {/* 12. Footer */}
      <PublicFooter
        onOpenAuth={openAuth}
        onNavigateToDashboard={navigateToDashboard}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          setCurrentPage('dashboard');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <EnergyProvider>
      <MainApp />
    </EnergyProvider>
  );
}
