import { useState, useEffect } from 'react';
import Header from './header';
import { Settings, Repeat, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function InterviewSession({ onBack, sessionData }) {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);

  // Prioritize session image, then profile picture
  const getProfilePictureUrl = () => {
    // 1. First check if session image was uploaded
    if (sessionData?.sessionImagePreview) {
      console.log('🖼️ Using session image:', sessionData.sessionImagePreview);
      return sessionData.sessionImagePreview;
    }
    
    // 2. Fall back to user profile picture from Supabase
    if (user?.firestoreProfile?.profilePicture) {
      console.log('🖼️ Using profile picture from Firestore:', user.firestoreProfile.profilePicture);
      return user.firestoreProfile.profilePicture;
    }
    
    console.log('🖼️ No image found, using default avatar');
    return null;
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    
    if (user.displayName && user.displayName !== '') {
      return user.displayName;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  const profilePicUrl = getProfilePictureUrl();
  const displayName = getDisplayName();

  return (
    <div className="min-h-screen">
      <Header showProfile={true} />
      
      <div className="px-4 py-4 bg-gray-950">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold break-words">Frontend Developer Interview</h1>
          <span className="bg-gray-800 px-3 py-1.5 rounded-lg text-xs sm:text-sm mt-2 sm:mt-0 sm:ml-auto">Technical Interview</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* AI Interviewer */}
          <div className="bg-gradient-to-br from-indigo-950 to-purple-950 rounded-3xl p-6 aspect-video flex items-center justify-center border-2 border-purple-400">
            <div className="text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-purple-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-purple-400 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-300 rounded-full"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold">AI Interviewer</h3>
            </div>
          </div>

          {/* User Video/Profile - CIRCULAR AVATAR */}
          <div className="bg-gray-900 rounded-3xl aspect-video relative flex items-center justify-center border-2 border-gray-800">
            {/* Circular Avatar Container */}
            <div className="relative">
              <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-purple-400 bg-gray-800">
                {profilePicUrl && !imageError ? (
                  <img 
                    src={profilePicUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    onError={() => {
                      console.log('❌ Image failed to load, showing default avatar');
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <User className="w-16 h-16 sm:w-24 sm:h-24 text-gray-600" />
                  </div>
                )}
              </div>
              
              {/* Name Badge Below Avatar */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-max">
                <div className="bg-gray-800/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-700">
                  <span className="font-semibold text-white text-sm">{displayName} (You)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Display */}
        <div className="bg-gray-900 rounded-2xl p-4 mb-6 mt-8">
          <p className="text-center text-base sm:text-lg">
            What job <span className="bg-white text-black px-1 py-0.5 rounded text-sm sm:text-base">experience level</span> are you targeting?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Repeat className="w-5 h-5" />
            <span>Repeat</span>
          </button>
          <button 
            onClick={onBack} 
            className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Leave interview</span>
          </button>
        </div>
      </div>
    </div>
  );
}