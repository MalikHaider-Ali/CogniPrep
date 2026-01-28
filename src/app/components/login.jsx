import { useState } from 'react';
import { Loader2, Eye, EyeOff, AlertTriangle, Info } from 'lucide-react';
import { 
  loginWithEmail, 
  signInWithGoogle, 
  signInWithGitHub,
  resetPassword 
} from '../firebase/authService';

export default function Login({ onLogin, onSignUp }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('error'); // 'error', 'warning', 'info'
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [existingMethods, setExistingMethods] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) {
      setError('');
      setExistingMethods(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExistingMethods(null);
    setLoading(true);
    
    const result = await loginWithEmail(formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      if (onLogin) {
        onLogin({ user: result.user });
      }
    } else {
      setError(result.error);
      setErrorType('error');
      
      // If email not verified, change error type to warning
      if (result.errorCode === 'auth/email-not-verified') {
        setErrorType('warning');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    
    setError('');
    setExistingMethods(null);
    setLoading(true);
    
    const result = await signInWithGoogle();
    setLoading(false);
    
    if (result.success) {
      if (onLogin) {
        onLogin({ user: result.user });
      }
    } else {
      setError(result.error);
      setErrorType('warning');
      
      // Store existing methods if account exists with different credential
      if (result.existingMethods) {
        setExistingMethods(result.existingMethods);
      }
    }
  };

  const handleGitHubSignIn = async () => {
    if (loading) return;
    
    setError('');
    setExistingMethods(null);
    setLoading(true);
    
    const result = await signInWithGitHub();
    setLoading(false);
    
    if (result.success) {
      if (onLogin) {
        onLogin({ user: result.user });
      }
    } else {
      setError(result.error);
      setErrorType('warning');
      
      // Store existing methods if account exists with different credential
      if (result.existingMethods) {
        setExistingMethods(result.existingMethods);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      setErrorType('error');
      return;
    }
    
    setLoading(true);
    const result = await resetPassword(formData.email);
    setLoading(false);
    
    if (result.success) {
      setResetSent(true);
      setError('');
    } else {
      setError(result.error);
      setErrorType('error');
    }
  };

  // Helper to render error/warning/info messages
  const renderAlert = () => {
    if (!error && !resetSent) return null;

    const alertStyles = {
      error: {
        bg: 'bg-red-900/20',
        border: 'border-red-800',
        text: 'text-red-300',
        icon: <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      },
      warning: {
        bg: 'bg-yellow-900/20',
        border: 'border-yellow-800',
        text: 'text-yellow-300',
        icon: <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      },
      info: {
        bg: 'bg-blue-900/20',
        border: 'border-blue-800',
        text: 'text-blue-300',
        icon: <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
      },
      success: {
        bg: 'bg-green-900/20',
        border: 'border-green-800',
        text: 'text-green-300',
        icon: <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
      }
    };

    const style = resetSent ? alertStyles.success : alertStyles[errorType];

    return (
      <div className={`p-4 ${style.bg} border ${style.border} rounded-2xl ${style.text} text-sm flex gap-3`}>
        {style.icon}
        <div className="flex-1">
          {resetSent ? (
            <>
              <p className="font-semibold mb-1">Email Sent!</p>
              <p>Password reset email sent! Check your inbox and spam folder.</p>
            </>
          ) : (
            <>
              <p className="font-semibold mb-1">
                {errorType === 'error' ? 'Error' : errorType === 'warning' ? 'Sign-In Issue' : 'Information'}
              </p>
              <p>{error}</p>
              
              {/* Show helpful tips for common errors */}
              {existingMethods && (
                <div className="mt-3 p-3 bg-black/20 rounded-lg">
                  <p className="text-xs font-semibold mb-2">How to fix this:</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    {existingMethods.includes('password') && (
                      <li>Sign in using Email/Password above</li>
                    )}
                    {existingMethods.some(m => m.includes('google')) && (
                      <li>Sign in using the Google button</li>
                    )}
                    {existingMethods.some(m => m.includes('github')) && (
                      <li>Sign in using the GitHub button</li>
                    )}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const SocialButton = ({ provider, onClick, disabled }) => {
    const config = {
      google: {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )
      },
      github: {
        icon: (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        )
      }
    };

    const { icon } = config[provider];

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center 
                   transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        ) : (
          icon
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-950">
      <div className="w-full grid lg:grid-cols-2">
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center bg-gray-950 px-8 py-12 lg:px-16">
          <div className="max-w-md mx-auto w-full space-y-8">
            
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-xl font-bold text-white">CogniPrep</span>
            </div>
            
            {!showReset ? (
              <>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-white">Welcome Back!</h1>
                  <p className="text-gray-400 text-sm">Sign in to continue your interview practice</p>
                </div>

                {renderAlert()}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full bg-gray-900 border-0 rounded-2xl px-5 py-4 text-white placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-purple-500
                               disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full bg-gray-900 border-0 rounded-2xl px-5 py-4 pr-12 text-white placeholder-gray-500
                                 focus:outline-none focus:ring-2 focus:ring-purple-500
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button 
                      type="button"
                      onClick={() => setShowReset(true)}
                      className="text-sm text-gray-400 hover:text-purple-400 transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white rounded-2xl px-6 py-4 
                             font-semibold hover:bg-purple-700 transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <div className="space-y-4">
                  <div className="text-center text-sm text-gray-400">
                    Or continue with
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <SocialButton 
                      provider="google"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    />
                    <SocialButton 
                      provider="github"
                      onClick={handleGitHubSignIn}
                      disabled={loading}
                    />
                  </div>
                </div>

                <p className="text-center text-sm text-gray-400">
                  Don't have an account?{' '}
                  <button 
                    onClick={onSignUp} 
                    className="text-purple-400 hover:text-purple-300 font-semibold
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={loading}
                  >
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                  <p className="text-gray-400 text-sm">
                    Enter your email address and we'll send you a password reset link.
                  </p>
                </div>

                {renderAlert()}
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full bg-gray-900 border-0 rounded-2xl px-5 py-4 text-white placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-purple-500
                             disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handlePasswordReset}
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white rounded-2xl px-6 py-4 
                             font-semibold hover:bg-purple-700 transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowReset(false);
                      setResetSent(false);
                      setError('');
                    }}
                    disabled={loading}
                    className="flex-1 bg-gray-900 text-white rounded-2xl px-6 py-4 
                             font-semibold hover:bg-gray-800 transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block relative bg-black">
          <img 
            src="/login.png" 
            alt="Interview Practice" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white z-10">
          </div>
        </div>
      </div>
    </div>
  );
}