import { Upload } from 'lucide-react';

export default function Login({ onLogin, onSignUp }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-3xl p-8 border border-gray-800">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-900 rounded-full"></div>
          </div>
          <span className="text-xl font-bold">CogniPrep</span>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back!</h1>
        <p className="text-gray-400 mb-8 text-center">Sign in to continue your interview practice</p>

        <div className="space-y-4">
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded bg-gray-800 border-gray-700" />
              <span className="text-gray-400">Remember me</span>
            </label>
            <button className="text-purple-300 hover:text-purple-200">
              Forgot password?
            </button>
          </div>

          <button
            onClick={onLogin}
            className="w-full bg-purple-300 text-gray-900 rounded-xl px-4 py-3 font-semibold hover:bg-purple-200 transition-colors"
          >
            Sign In
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-800 hover:bg-gray-750 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
              <div className="w-5 h-5 bg-white rounded-full"></div>
              <span className="text-sm">Google</span>
            </button>
            <button className="bg-gray-800 hover:bg-gray-750 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <button onClick={onSignUp} className="text-purple-300 hover:text-purple-200 font-semibold">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}