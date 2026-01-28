'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LogOut, 
  User, 
  Settings, 
  Loader2,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { logoutUser } from '../firebase/authService';
import Image from 'next/image';

export default function Header({ showProfile = false, onNavigateToProfile }) {
  const { user, loading, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setShowDropdown(false);
      setShowMobileMenu(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getProfilePictureUrl = () => {
    if (!user) return null;
    
    if (user.firestoreProfile?.profilePicture) {
      console.log('🖼️ Using profile picture from Firestore:', user.firestoreProfile.profilePicture);
      return user.firestoreProfile.profilePicture;
    }
    
    console.log('🖼️ No profile picture found, using default');
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
    <header className="bg-gray-950 border-b border-gray-800">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">CogniPrep</span>
        </div>
        
        {showProfile && (
          <>
            {/* Desktop Profile */}
            <div className="hidden md:block relative">
              {loading ? (
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="User menu"
                  >
                    <div className="hidden lg:flex flex-col items-end">
                      <span className="text-sm font-medium text-white truncate max-w-[150px]">
                        {displayName}
                      </span>
                      <span className="text-xs text-gray-400 truncate max-w-[150px]">
                        {user.email}
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-700 overflow-hidden border-2 border-gray-600 hover:border-purple-500 transition-colors">
                        {profilePicUrl && !imageError ? (
                          <Image
                            src={profilePicUrl}
                            alt={`${displayName}'s profile`}
                            className="w-full h-full object-cover"
                            width={48}
                            height={48}
                            onError={() => setImageError(true)}
                            unoptimized={true}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <User className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <ChevronDown 
                        className={`absolute -bottom-1 -right-1 w-4 h-4 text-gray-400 bg-gray-800 rounded-full p-0.5 border border-gray-700 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>
                  
                  {showDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowDropdown(false)}
                        aria-hidden="true"
                      />
                      
                      <div className="absolute right-0 mt-2 w-64 bg-gray-950 rounded-xl shadow-lg border border-gray-800 z-50">
                        <div className="p-4 border-b border-gray-800">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                              {profilePicUrl && !imageError ? (
                                <Image
                                  src={profilePicUrl}
                                  alt={displayName}
                                  className="w-full h-full object-cover"
                                  width={48}
                                  height={48}
                                  onError={() => setImageError(true)}
                                  unoptimized={true}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                  <User className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-white truncate">
                                {displayName}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              if (onNavigateToProfile) {
                                onNavigateToProfile();
                              }
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gray-800 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Profile Settings
                          </button>
                        </div>
                        
                        <div className="p-2 border-t border-gray-800">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm hover:bg-red-900/20 text-red-400 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : isAuthenticated && user ? (
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-lg hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label="Open menu"
                >
                  {showMobileMenu ? (
                    <X className="w-6 h-6 text-white" />
                  ) : (
                    <Menu className="w-6 h-6 text-white" />
                  )}
                </button>
              ) : (
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && isAuthenticated && user && (
              <>
                <div 
                  className="fixed inset-0 bg-black/60 z-40 md:hidden" 
                  onClick={() => setShowMobileMenu(false)}
                  aria-hidden="true"
                />
                
                <div className="fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-lg z-50 md:hidden border-l border-gray-800">
                  {/* Mobile Menu Header */}
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-white">Menu</span>
                      <button
                        onClick={() => setShowMobileMenu(false)}
                        className="p-1 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                        {profilePicUrl && !imageError ? (
                          <Image
                            src={profilePicUrl}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            width={48}
                            height={48}
                            onError={() => setImageError(true)}
                            unoptimized={true}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-white truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        if (onNavigateToProfile) {
                          onNavigateToProfile();
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gray-800 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      Profile Settings
                    </button>
                  </div>
                  
                  {/* Mobile Sign Out */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm hover:bg-red-900/20 text-red-400 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}