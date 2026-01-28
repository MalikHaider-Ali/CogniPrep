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

// Wrapper to access auth context in page router
function PageContent() {
  const { user, loading, isEmailVerified } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // 👈 Track selected category
  const [sessionData, setSessionData] = useState(null); // 👈 Track session data

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-redirect based on auth state
  useEffect(() => {
    if (!mounted || loading) return;

    if (!user) {
      setCurrentPage('login');
    } else if (!isEmailVerified) {
      setCurrentPage('verify-email');
    }
  }, [user, isEmailVerified, loading, mounted]);

  if (!mounted) return null;

  // 👇 Define pages that should NOT show footer
  const pagesWithoutFooter = ['login', 'signup', 'verify-email'];
  const showFooter = !pagesWithoutFooter.includes(currentPage);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 w-full">
        {currentPage === 'login' && (
          <Login 
            onLogin={(data) => {
              if (data.user?.emailVerified) {
                setCurrentPage('dashboard');
              } else {
                setCurrentPage('verify-email');
              }
            }}
            onSignUp={() => setCurrentPage('signup')} 
          />
        )}
        
        {currentPage === 'signup' && (
          <SignUp 
            onSuccess={() => setCurrentPage('verify-email')}
            onLogin={() => setCurrentPage('login')} 
          />
        )}
        
        {currentPage === 'setup' && (
          <InterviewSetup 
            preSelectedCategory={selectedCategory} // 👈 Pass selected category
            onNext={(data) => {
              setSessionData(data); // 👈 Store session data
              setCurrentPage('session');
            }}
            onBack={() => {
              setSelectedCategory(null); // Clear selection when going back
              setCurrentPage('dashboard');
            }}
          />
        )}
        
        {currentPage === 'session' && (
          <InterviewSession 
            sessionData={sessionData} // 👈 Pass session data
            onComplete={() => setCurrentPage('feedback')} 
            onBack={() => setCurrentPage('setup')} 
          />
        )}
        
        {currentPage === 'dashboard' && (
          <Dashboard 
            onStartInterview={(category = null) => { // 👈 Accept optional category parameter
              setSelectedCategory(category); // 👈 Store selected category (null or specific)
              setCurrentPage('setup');
            }}
            onViewFeedback={() => setCurrentPage('feedback')}
            onLogout={() => {
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
        
        {currentPage === 'verify-email' && <VerifyEmail />}
      </main>

      {/* 👇 Only show footer on authenticated pages */}
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