'use client'

import React from 'react';
import { Brain, Upload } from 'lucide-react';

export default function SignupPage({ setCurrentPage, formData, setFormData }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="w-full max-w-lg bg-black rounded-3xl p-8 border border-gray-800">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">CogniPrep</h1>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 text-center">Practice job interviews with AI</h2>

        <div className="space-y-6 mt-8">
          <div>
            <label className="text-white mb-2 block">Full name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl"
            />
          </div>

          <div>
            <label className="text-white mb-2 block">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl"
            />
          </div>

          <div>
            <label className="text-white mb-2 block">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-gray-900 text-white placeholder-gray-400 px-4 py-3 rounded-xl"
            />
          </div>

          <div>
            <label className="text-white mb-2 block">Profile picture</label>
            <button className="w-full bg-gray-900 text-gray-300 px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition">
              <Upload className="w-5 h-5" />
              Upload an image
            </button>
          </div>

          <div>
            <label className="text-white mb-2 block">Resume</label>
            <button className="w-full bg-gray-900 text-gray-300 px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition">
              <Upload className="w-5 h-5" />
              Upload a pdf
            </button>
          </div>

          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="w-full bg-purple-400 hover:bg-purple-300 text-gray-900 py-3 rounded-full font-medium transition"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}