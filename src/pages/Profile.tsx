
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading, signOut, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Redirect if user is not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setEmail(user?.email || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
    }
  }, [profile, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto pt-32 pb-16 px-4 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto pt-32 pb-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Your Profile</CardTitle>
          <CardDescription>
            Manage your account information.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Account Information</h3>
              <p className="text-sm text-muted-foreground">
                Update your personal information.
              </p>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full sm:w-auto"
            >
              Sign Out
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
