'use client'

import React from 'react';
import { Brain, ChevronDown, Upload } from 'lucide-react';

export default function SetupInterview({ setCurrentPage, formData, setFormData }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="w-full max-w-lg bg-black rounded-3xl p-8 border border-gray-800">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">CogniPrep</h1>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Starting Your Interview</h2>
        <p className="text-gray-400 mb-8">Customize your mock interview to suit your needs.</p>

        <div className="space-y-6">
          <div>
            <label className="text-white mb-2 block">What type of interview would you like to practice?</label>
            <div className="relative">
              <select 
                value={formData.interviewType}
                onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl appearance-none cursor-pointer"
              >
                <option>Technical</option>
                <option>Behavioral</option>
                <option>System Design</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-white mb-2 block">What role are you focusing on?</label>
            <input
              type="text"
              placeholder="Select your role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-gray-900 text-white placeholder-gray-400 px-4 py-3 rounded-xl"
            />
          </div>

          <div>
            <label className="text-white mb-2 block">Which tech stack would you like to focus on?</label>
            <input
              type="text"
              placeholder="Select your preferred tech stack"
              value={formData.techStack}
              onChange={(e) => setFormData({...formData, techStack: e.target.value})}
              className="w-full bg-gray-900 text-white placeholder-gray-400 px-4 py-3 rounded-xl"
            />
          </div>

          <div>
            <label className="text-white mb-2 block">How long would you like the interview to be?</label>
            <div className="relative">
              <select 
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl appearance-none cursor-pointer"
              >
                <option>10 minutes</option>
                <option>20 minutes</option>
                <option>30 minutes</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-white mb-2 block">Profile picture</label>
            <button className="w-full bg-gray-900 text-gray-300 px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition">
              <Upload className="w-5 h-5" />
              Upload an image
            </button>
          </div>

          <button 
            onClick={() => setCurrentPage('interview')}
            className="w-full bg-purple-400 hover:bg-purple-300 text-gray-900 py-3 rounded-full font-medium transition"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}