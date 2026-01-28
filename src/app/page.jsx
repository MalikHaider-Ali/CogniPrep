"use client";

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../app/contexts/AuthContext';
import Login from '@/app/components/Login';
import SignUp from '@/app/components/SignUp';
import InterviewSetup from '@/app/components/InterviewSetup';
import InterviewSession from '@/app/components/InterviewSession';
import Dashboard from '@/app/components/Dashboard';
import FeedbackScreen from '@/app/components/FeedbackScreen';
import ProfileSettings from '@/app/components/ProfileSettings';
import VerifyEmail from '@/app/components/VerifyEmail';
import Footer from '@/app/components/Footer';
import { Loader2 } from 'lucide-react';

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex items-center gap-2 justify-center mb-4">
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
          <span className="text-2xl font-bold text-white">CogniPrep</span>
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
        
      </div>
    </div>
  );
}

// Wrapper to access auth context in page router
function PageContent() {
  const { user, loading, isEmailVerified, initialCheckComplete } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-redirect based on auth state
  useEffect(() => {
    if (!mounted || !initialCheckComplete) return;

    console.log('📍 Page navigation check:', { 
      user: user?.email, 
      emailVerified: user?.emailVerified,
      currentPage 
    });

    // Redirect logic based on auth state
    if (!user) {
      // User not logged in - show login
      if (currentPage !== 'login' && currentPage !== 'signup') {
        console.log('👉 Redirecting to login (no user)');
        setCurrentPage('login');
      }
    } else if (!isEmailVerified) {
      // User logged in but email not verified
      if (currentPage !== 'verify-email') {
        console.log('👉 Redirecting to verify-email (unverified)');
        setCurrentPage('verify-email');
      }
    } else {
      // User logged in and verified
      if (currentPage === 'login' || currentPage === 'signup' || currentPage === 'verify-email') {
        console.log('👉 Redirecting to dashboard (authenticated)');
        setCurrentPage('dashboard');
      }
    }
  }, [user, isEmailVerified, mounted, initialCheckComplete]);

  // Show loading screen during initial auth check
  if (!mounted || loading || !initialCheckComplete) {
    return <LoadingScreen />;
  }

  // Pages that should NOT show footer
  const pagesWithoutFooter = ['login', 'signup', 'verify-email'];
  const showFooter = !pagesWithoutFooter.includes(currentPage);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 w-full">
        {currentPage === 'login' && (
          <Login 
            onLogin={() => {
              // Don't manually set page - let auth state handle it
              console.log('✅ Login successful - auth state will handle navigation');
            }}
            onSignUp={() => setCurrentPage('signup')} 
          />
        )}
        
        {currentPage === 'signup' && (
          <SignUp 
            onSuccess={() => {
              // Don't manually set page - let auth state handle it
              console.log('✅ Signup successful - auth state will handle navigation');
            }}
            onLogin={() => setCurrentPage('login')} 
          />
        )}
        
        {currentPage === 'setup' && (
          <InterviewSetup 
            preSelectedCategory={selectedCategory}
            onNext={(data) => {
              setSessionData(data);
              setCurrentPage('session');
            }}
            onBack={() => {
              setSelectedCategory(null);
              setCurrentPage('dashboard');
            }}
          />
        )}
        
        {currentPage === 'session' && (
          <InterviewSession 
            sessionData={sessionData}
            onComplete={() => setCurrentPage('feedback')} 
            onBack={() => setCurrentPage('setup')} 
          />
        )}
        
        {currentPage === 'dashboard' && (
          <Dashboard 
            onStartInterview={(category = null) => {
              setSelectedCategory(category);
              setCurrentPage('setup');
            }}
            onViewFeedback={() => setCurrentPage('feedback')}
            onLogout={() => {
              // Let auth context handle the actual logout
              setCurrentPage('login');
            }}
            onNavigateToProfile={() => setCurrentPage('profile')}
          />
        )}
        
        {currentPage === 'feedback' && (
          <FeedbackScreen 
            onBack={() => setCurrentPage('dashboard')} 
          />
        )}
        
        {currentPage === 'profile' && (
          <ProfileSettings 
            onBack={() => setCurrentPage('dashboard')} 
          />
        )}
        
        {currentPage === 'verify-email' && (
          <VerifyEmail 
            onVerified={() => {
              // Let auth state handle navigation after verification
              console.log('✅ Email verified - auth state will handle navigation');
            }}
          />
        )}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

export default function CogniPrepApp() {
  return (
    <AuthProvider>
      <PageContent />
    </AuthProvider>
  );
}