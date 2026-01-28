import { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { 
  registerWithEmail
} from '../firebase/authService';
import { 
  uploadFileToSupabase, 
  BUCKETS 
} from '../lib/supabase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { supabase } from '../lib/supabase';

export default function SignUp({ onSuccess, onLogin }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [showPasswordConditions, setShowPasswordConditions] = useState(false);
  
  const profileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Validate password strength
  useEffect(() => {
    if (formData.password) {
      const strength = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)
      };
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fullName') {
      const regex = /^[A-Za-z\s'-]*$/;
      if (!regex.test(value)) return;
      if (value.length > 50) return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Full Name Validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
      isValid = false;
    } else if (!/^[A-Za-z\s'-]+$/.test(formData.fullName.trim())) {
      errors.fullName = 'Full name can only contain letters, spaces, apostrophes, and hyphens';
      isValid = false;
    } else if (formData.fullName.trim().length > 50) {
      errors.fullName = 'Full name must be less than 50 characters';
      isValid = false;
    }

    // Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address (e.g., name@example.com)';
      isValid = false;
    } else if (formData.email.length > 254) {
      errors.email = 'Email must be less than 255 characters';
      isValid = false;
    }

    // Password Validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else {
      if (!passwordStrength.length) {
        errors.password = 'Password must be at least 8 characters';
        isValid = false;
      } else if (!passwordStrength.uppercase) {
        errors.password = 'Password must contain at least one uppercase letter';
        isValid = false;
      } else if (!passwordStrength.lowercase) {
        errors.password = 'Password must contain at least one lowercase letter';
        isValid = false;
      } else if (!passwordStrength.number) {
        errors.password = 'Password must contain at least one number';
        isValid = false;
      } else if (!passwordStrength.special) {
        errors.password = 'Password must contain at least one special character';
        isValid = false;
      }
    }

    // Confirm Password Validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, GIF, etc.)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setProfileImage(file);
    setProfileImageUrl(URL.createObjectURL(file));
    setError('');
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('Resume size should be less than 10MB');
      return;
    }
    
    setResumeFile(file);
    setResumeUrl(URL.createObjectURL(file));
    setError('');
  };

  const createSupabaseUserRecord = async (userId, email) => {
    try {
      const { error } = await supabase
        .from('users')
        .insert([
          {
            firebase_uid: userId,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('❌ Error creating Supabase user record:', error);
      } else {
        console.log('✅ Supabase user record created');
      }
    } catch (error) {
      console.error('❌ Supabase user creation failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    
    if (!validateForm()) {
      setError('Please fix the errors in the form before submitting.');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Starting registration for:', formData.email);
      
      const authResult = await registerWithEmail(
        formData.email, 
        formData.password, 
        formData.fullName.trim()
      );
      
      console.log('📝 Auth result received:', authResult);
      
      if (authResult?.success === true) {
        console.log('✅ Registration successful!');
        
        const userId = authResult.user.uid;
        
        await createSupabaseUserRecord(userId, formData.email);
        
        let profilePictureUrl = null;
        if (profileImage) {
          console.log('🖼️ Uploading profile image to Supabase...');
          const profileImagePath = `${userId}/${Date.now()}_${profileImage.name}`;
          profilePictureUrl = await uploadFileToSupabase(
            BUCKETS.PROFILE_IMAGES,
            profileImagePath,
            profileImage
          );
          
          await updateDoc(doc(db, 'users', userId), {
            profilePicture: profilePictureUrl
          });
          
          console.log('✅ Profile image uploaded to Supabase and saved to Firestore');
        }
        
        let resumePath = null;
        if (resumeFile) {
          console.log('📄 Uploading resume to Supabase...');
          const resumeFilePath = `${userId}/${Date.now()}_${resumeFile.name}`;
          await uploadFileToSupabase(
            BUCKETS.RESUMES,
            resumeFilePath,
            resumeFile
          );
          
          await updateDoc(doc(db, 'users', userId), {
            resumeUrl: resumeFilePath
          });
          
          console.log('✅ Resume uploaded to Supabase and path saved to Firestore');
        }
        
        setSuccess(authResult.message || 'Account created successfully! ✅ Please check your email for verification. Redirecting to verification page...');
      
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setProfileImage(null);
        setResumeFile(null);
        setProfileImageUrl('');
        setResumeUrl('');
        
        setTimeout(() => {
          window.location.href = '/verify-email';
        }, 3000);
        
      } else {
        const errorMessage = authResult?.errorMessage || 'Registration failed. Please try again.';
        console.log('❌ Registration failed:', errorMessage);
        setError(errorMessage);
      }
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerProfileUpload = () => {
    profileInputRef.current?.click();
  };

  const triggerResumeUpload = () => {
    resumeInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex bg-gray-950">
      <div className="w-full grid lg:grid-cols-2">
        {/* Left Side - Image (Full Coverage) */}
        <div className="hidden lg:block relative bg-gray-950">
          <img 
            src="/login.png" 
            alt="Sign Up" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center bg-gray-950 px-8 py-12 lg:px-16 overflow-y-auto max-h-screen">
          <div className="max-w-md mx-auto w-full space-y-6">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-950 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
              <span className="text-xl font-bold text-white">CogniPrep</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">Create an Account</h1>
              <p className="text-gray-400 text-sm">Join us to start your interview prep journey</p>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800 rounded-2xl text-red-300 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-900/20 border border-green-800 rounded-2xl text-green-300 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full bg-gray-900 border-0 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    fieldErrors.fullName ? 'ring-2 ring-red-500' : ''
                  }`}
                  required
                  disabled={loading}
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full bg-gray-900 border-0 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    fieldErrors.email ? 'ring-2 ring-red-500' : ''
                  }`}
                  required
                  disabled={loading}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setShowPasswordConditions(true)}
                    onBlur={() => setShowPasswordConditions(false)}
                    placeholder="Create a strong password"
                    className={`w-full bg-gray-900 border-0 rounded-2xl px-5 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      fieldErrors.password ? 'ring-2 ring-red-500' : ''
                    }`}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {(showPasswordConditions || formData.password) && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.length ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <span className={`text-xs ${passwordStrength.length ? 'text-green-400' : 'text-gray-400'}`}>
                        At least 8 characters {passwordStrength.length && '✓'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.uppercase ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <span className={`text-xs ${passwordStrength.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                        One uppercase {passwordStrength.uppercase && '✓'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.lowercase ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <span className={`text-xs ${passwordStrength.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                        One lowercase {passwordStrength.lowercase && '✓'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.number ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <span className={`text-xs ${passwordStrength.number ? 'text-green-400' : 'text-gray-400'}`}>
                        One number {passwordStrength.number && '✓'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.special ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                      <span className={`text-xs ${passwordStrength.special ? 'text-green-400' : 'text-gray-400'}`}>
                        One special char {passwordStrength.special && '✓'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`w-full bg-gray-900 border-0 rounded-2xl px-5 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      fieldErrors.confirmPassword ? 'ring-2 ring-red-500' : ''
                    }`}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {formData.confirmPassword && (
                  <div className="mt-1">
                    {formData.password === formData.confirmPassword ? (
                      <p className="text-xs text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Passwords match ✓
                      </p>
                    ) : (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Passwords don't match
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Profile picture (optional)</label>
                <input
                  type="file"
                  ref={profileInputRef}
                  onChange={handleProfileImageUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={triggerProfileUpload}
                  disabled={loading}
                  className="w-full bg-gray-900 rounded-2xl px-5 py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">
                    {profileImage ? profileImage.name : 'Upload an image'}
                  </span>
                </button>
                {profileImageUrl && (
                  <div className="mt-2 flex justify-center">
                    <img 
                      src={profileImageUrl} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Resume - PDF (optional)</label>
                <input
                  type="file"
                  ref={resumeInputRef}
                  onChange={handleResumeUpload}
                  accept=".pdf,application/pdf"
                  className="hidden"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={triggerResumeUpload}
                  disabled={loading}
                  className="w-full bg-gray-900 rounded-2xl px-5 py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">
                    {resumeFile ? resumeFile.name : 'Upload a PDF'}
                  </span>
                </button>
                {resumeFile && (
                  <p className="mt-1 text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    ✓ Resume ready
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white rounded-2xl px-6 py-4 font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create an account'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={onLogin} 
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}