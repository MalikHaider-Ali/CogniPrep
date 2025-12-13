'use client'

import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import SetupInterview from '@/components/SetupInterview';
import InterviewPage from '@/components/InterviewPage';
import FeedbackPage from '@/components/FeedbackPage';
import SignupPage from '@/components/SignupPage';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [formData, setFormData] = useState({
    interviewType: 'Technical',
    role: '',
    techStack: '',
    duration: '10 minutes',
    fullName: 'Adrian Hajdin',
    email: 'adrian@jsmastery.pro',
    password: ''
  });

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'setup':
        return <SetupInterview setCurrentPage={setCurrentPage} formData={formData} setFormData={setFormData} />;
      case 'interview':
        return <InterviewPage setCurrentPage={setCurrentPage} />;
      case 'feedback':
        return <FeedbackPage setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} formData={formData} setFormData={setFormData} />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div>
      {renderPage()}
      
      {/* Development Navigation */}
      <div className="fixed bottom-4 right-4 bg-black border border-gray-800 rounded-lg p-4 shadow-lg z-50">
        <p className="text-white text-sm mb-2 font-semibold">Navigate Pages:</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => setCurrentPage('signup')} className="text-purple-400 hover:text-purple-300 text-sm text-left">Signup</button>
          <button onClick={() => setCurrentPage('dashboard')} className="text-purple-400 hover:text-purple-300 text-sm text-left">Dashboard</button>
          <button onClick={() => setCurrentPage('setup')} className="text-purple-400 hover:text-purple-300 text-sm text-left">Setup</button>
          <button onClick={() => setCurrentPage('interview')} className="text-purple-400 hover:text-purple-300 text-sm text-left">Interview</button>
          <button onClick={() => setCurrentPage('feedback')} className="text-purple-400 hover:text-purple-300 text-sm text-left">Feedback</button>
        </div>
      </div>
    </div>
  );
}