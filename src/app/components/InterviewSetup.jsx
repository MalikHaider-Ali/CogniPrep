import { ChevronDown, Upload } from 'lucide-react';

export default function InterviewSetup({ onNext }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-3xl p-8 border border-gray-800">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-900 rounded-full"></div>
          </div>
          <span className="text-xl font-bold">CogniPrep</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">Starting Your Interview</h1>
        <p className="text-gray-400 mb-8">Customize your mock interview to suit your needs.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">What type of interview would you like to practice?</label>
            <div className="relative">
              <select className="w-full bg-gray-800 rounded-xl px-4 py-3 appearance-none cursor-pointer pr-10">
                <option>Technical</option>
                <option>Behavioral</option>
                <option>System Design</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">What role are you focusing on?</label>
            <input
              type="text"
              placeholder="Select your role"
              className="w-full bg-gray-800 rounded-xl px-4 py-3 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Which tech stack would you like to focus on?</label>
            <input
              type="text"
              placeholder="Select your preferred tech stack"
              className="w-full bg-gray-800 rounded-xl px-4 py-3 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">How long would you like the interview to be?</label>
            <div className="relative">
              <select className="w-full bg-gray-800 rounded-xl px-4 py-3 appearance-none cursor-pointer pr-10">
                <option>10 minutes</option>
                <option>20 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Profile picture</label>
            <button className="w-full bg-gray-800 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-750">
              <Upload className="w-5 h-5" />
              <span>Upload an image</span>
            </button>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-purple-300 text-gray-900 rounded-xl px-4 py-3 font-semibold hover:bg-purple-200 transition-colors"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}