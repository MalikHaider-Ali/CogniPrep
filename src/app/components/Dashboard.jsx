"use client";

import { useState } from 'react';
import Header from './header';
import { getAllCategories, getCategoryByTitle } from '../config/interviewCategories';

export default function Dashboard({ onStartInterview, onViewFeedback, onLogout, onNavigateToProfile  }) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Example past interviews - these would come from your database
  // The 'category' field should match the title in INTERVIEW_CATEGORIES
  const pastInterviews = [
    { 
      category: 'Frontend Developer Interview', 
      date: 'Feb 28, 2025', 
      score: '12/100',
      id: '1' // You'll have actual IDs from database
    },
    { 
      category: 'Behavioral Interview', 
      date: 'Feb 23, 2025', 
      score: '54/100',
      id: '2'
    },
    { 
      category: 'Backend Developer Interview', 
      date: 'Feb 21, 2025', 
      score: '94/100',
      id: '3'
    }
  ];

  // Get all interview categories from centralized config
  const allInterviewTypes = getAllCategories();
  const displayedInterviews = showAllCategories ? allInterviewTypes : allInterviewTypes.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-950 w-full">
      <Header showProfile={true} onNavigateToProfile={onNavigateToProfile} />
      
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-screen-2xl mx-auto">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#1A1C20] to-[#08090D] rounded-3xl p-8 md:p-12 lg:p-16 mb-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
            <div className="max-w-2xl mb-8 lg:mb-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight text-white">
                Get Interview-Ready with AI-Powered Practice & Feedback
              </h1>
              <p className="text-gray-300 mb-6 lg:mb-8 text-lg">
                Practice real interview questions & get instant feedback. Master your skills with personalized AI coaching.
              </p>
              <button 
                onClick={() => onStartInterview(null)}
                className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:scale-105 hover:bg-purple-700"
              >
                Start an interview
              </button>
            </div>
            
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-purple-500/10 blur-2xl rounded-full"></div>
                <img 
                  src="/interview-hero.png" 
                  alt="AI Interview Practice" 
                  className="relative w-full h-auto rounded-2xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Past Interviews Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Your Past Interviews</h2>
            <button className="text-purple-400 hover:text-purple-500 font-medium transition-colors">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {pastInterviews.map((interview) => {
              // Get category data from centralized config
              const categoryData = getCategoryByTitle(interview.category);
              
              if (!categoryData) return null; // Skip if category not found
              
              return (
                <div 
                  key={interview.id}
                  className="relative bg-gradient-to-b from-[#1A1C2A] to-[#242633] rounded-3xl p-8 border border-transparent hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 ${categoryData.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {categoryData.icon}
                    </div>
                    <span className="bg-gray-800/50 px-4 py-2 rounded-lg text-sm text-gray-300 border border-gray-700">
                      {categoryData.type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-white">
                    {categoryData.shortTitle}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-base text-gray-400 mb-6">
                    <span className="flex items-center gap-2">📅 <strong>{interview.date}</strong></span>
                    <span className="flex items-center gap-2">⭐ <strong>{interview.score}</strong></span>
                  </div>
                  
                  <p className="text-base text-gray-400 mb-8 leading-relaxed line-clamp-2">
                    {categoryData.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {/* Tech icons from centralized config */}
                    {categoryData.techs && categoryData.techs.length > 0 ? (
                      <div className="flex gap-3">
                        {categoryData.techs.map((tech, techIdx) => (
                          <div 
                            key={techIdx}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-1"
                            style={{ 
                              backgroundColor: tech.color,
                              transitionDelay: `${techIdx * 75}ms` 
                            }}
                            title={tech.name}
                          >
                            <tech.icon className="w-5 h-5 text-white" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-10 h-10"></div>
                    )}
                    
                    <button 
                      onClick={onViewFeedback} 
                      className="bg-purple-600 text-white px-6 py-3 rounded-full text-sm lg:text-base font-semibold hover:bg-purple-700 transition-all duration-200 hover:scale-105"
                    >
                      View interview
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pick Your Interview Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              Pick Your Interview
              <span className="text-sm font-normal text-gray-400 ml-3">
                ({displayedInterviews.length} of {allInterviewTypes.length})
              </span>
            </h2>
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-purple-400 hover:text-purple-500 font-medium transition-colors flex items-center gap-2"
            >
              {showAllCategories ? (
                <>
                  Show less
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  See all categories
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayedInterviews.map((interview, idx) => (
              <div 
                key={idx} 
                className="relative bg-gradient-to-b from-[#1A1C2A] to-[#242633] rounded-3xl p-8 border border-[#242633] transition-all duration-200 hover:scale-[1.02] group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 ${interview.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {interview.icon}
                  </div>
                  <span className="bg-gray-800/50 px-4 py-2 rounded-lg text-sm text-gray-300 border border-gray-700">
                    {interview.type}
                  </span>
                </div>
                
                <h3 className="text-xl lg:text-2xl font-semibold mb-3 text-white  transition-colors">
                  {interview.title}
                </h3>
                
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  {interview.description}
                </p>
                
                <div className="flex items-center justify-between">
                  {interview.techs && interview.techs.length > 0 ? (
                    <div className="flex gap-2">
                      {interview.techs.map((tech, techIdx) => (
                        <div 
                          key={techIdx}
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: tech.color }}
                          title={tech.name}
                        >
                          <tech.icon className="w-5 h-5 text-white" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-10 h-10"></div>
                  )}
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartInterview(interview.title);
                    }}
                    className="bg-purple-600 text-white px-6 py-3 rounded-full text-sm lg:text-base font-semibold  transition-all duration-200 hover:scale-105"
                  >
                    Start Interview
                  </button>
                </div>
              </div>
            ))}
          </div>

          {allInterviewTypes.length > 6 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                {showAllCategories ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Show Less Categories
                  </>
                ) : (
                  <>
                    See All {allInterviewTypes.length} Categories
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}