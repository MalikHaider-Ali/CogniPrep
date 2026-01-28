// app/components/ProfileSettings.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './header';
import { 
  Upload, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Save, 
  User,
  Mail,
  FileText,
  Camera,
  X,
  Eye,
  EyeOff,
  Shield,
  ExternalLink,
  Download
} from 'lucide-react';
import { updateUserProfile } from '../firebase/authService';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { 
  uploadFileToSupabase, 
  deleteFileFromSupabase, 
  BUCKETS, 
  extractFilePathFromUrl,
  getSignedUrl 
} from '../lib/supabase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export default function ProfileSettings({ onBack }) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageError, setImageError] = useState(false);
  const [userProvider, setUserProvider] = useState(null);
  const [showResumeViewer, setShowResumeViewer] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    publicProfile: false,
    twoFactorAuth: false
  });
  
  // File states
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState('');
  
  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const profileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  // Initialize form with user data and detect provider
  useEffect(() => {
    if (user) {
      // Detect authentication provider
      const provider = user.providerData?.[0]?.providerId || 
                       user.firestoreProfile?.provider || 
                       'password';
      
      setUserProvider(provider);
      console.log('🔐 User provider:', provider);
      
      let firestoreProfile = null;
      
      if (user.firestoreProfile) {
        firestoreProfile = user.firestoreProfile;
      } else {
        const fetchFirestoreProfile = async () => {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              firestoreProfile = { id: userDocSnap.id, ...userDocSnap.data() };
              
              const updatedUser = {
                ...user,
                firestoreProfile: firestoreProfile,
                profilePicture: firestoreProfile?.profilePicture || null
              };
              updateUser(updatedUser);
            }
          } catch (error) {
            console.error('❌ Error fetching Firestore profile:', error);
          }
        };
        
        fetchFirestoreProfile();
      }

      setFormData(prev => ({
        ...prev,
        displayName: user.displayName || user.email?.split('@')[0] || '',
        email: user.email || '',
        notifications: firestoreProfile?.notifications ?? true,
        publicProfile: firestoreProfile?.public_profile ?? false,
        twoFactorAuth: firestoreProfile?.two_factor_auth ?? false
      }));
      
      // Set profile image preview from Firestore (Supabase URL)
      if (firestoreProfile?.profilePicture) {
        setProfileImagePreview(firestoreProfile.profilePicture);
      } else if (user.firestoreProfile?.profilePicture) {
        setProfileImagePreview(user.firestoreProfile.profilePicture);
      } else {
        setProfileImagePreview('');
      }
      
      // Set resume preview - need to get signed URL for private files
      const loadResumePreview = async () => {
        if (firestoreProfile?.resumeUrl) {
          // If it's a Supabase path (not full URL), get signed URL
          if (!firestoreProfile.resumeUrl.startsWith('http')) {
            try {
              const signedUrl = await getSignedUrl(BUCKETS.RESUMES, firestoreProfile.resumeUrl, 3600);
              setResumePreview(signedUrl);
            } catch (error) {
              console.error('Error getting resume signed URL:', error);
              setResumePreview('');
            }
          } else {
            setResumePreview(firestoreProfile.resumeUrl);
          }
        } else if (user.firestoreProfile?.resumeUrl) {
          if (!user.firestoreProfile.resumeUrl.startsWith('http')) {
            try {
              const signedUrl = await getSignedUrl(BUCKETS.RESUMES, user.firestoreProfile.resumeUrl, 3600);
              setResumePreview(signedUrl);
            } catch (error) {
              console.error('Error getting resume signed URL:', error);
              setResumePreview('');
            }
          } else {
            setResumePreview(user.firestoreProfile.resumeUrl);
          }
        } else {
          setResumePreview('');
        }
      };
      
      loadResumePreview();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, GIF, WebP)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
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
    setResumePreview(URL.createObjectURL(file));
    setError('');
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview('');
    setImageError(false);
  };



  const triggerProfileUpload = () => {
    profileInputRef.current?.click();
  };

  const triggerResumeUpload = () => {
    resumeInputRef.current?.click();
  };

  const handleViewResume = () => {
    if (resumePreview) {
      setShowResumeViewer(true);
    }
  };

 

  const validateForm = () => {
    // Only validate password for email/password users
    if (userProvider === 'password' || userProvider === 'email') {
      if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
        if (!formData.currentPassword) {
          setError('Please enter your current password to change password');
          return false;
        }
        
        if (formData.newPassword.length < 6) {
          setError('New password must be at least 6 characters');
          return false;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
          setError("New passwords don't match");
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updateData = {
        updatedAt: new Date().toISOString()
      };
      
      // 1. Update profile picture if changed
      if (profileImage) {
        console.log('📤 Uploading profile image to Supabase...');
        
        // Delete old profile picture if it exists
        if (user.firestoreProfile?.profilePicture) {
          const oldFilePath = extractFilePathFromUrl(user.firestoreProfile.profilePicture);
          if (oldFilePath) {
            await deleteFileFromSupabase(BUCKETS.PROFILE_IMAGES, oldFilePath);
          }
        }
        
        // Upload new profile picture to Supabase
        const profileImagePath = `${user.uid}/${Date.now()}_${profileImage.name}`;
        const profilePictureUrl = await uploadFileToSupabase(
          BUCKETS.PROFILE_IMAGES,
          profileImagePath,
          profileImage
        );
        
        // Update Firebase Auth profile (optional)
        await updateUserProfile({ photoURL: profilePictureUrl });
        
        // Add to Firestore update
        updateData.profilePicture = profilePictureUrl;
        
        console.log('✅ Profile picture uploaded to Supabase');
      }
      
      // 2. Upload resume if changed
      if (resumeFile) {
        console.log('📤 Uploading resume to Supabase...');
        
        // Delete old resume if it exists
        if (user.firestoreProfile?.resumeUrl) {
          const oldFilePath = extractFilePathFromUrl(user.firestoreProfile.resumeUrl);
          if (oldFilePath) {
            await deleteFileFromSupabase(BUCKETS.RESUMES, oldFilePath);
          }
        }
        
        // Upload new resume to Supabase
        const resumePath = `${user.uid}/${Date.now()}_${resumeFile.name}`;
        const resumeUrl = await uploadFileToSupabase(
          BUCKETS.RESUMES,
          resumePath,
          resumeFile
        );
        
        // Add to Firestore update (store the path, not full URL for private files)
        updateData.resumeUrl = resumePath;
        
        console.log('✅ Resume uploaded to Supabase');
      }
      
      // 3. Update display name if changed
      if (formData.displayName !== user.displayName) {
        await updateUserProfile({ displayName: formData.displayName });
        updateData.displayName = formData.displayName;
        console.log('✅ Display name updated');
      }
      
      // 4. Handle password change (ONLY for email/password users)
      if ((userProvider === 'password' || userProvider === 'email') && formData.newPassword) {
        try {
          console.log('🔐 Updating password...');
          
          // Re-authenticate user before password change (security requirement)
          const credential = EmailAuthProvider.credential(
            user.email,
            formData.currentPassword
          );
          
          await reauthenticateWithCredential(auth.currentUser, credential);
          
          // Update password
          await updatePassword(auth.currentUser, formData.newPassword);
          
          console.log('✅ Password updated successfully');
        } catch (passwordError) {
          console.error('❌ Password update failed:', passwordError);
          
          if (passwordError.code === 'auth/wrong-password') {
            setError('Current password is incorrect');
          } else if (passwordError.code === 'auth/requires-recent-login') {
            setError('Please log out and log back in before changing your password');
          } else {
            setError('Failed to update password. Please try again.');
          }
          
          setSaving(false);
          return; // Stop execution if password update fails
        }
      }
      
      // 5. Update settings
      updateData.notifications = formData.notifications;
      updateData.public_profile = formData.publicProfile;
      updateData.two_factor_auth = formData.twoFactorAuth;
      
      // 6. Save all updates to Firestore
      await updateDoc(userDocRef, updateData);
      
      // 7. Fetch updated Firestore data
      const updatedDocSnap = await getDoc(userDocRef);
      const updatedFirestoreProfile = updatedDocSnap.exists() 
        ? { id: updatedDocSnap.id, ...updatedDocSnap.data() }
        : user.firestoreProfile;
      
      // 8. Update context with new data
      const updatedUser = {
        ...user,
        displayName: formData.displayName,
        firestoreProfile: updatedFirestoreProfile,
        profilePicture: updatedFirestoreProfile?.profilePicture || null
      };
      
      updateUser(updatedUser);
      
      setSuccess('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Clear file selections
      setProfileImage(null);
      setResumeFile(null);
      
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      setError(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  

  // Helper function to get provider display name
  const getProviderDisplayName = () => {
    if (userProvider === 'google.com') return 'Google';
    if (userProvider === 'github.com') return 'GitHub';
    return 'Email';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header showProfile={true} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account and preferences</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="font-semibold">Error:</strong>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-xl text-green-300 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="font-semibold">Success!</strong>
              <p className="mt-1">{success}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-b from-[#1A1C2A] to-[#242633] rounded-3xl p-6 border border-[#242633]">
              <h2 className="text-xl font-semibold mb-4 text-white">Profile Picture</h2>
              
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden border-4 border-gray-600">
                    {profileImagePreview && !imageError ? (
                      <img
                        src={profileImagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {profileImagePreview && (
                    <button
                      onClick={removeProfileImage}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <input
                  type="file"
                  ref={profileInputRef}
                  onChange={handleProfileImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <button
                  onClick={triggerProfileUpload}
                  disabled={saving}
                  className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-5 h-5" />
                  {profileImagePreview ? 'Change Picture' : 'Upload Picture'}
                </button>
                
                <p className="text-xs text-gray-400 mt-2 text-center">
                  JPG, PNG, GIF up to 5MB
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-[#1A1C2A] to-[#242633] rounded-3xl p-6 border border-[#242633]">
              <h2 className="text-xl font-semibold mb-4 text-white">Resume</h2>
              
              <div className="space-y-4">
                {resumePreview ? (
                  <>
                    <button
                      onClick={handleViewResume}
                      className="w-full flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
                    >
                      <FileText className="w-5 h-5 text-green-400" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                          Resume uploaded
                        </p>
                        <p className="text-xs text-gray-400">
                          Click to view or replace
                        </p>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </button>
                    
                    
                  </>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">No resume uploaded</p>
                      <p className="text-xs text-gray-400">Upload your resume</p>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={resumeInputRef}
                  onChange={handleResumeUpload}
                  accept=".pdf"
                  className="hidden"
                />
                
                <button
                  onClick={triggerResumeUpload}
                  disabled={saving}
                  className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5" />
                  {resumePreview ? 'Replace Resume' : 'Upload Resume'}
                </button>
                
                <p className="text-xs text-gray-400 text-center">
                  PDF files up to 10MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-b from-[#1A1C2A] to-[#242633] rounded-3xl p-6 border border-[#242633]">
              <h2 className="text-xl font-semibold mb-6 text-white">Personal Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    <User className="w-4 h-4 inline mr-2" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your display name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-gray-800 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Conditional Security Section */}
            {(userProvider === 'password' || userProvider === 'email') ? (
              // EMAIL/PASSWORD USERS - Show password change section
              <div className="bg-gradient-to-b from-[#1A1C2A] to-[#242633] rounded-3xl p-6 border border-[#242633]">
                <h2 className="text-xl font-semibold mb-6 text-white">Security Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                 
                </div>
              </div>
            ) : (
              // OAUTH USERS (Google/GitHub) - Show account security info
              <div className="bg-gradient-to-b from-[#1A1C2A] to-[#242633] rounded-3xl p-6 border border-[#242633]">
                <h2 className="text-xl font-semibold mb-6 text-white">Account Security</h2>
                
                <div className="flex items-start gap-4 p-4 bg-blue-900/20 border border-blue-800 rounded-xl">
                  <div className="flex-shrink-0 mt-1">
                    {userProvider === 'google.com' ? (
                      <svg className="w-8 h-8" viewBox="0 0 24 24">
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
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <p className="text-sm font-semibold text-white">
                        Signed in with {getProviderDisplayName()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Your account is secured through {getProviderDisplayName()}'s authentication system. 
                      No password is required or stored.
                    </p>
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <p className="text-xs text-gray-400">
                        <strong className="text-gray-300">Security Tip:</strong> To manage your account security, 
                        two-factor authentication, or change your password, please visit your{' '}
                        {userProvider === 'google.com' ? (
                          <a 
                            href="https://myaccount.google.com/security" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            Google Account Security Settings
                          </a>
                        ) : (
                          <a 
                            href="https://github.com/settings/security" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            GitHub Security Settings
                          </a>
                        )}.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                  <p className="text-xs text-gray-400">
                    <strong className="text-gray-300">Why no password?</strong> {getProviderDisplayName()} OAuth 
                    provides secure authentication without needing a separate password for this app. This is more 
                    secure as you only need to remember one password (your {getProviderDisplayName()} password) and 
                    benefit from {getProviderDisplayName()}'s advanced security features.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-2 bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                onClick={onBack}
                disabled={saving}
                className="flex-1 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              
            </div>
            
            <p className="text-xs text-gray-500 text-center pt-4">
              Changes may take a few moments to reflect across all devices
            </p>
          </div>
        </div>
      </div>
      
      {/* Resume Viewer Modal */}
      {showResumeViewer && resumePreview && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowResumeViewer(false)}
        >
          <div 
            className="bg-gray-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Resume Preview</h3>
              </div>
              <div className="flex items-center gap-2">
                
                <button
                  onClick={() => window.open(resumePreview, '_blank')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </button>
                <button
                  onClick={() => setShowResumeViewer(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={resumePreview}
                className="w-full h-full"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}