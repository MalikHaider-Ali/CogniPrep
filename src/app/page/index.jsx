// src/pages/index.jsx
import { useState } from 'react';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import InterviewSetup from '@/components/InterviewSetup';
import InterviewSession from '@/components/InterviewSession';
import Dashboard from '@/components/Dashboard';
import FeedbackScreen from '@/components/FeedbackScreen';

export default function CogniPrepApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-black text-white">
      {currentPage === 'login' && (
        <Login 
          onLogin={() => setCurrentPage('dashboard')} 
          onSignUp={() => setCurrentPage('signup')} 
        />
      )}
      {currentPage === 'signup' && (
        <SignUp 
          onSuccess={() => setCurrentPage('dashboard')} 
          onLogin={() => setCurrentPage('login')} 
        />
      )}
      {currentPage === 'setup' && (
        <InterviewSetup onNext={() => setCurrentPage('session')} />
      )}
      {currentPage === 'session' && (
        <InterviewSession onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          onStartInterview={() => setCurrentPage('setup')} 
          onViewFeedback={() => setCurrentPage('feedback')} 
        />
      )}
      {currentPage === 'feedback' && (
        <FeedbackScreen onBack={() => setCurrentPage('dashboard')} />
      )}
      
      {/* Development Navigation - Remove in production */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full px-6 py-3 flex gap-2 text-xs z-50">
        {['login', 'signup', 'dashboard', 'setup', 'session', 'feedback'].map(page => (
          <button 
            key={page}
            onClick={() => setCurrentPage(page)} 
            className="px-3 py-1 rounded-full hover:bg-gray-700 capitalize"
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}