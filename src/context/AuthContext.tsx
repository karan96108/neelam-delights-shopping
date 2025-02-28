
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signUp: (phone: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<{ user: User | null; session: Session | null }>;
  requestOtp: (phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (phone: string, password: string, firstName: string, lastName: string) => {
    try {
      // Format phone number to E.164 format if not already formatted
      const formattedPhone = formatPhoneNumber(phone);
      
      const { data, error } = await supabase.auth.signUp({
        phone: formattedPhone,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Request OTP after signup
        await requestOtp(formattedPhone);
        
        toast({
          title: "Registration successful",
          description: "Please check your phone for the verification code.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (phone: string, password: string) => {
    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: formattedPhone,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      // Refetch the profile to update the state
      if (user) {
        fetchProfile(user.id);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Format phone number to E.164 format (required by Supabase)
  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Add + prefix if not present
    if (!cleaned.startsWith('+')) {
      // Assume it's a US number if no country code is provided
      if (cleaned.length === 10) {
        cleaned = '+1' + cleaned;
      } else {
        cleaned = '+' + cleaned;
      }
    }
    
    return cleaned;
  };

  // Method to request OTP via phone
  const requestOtp = async (phone: string) => {
    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send verification code",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Method to verify OTP
  const verifyOtp = async (phone: string, token: string) => {
    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Phone verified",
        description: "Your phone has been successfully verified.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    requestOtp,
    verifyOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
