'use client'

import React from 'react';
import { Brain, Settings, MessageCircle, Loader2 } from 'lucide-react';

export default function InterviewPage({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">CogniPrep</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden">
            <img src="/api/placeholder/48/48" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍💻</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Frontend Developer Interview</h2>
            <Settings className="w-6 h-6 text-gray-400" />
          </div>
          <span className="bg-gray-900 text-gray-300 px-4 py-2 rounded-full text-sm">
            Technical Interview
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-black rounded-3xl p-8 border-2 border-purple-500 flex flex-col items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">AI Interviewer</h3>
          </div>

          <div className="bg-black rounded-3xl p-8 border border-gray-800 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden mb-4">
              <img src="/api/placeholder/128/128" alt="Adrian" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-white">Adrian (You)</h3>
          </div>
        </div>

        <div className="bg-black rounded-2xl p-6 mb-6">
          <p className="text-white text-lg text-center">
            What is the <span className="bg-gray-900 px-3 py-1 rounded">Virtual Dom</span> in React.js and how does it work?
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full flex items-center gap-2 transition">
            <Loader2 className="w-5 h-5" />
            Repeat
          </button>
          <button 
            onClick={() => setCurrentPage('feedback')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full flex items-center gap-2 transition"
          >
            Leave interview
          </button>
        </div>
      </div>
    </div>
  );
}