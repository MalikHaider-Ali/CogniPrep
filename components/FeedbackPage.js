'use client'

import React from 'react';
import { Brain, Star, Calendar } from 'lucide-react';

export default function FeedbackPage({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
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

        <div className="bg-black rounded-3xl p-8 border border-gray-800">
          <h2 className="text-3xl font-bold text-white mb-4">
            Feedback on the Interview – Frontend Developer Interview
          </h2>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-white">Overall Impression: <span className="font-bold">12/100</span></span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-5 h-5" />
              Feb 28, 2025 - 3:45 PM
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 mb-8">
            <p className="text-gray-300">
              This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissive, vague, or outright negative, making it difficult to assess their qualifications, motivation, or suitability for the role.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-white mb-6">Breakdown of Evaluation:</h3>

          <div className="space-y-6 mb-8">
            <div>
              <h4 className="text-xl font-semibold text-white mb-3">1. Enthusiasm & Interest (0/20)</h4>
              <ul className="space-y-2 text-gray-300 ml-6">
                <li className="list-disc">The candidate openly states, "I really don't," when asked why they want to work for the company.</li>
                <li className="list-disc">Their response to future career plans ("Probably in some other company") indicates a lack of commitment.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-white mb-3">2. Communication Skills (5/20)</h4>
              <ul className="space-y-2 text-gray-300 ml-6">
                <li className="list-disc">Responses are brief and unhelpful.</li>
                <li className="list-disc">Some answers lack clarity (e.g., "What am I going to do in this role at this role?").</li>
                <li className="list-disc">A slight redeeming factor is that they remain polite.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-white mb-3">3. Self-Awareness & Reflection (2/20)</h4>
              <ul className="space-y-2 text-gray-300 ml-6">
                <li className="list-disc">The candidate refuses to discuss their background and weaknesses.</li>
                <li className="list-disc">They claim to have "no weaknesses at all," which suggests a lack of self-awareness.</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-500 rounded-2xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              Final Verdict: <span className="text-red-500">Not Recommended</span>
            </h3>
            <p className="text-gray-300">
              This candidate does not appear to be seriously considering the role and fails to provide meaningful responses. If this is reflective of their true attitude, they would not be a good fit for most positions.
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-full font-medium transition"
            >
              Back to dashboard
            </button>
            <button 
              onClick={() => setCurrentPage('setup')}
              className="flex-1 bg-purple-400 hover:bg-purple-300 text-gray-900 py-3 rounded-full font-medium transition"
            >
              Retake interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}