// app/services/userService.js
import { supabase } from '../lib/supabase';

export const getUserProfile = async (email) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { exists: false };
      }
      throw error;
    }

    return { exists: true, profile };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { exists: false, error: error.message };
  }
};

export const getProfilePictureUrl = async (userId) => {
  try {
    const { data: urlData } = supabase.storage
      .from('cogniprep-files')
      .getPublicUrl(`profile-pictures/${userId}/latest.jpg`);
    
    return urlData?.publicUrl;
  } catch (error) {
    console.error('Error getting profile picture URL:', error);
    return null;
  }
};

export const getResumeUrl = async (userId) => {
  try {
    const { data: urlData } = supabase.storage
      .from('cogniprep-files')
      .getPublicUrl(`resumes/${userId}/latest.pdf`);
    
    return urlData?.publicUrl;
  } catch (error) {
    console.error('Error getting resume URL:', error);
    return null;
  }
};