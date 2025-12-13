import Header from 'lucide-react';
import { Settings, Repeat, X } from 'lucide-react';

export default function InterviewSession({ onBack }) {
  return (
    <div className="min-h-screen">
      <Header showProfile={true} />
      
      <div className="px-8 py-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          <h1 className="text-2xl font-bold">Frontend Developer Interview</h1>
          <div className="flex gap-2 ml-auto">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="bg-gray-800 px-4 py-2 rounded-lg text-sm">Technical Interview</span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-indigo-950 to-purple-950 rounded-3xl p-8 aspect-video flex items-center justify-center border-2 border-purple-400">
            <div className="text-center">
              <div className="w-32 h-32 bg-purple-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-24 h-24 bg-purple-400 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-purple-300 rounded-full"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold">AI Interviewer</h3>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl overflow-hidden aspect-video relative">
            <img src="/assets/placeholder.png" alt="Adrian" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">Adrian (You)</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <p className="text-center">
            What job <span className="bg-gray-800 px-2 py-1 rounded">experience level</span> are you targeting?
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl flex items-center gap-2">
            <Repeat className="w-5 h-5" />
            Repeat
          </button>
          <button onClick={onBack} className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl flex items-center gap-2">
            <X className="w-5 h-5" />
            Leave interview
          </button>
        </div>
      </div>
    </div>
  );
}