import React from 'react';
import { Brain } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex items-center justify-between mb-12">
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
  );
}