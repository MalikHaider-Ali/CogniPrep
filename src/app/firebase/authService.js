import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,   
  GithubAuthProvider,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc 
} from "firebase/firestore";
import { auth, googleProvider, githubProvider, db } from "../../../firebase";
import { supabase } from '../lib/supabase';

// ✅ Helper function to get simple, user-friendly error messages
const getAuthErrorMessage = (errorCode, provider = 'email') => {
  const errorMessages = {
    // Email/Password errors - Simple language
    'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Your password is too short. Please use at least 6 characters.',
    'auth/user-not-found': 'We couldn\'t find an account with this email. Please sign up first.',
    'auth/wrong-password': 'Wrong password. Please try again.',
    'auth/invalid-credential': 'Wrong email or password. Please check and try again.',
    'auth/too-many-requests': 'Too many failed login attempts. Please wait a few minutes or reset your password.',
    'auth/user-disabled': 'Your account has been disabled. Please contact our support team.',
    'auth/requires-recent-login': 'For security, please sign out and sign in again.',
    
    // Social auth errors - Simple language
    'auth/account-exists-with-different-credential': `You already have an account with this email using a different sign-in method. Please use the same method you used before.`,
    'auth/popup-blocked': 'Your browser blocked the sign-in window. Please allow pop-ups and try again.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Please wait a moment before trying again.',
    'auth/operation-not-allowed': `${provider} sign-in is currently disabled. Please contact support.`,
    'auth/unauthorized-domain': 'This website is not authorized. Please contact support.',
    
    // Network errors - Simple language
    'auth/network-request-failed': 'No internet connection. Please check your connection and try again.',
    'auth/timeout': 'Connection timed out. Please try again.',
    
    // Email verification errors - Simple language
    'auth/invalid-action-code': 'This link has expired or is invalid.',
    'auth/expired-action-code': 'This link has expired. Please request a new one.',
  };

  return errorMessages[errorCode] || 'Something went wrong. Please try again.';
};

// ✅ Helper function to create Supabase user record
const createSupabaseUserRecord = async (userId, email) => {
  try {
    // Check if user already exists in Supabase
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', userId)
      .single();

    if (existingUser) {
      console.log('✅ Supabase user record already exists');
      return;
    }

    // Create new user record
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
      // Don't throw - this is not critical for auth flow
    } else {
      console.log('✅ Supabase user record created');
    }
  } catch (error) {
    console.error('❌ Supabase user creation failed:', error);
    // Don't throw - allow auth to continue
  }
};

// ✅ FIXED: Keep user logged in after signup
export const registerWithEmail = async (email, password, displayName) => {
  console.log('🔥 [registerWithEmail] Starting registration for:', email);
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ User created:', user.uid);

    if (displayName) {
      await updateProfile(user, { displayName: displayName.trim() });
      console.log('✅ Display name set:', displayName);
    }

    // Save to Firestore - WITHOUT profilePicture or resumeUrl initially
    // These will be added after file upload in SignUp.jsx
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: 'email'
      });
      console.log('✅ User stored in Firestore');
    } catch (firestoreError) {
      console.error('❌ Firestore error:', firestoreError);
    }

    // Send verification email
    await sendEmailVerification(user);
    console.log('✅ Verification email sent');

    // ✅ DO NOT sign out – keep user logged in but unverified
    return { 
      success: true, 
      user,
      message: "Account created! Please check your email to verify your account."
    };
  } catch (error) {
    console.error("❌ Registration error:", error);
    
    return { 
      success: false, 
      errorMessage: getAuthErrorMessage(error?.code),
      errorCode: error?.code || null
    };
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await signOut(auth);
      return {
        success: false,
        error: "Please verify your email first. Check your inbox for the verification link.",
        errorCode: 'auth/email-not-verified'
      };
    }

    // Fetch Firestore profile data
    let firestoreProfile = null;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        firestoreProfile = { id: userDocSnap.id, ...userDocSnap.data() };
      }
    } catch (firestoreError) {
      console.error('❌ Firestore profile fetch error:', firestoreError);
    }

    const userWithProfile = {
      ...user,
      firestoreProfile: firestoreProfile,
      // Only use Firestore profilePicture - ignore Firebase Auth photoURL for email users
      profilePicture: firestoreProfile?.profilePicture || null
    };

    return {
      success: true,
      user: userWithProfile
    };
  } catch (error) {
    console.error("❌ Login error:", error);
    return { 
      success: false, 
      error: getAuthErrorMessage(error?.code),
      errorCode: error?.code
    };
  }
};

