'use client'

import React from 'react';
import { Star, Calendar, Code2, Database, MessageCircle, Layers, Cloud, Smartphone, BarChart3, Shield, TrendingUp, Layout } from 'lucide-react';
import Header from './Header';

export default function Dashboard({ setCurrentPage }) {
  const renderIcon = (iconName) => {
    const iconProps = { className: "w-8 h-8 text-white" };
    switch(iconName) {
      case 'code': return <Code2 {...iconProps} />;
      case 'layers': return <Layers {...iconProps} />;
      case 'cloud': return <Cloud {...iconProps} />;
      case 'smartphone': return <Smartphone {...iconProps} />;
      case 'chart': return <BarChart3 {...iconProps} />;
      case 'database': return <Database {...iconProps} />;
      case 'shield': return <Shield {...iconProps} />;
      case 'trending': return <TrendingUp {...iconProps} />;
      case 'layout': return <Layout {...iconProps} />;
      case 'users': return <MessageCircle {...iconProps} />;
      default: return <Code2 {...iconProps} />;
    }
  };

  const pastInterviews = [
    {
      id: 1,
      title: 'Frontend Dev Interview',
      type: 'Technical',
      date: 'Feb 28, 2025',
      score: '12/100',
      icon: 'code',
      color: 'bg-purple-600'
    },
    {
      id: 2,
      title: 'Behavioral Interview',
      type: 'Non-Technical',
      date: 'Feb 23, 2025',
      score: '54/100',
      icon: 'users',
      color: 'bg-blue-600'
    },
    {
      id: 3,
      title: 'Backend Dev Interview',
      type: 'Technical',
      date: 'Feb 21, 2025',
      score: '94/100',
      icon: 'database',
      color: 'bg-red-600'
    }
  ];

  const availableInterviews = [
    { title: 'Full-Stack Dev Interview', type: 'Technical', icon: 'layers', color: 'bg-purple-600' },
    { title: 'DevOps & Cloud Interview', type: 'Technical', icon: 'cloud', color: 'bg-orange-600' },
    { title: 'HR Screening Interview', type: 'Non-Technical', icon: 'users', color: 'bg-blue-400' },
    { title: 'System Design Interview', type: 'Technical', icon: 'layout', color: 'bg-blue-600' },
    { title: 'Business Analyst Interview', type: 'Non-Technical', icon: 'chart', color: 'bg-green-600' },
    { title: 'Mobile App Dev Interview', type: 'Technical', icon: 'smartphone', color: 'bg-red-600' },
    { title: 'Database & SQL Interview', type: 'Technical', icon: 'database', color: 'bg-red-600' },
    { title: 'Cybersecurity Interview', type: 'Technical', icon: 'shield', color: 'bg-blue-500' },
    { title: 'Sales & Marketing Intervi...', type: 'Non-Technical', icon: 'trending', color: 'bg-gray-800' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-12 mb-12 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold text-white mb-4">
                Get Interview-Ready with AI-Powered Practice & Feedback
              </h2>
              <p className="text-purple-200 mb-6">
                Practice real interview questions & get instant feedback.
              </p>
              <button 
                onClick={() => setCurrentPage('setup')}
                className="bg-purple-400 hover:bg-purple-300 text-gray-900 px-6 py-3 rounded-full font-medium transition"
              >
                Start an Interview
              </button>
            </div>
            <div className="relative">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <div className="text-6xl">🤖</div>
              </div>
            </div>
          </div>
        </div>

        {/* Past Interviews */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Your Past Interviews</h3>
          <div className="grid grid-cols-3 gap-6">
            {pastInterviews.map((interview) => (
              <div key={interview.id} className="bg-black rounded-2xl p-6 border border-gray-800 hover:border-purple-500 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${interview.color} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                    {renderIcon(interview.icon)}
                  </div>
                  <span className="bg-gray-900 text-gray-300 px-3 py-1 rounded-full text-xs">
                    {interview.type}
                  </span>
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">{interview.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {interview.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {interview.score}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissiv...
                </p>
                <button 
                  onClick={() => setCurrentPage('feedback')}
                  className="w-full bg-purple-400 hover:bg-purple-300 text-gray-900 py-2 rounded-full font-medium transition"
                >
                  View Interview
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available Interviews */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Pick Your Interview</h3>
          <div className="grid grid-cols-3 gap-6">
            {availableInterviews.map((interview, idx) => (
              <div key={idx} className="bg-black rounded-2xl p-6 border border-gray-800 hover:border-purple-500 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${interview.color} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                    {renderIcon(interview.icon)}
                  </div>
                  <span className="bg-gray-900 text-gray-300 px-3 py-1 rounded-full text-xs">
                    {interview.type}
                  </span>
                </div>
                <h4 className="text-white font-semibold text-lg mb-4">{interview.title}</h4>
                <p className="text-gray-400 text-sm mb-4">
                  This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissiv...
                </p>
                <button 
                  onClick={() => setCurrentPage('setup')}
                  className="w-full bg-purple-400 hover:bg-purple-300 text-gray-900 py-2 rounded-full font-medium transition"
                >
                  Take Interview
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}