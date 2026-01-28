// supabase.js
// Create this file at: src/app/lib/supabase.js

import { createClient } from '@supabase/supabase-js';

// Your Supabase project credentials
const supabaseUrl = 'https://gqribqapsnubwjvvnike.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcmlicWFwc251YndqdnZuaWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMjE5NDQsImV4cCI6MjA4NDg5Nzk0NH0.hdDcNyOV76o1HKpql5WiFe9jwTuqH9_MCU1I29z53yg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket names
export const BUCKETS = {
  PROFILE_IMAGES: 'profile-images',
  RESUMES: 'resumes'
};

// Helper function to get public URL for profile images
export const getPublicUrl = (bucket, filePath) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

// Helper function to upload file to Supabase Storage
export const uploadFileToSupabase = async (bucket, filePath, file) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Replace if file exists
      });

    if (error) throw error;

    // Return public URL for profile images
    if (bucket === BUCKETS.PROFILE_IMAGES) {
      return getPublicUrl(bucket, filePath);
    }

    // For private files (resumes), return the file path
    return filePath;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
};

// Helper function to delete file from Supabase Storage
export const deleteFileFromSupabase = async (bucket, filePath) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
    console.log('File deleted from Supabase Storage');
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
    // Don't throw error as it's not critical
  }
};

// Helper function to get signed URL for private files (resumes)
export const getSignedUrl = async (bucket, filePath, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};

// Helper to extract file path from Supabase URL
export const extractFilePathFromUrl = (url) => {
  if (!url) return null;
  
  // Check if it's a Supabase URL
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    // Extract path after the bucket name
    const parts = url.split('/object/public/');
    if (parts.length > 1) {
      const pathWithBucket = parts[1];
      const pathParts = pathWithBucket.split('/');
      // Remove bucket name and return the rest
      return pathParts.slice(1).join('/');
    }
  }
  
  // If it's already a path (not a full URL), return as is
  return url;
};

export default supabase;