// ✅ Google sign-in - DON'T save photoURL to Firestore, CREATE Supabase record
export const signInWithGoogle = async () => {
  try {
    console.log('🚀 Starting Google sign-in...');
    
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log('✅ Google auth successful:', user.email);
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      // ✅ CREATE SUPABASE USER RECORD for new Google users
      await createSupabaseUserRecord(user.uid, user.email);
      
      // Create Firestore user profile WITHOUT photoURL
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        provider: 'google',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      console.log('✅ Google user profile created in Firestore');
    } else {
      // Update last login time
      await updateDoc(userDocRef, {
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    // Fetch Firestore profile
    let firestoreProfile = null;
    try {
      const profileDoc = await getDoc(userDocRef);
      if (profileDoc.exists()) {
        firestoreProfile = { id: profileDoc.id, ...profileDoc.data() };
      }
    } catch (firestoreError) {
      console.error('❌ Firestore profile fetch error:', firestoreError);
    }
    
    const userWithProfile = {
      ...user,
      firestoreProfile: firestoreProfile,
      // Only use Firestore profilePicture, not Google's photoURL
      profilePicture: firestoreProfile?.profilePicture || null
    };

    return { 
      success: true, 
      user: userWithProfile,
      provider: 'google'
    };
    
  } catch (error) {
    console.error('❌ Google sign-in error:', error.code, error.message);
    
    // Check if email is already registered with different method
    if (error.code === 'auth/account-exists-with-different-credential') {
      try {
        // Try to get the email from the error
        const email = error.customData?.email;
        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          
          // Create simple, friendly provider names - filter out undefined/null
          const providerList = methods
            .map(method => {
              if (method === 'password') return 'Email & Password';
              if (method.includes('google')) return 'Google';
              if (method.includes('github')) return 'GitHub';
              return null; // Return null for unknown methods
            })
            .filter(provider => provider !== null); // Remove null values

          // Only show message if we have valid providers
          if (providerList.length > 0) {
            let message = `You already have an account with this email. Please sign in using `;
            
            if (providerList.length === 1) {
              message += `${providerList[0]}.`;
            } else {
              const lastProvider = providerList.pop();
              message += `${providerList.join(', ')} or ${lastProvider}.`;
            }
            
            return { 
              success: false, 
              error: message,
              errorCode: error.code,
              existingMethods: methods
            };
          }
        }
      } catch (fetchError) {
        console.error('Error fetching sign-in methods:', fetchError);
      }
      
      // Fallback message if we couldn't determine the method
      return {
        success: false,
        error: 'You already have an account with this email. Please use your original sign-in method.',
        errorCode: error.code
      };
    }
    
    return { 
      success: false, 
      error: getAuthErrorMessage(error.code, 'Google'),
      errorCode: error.code
    };
  }
};

// ✅ GitHub sign-in - DON'T save photoURL to Firestore, CREATE Supabase record
export const signInWithGitHub = async () => {
  try {
    console.log('🚀 Starting GitHub sign-in...');
    
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    
    console.log('✅ GitHub auth successful:', user.email);
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    let firestoreProfile = null;
    
    if (!userDocSnap.exists()) {
      // ✅ CREATE SUPABASE USER RECORD for new GitHub users
      await createSupabaseUserRecord(user.uid, user.email);
      
      // Create Firestore profile WITHOUT photoURL
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        provider: 'github',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      console.log('✅ GitHub user profile created in Firestore');
    } else {
      // Update last login
      await updateDoc(userDocRef, {
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    // Fetch Firestore profile
    try {
      const profileDoc = await getDoc(userDocRef);
      if (profileDoc.exists()) {
        firestoreProfile = { id: profileDoc.id, ...profileDoc.data() };
      }
    } catch (firestoreError) {
      console.error('❌ Firestore error during GitHub sign-in:', firestoreError);
    }

    const userWithProfile = {
      ...user,
      firestoreProfile: firestoreProfile,
      // Only use Firestore profilePicture, not GitHub's photoURL
      profilePicture: firestoreProfile?.profilePicture || null
    };

    return { 
      success: true, 
      user: userWithProfile, 
      provider: 'github' 
    };
  } catch (error) {
    console.error("❌ GitHub sign-in error:", error.code, error.message);
    
    // Check if email is already registered with different method
    if (error.code === 'auth/account-exists-with-different-credential') {
      try {
        const email = error.customData?.email;
        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          
          // Create simple, friendly provider names - filter out undefined/null
          const providerList = methods
            .map(method => {
              if (method === 'password') return 'Email & Password';
              if (method.includes('google')) return 'Google';
              if (method.includes('github')) return 'GitHub';
              return null; // Return null for unknown methods
            })
            .filter(provider => provider !== null); // Remove null values

          // Only show message if we have valid providers
          if (providerList.length > 0) {
            let message = `You already have an account with this email. Please sign in using `;
            
            if (providerList.length === 1) {
              message += `${providerList[0]}.`;
            } else {
              const lastProvider = providerList.pop();
              message += `${providerList.join(', ')} or ${lastProvider}.`;
            }
            
            return { 
              success: false, 
              error: message,
              errorCode: error.code,
              existingMethods: methods
            };
          }
        }
      } catch (fetchError) {
        console.error('Error fetching sign-in methods:', fetchError);
      }
      
      // Fallback message if we couldn't determine the method
      return {
        success: false,
        error: 'You already have an account with this email. Please use your original sign-in method.',
        errorCode: error.code
      };
    }
    
    return { 
      success: false, 
      error: getAuthErrorMessage(error.code, 'GitHub'),
      errorCode: error.code
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("❌ Logout error:", error);
    return { 
      success: false, 
      error: 'Unable to sign out. Please try again.'
    };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { 
      success: true, 
      message: "We've sent you an email with a link to reset your password." 
    };
  } catch (error) {
    console.error("❌ Password reset error:", error);
    return { 
      success: false, 
      error: getAuthErrorMessage(error?.code)
    };
  }
};

export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    
    // Update Firebase Auth profile
    await updateProfile(user, updates);
    
    // Update Firestore user document
    const userRef = doc(db, 'users', user.uid);
    const updateData = {
      updatedAt: new Date().toISOString()
    };
    
    // Only add fields that exist in the updates parameter
    if (updates.displayName) {
      updateData.displayName = updates.displayName;
    }
    if (updates.photoURL) {
      updateData.profilePicture = updates.photoURL;
    }
    
    await updateDoc(userRef, updateData);
    
    return { success: true, user: auth.currentUser };
  } catch (error) {
    console.error("❌ Update profile error:", error);
    return { 
      success: false, 
      error: 'Unable to update your profile. Please try again.'
    };
  }
};

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

export const reloadUser = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      return auth.currentUser;
    }
    return null;
  } catch (error) {
    console.error('Error reloading user:', error);
    throw error;
  }
};

// ✅ New: Resend verification email
export const resendVerificationEmail = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");
  await sendEmailVerification(user);
};