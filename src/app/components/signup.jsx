import { Upload } from 'lucide-react';

export default function SignUp({ onSuccess, onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-3xl p-8 border border-gray-800">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-900 rounded-full"></div>
          </div>
          <span className="text-xl font-bold">CogniPrep</span>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center">Practice job interviews with AI</h1>

        <div className="space-y-4 mt-8">
          <div>
            <label className="block text-sm mb-2">Full name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-gray-800 rounded-xl px-4 py-3 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-gray-800 rounded-xl px-4 py-3 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full bg-gray-800 rounded-xl px-4 py-3 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Profile picture</label>
            <button className="w-full bg-gray-800 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-750">
              <Upload className="w-5 h-5" />
              <span>Upload an image</span>
            </button>
          </div>

          <div>
            <label className="block text-sm mb-2">Resume</label>
            <button className="w-full bg-gray-800 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-750">
              <Upload className="w-5 h-5" />
              <span>Upload a pdf</span>
            </button>
          </div>

          <button
            onClick={onSuccess}
            className="w-full bg-purple-300 text-gray-900 rounded-xl px-4 py-3 font-semibold hover:bg-purple-200 transition-colors mt-6"
          >
            Create an account
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{' '}
            <button onClick={onLogin} className="text-purple-300 hover:text-purple-200 font-semibold">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}