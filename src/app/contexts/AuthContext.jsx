'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  onAuthStateChanged, 
  logoutUser,
  resendVerificationEmail as resendEmail
} from '../firebase/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    console.log('🔐 AuthContext: Setting up auth listener');
    
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      console.log('🔐 Auth state changed:', firebaseUser ? firebaseUser.email : 'No user');
      
      if (firebaseUser) {
        // Get Firestore profile data
        let firestoreProfile = null;
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            firestoreProfile = { id: userDocSnap.id, ...userDocSnap.data() };
            console.log('✅ Firestore profile loaded');
          }
        } catch (error) {
          console.error('❌ Error fetching Firestore profile:', error);
        }

        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          metadata: firebaseUser.metadata,
          providerData: firebaseUser.providerData,
          firestoreProfile: firestoreProfile,
          profilePicture: firestoreProfile?.profilePicture || null
        };
        
        console.log('✅ User authenticated:', userData.email, 'Verified:', userData.emailVerified);
        setUser(userData);
      } else {
        console.log('❌ No user authenticated');
        setUser(null);
      }
      
      setLoading(false);
      setInitialCheckComplete(true);
    });

    return () => {
      console.log('🔐 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    console.log('🚪 Logging out...');
    try {
      await logoutUser();
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const updateUser = (updates) => {
    console.log('🔄 Updating user:', updates);
    setUser(prev => ({ 
      ...prev, 
      ...updates,
      firestoreProfile: {
        ...prev?.firestoreProfile,
        ...updates.firestoreProfile
      }
    }));
  };

  const resendVerificationEmail = async () => {
    try {
      await resendEmail();
      console.log('✅ Verification email sent');
    } catch (error) {
      console.error('❌ Error resending verification email:', error);
      throw error;
    }
  };

  // Refresh user data from Firestore (useful after profile updates)
  const refreshUserProfile = async () => {
    if (!user) return;
    
    console.log('🔄 Refreshing user profile from Firestore...');
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const firestoreProfile = { id: userDocSnap.id, ...userDocSnap.data() };
        setUser(prev => ({
          ...prev,
          firestoreProfile: firestoreProfile,
          profilePicture: firestoreProfile?.profilePicture || null,
          displayName: firestoreProfile?.displayName || prev.displayName
        }));
        console.log('✅ Profile refreshed');
      }
    } catch (error) {
      console.error('❌ Error refreshing profile:', error);
    }
  };

  const value = {
    user,
    loading,
    initialCheckComplete,
    isAuthenticated: !!user && user.emailVerified,
    isEmailVerified: !!user && user.emailVerified,
    logout,
    updateUser,
    refreshUserProfile,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};