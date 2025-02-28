
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, requestOtp, verifyOtp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // OTP verification states
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneForOtp, setPhoneForOtp] = useState('');

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(loginPhone, loginPassword);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await signUp(registerPhone, registerPassword, firstName, lastName);
      // Store the phone for OTP verification
      setPhoneForOtp(registerPhone);
      // Show OTP verification form
      setShowOtpVerification(true);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await verifyOtp(phoneForOtp, otpCode);
      toast({
        title: "Phone verified",
        description: "Your account has been created successfully. You can now login.",
      });
      setShowOtpVerification(false);
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      await requestOtp(phoneForOtp);
      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your phone.",
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If showing OTP verification form
  if (showOtpVerification) {
    return (
      <div className="container max-w-md mx-auto pt-32 pb-16 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Verify Your Phone</CardTitle>
            <CardDescription>
              Enter the verification code sent to {phoneForOtp}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerifyOtp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input 
                  id="otp" 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  placeholder="Enter the 6-digit code"
                  autoComplete="one-time-code"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleResendOtp}
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                Resend Code
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto pt-32 pb-16 px-4">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
              <CardDescription>
                Enter your phone number and password to sign in to your account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+1 (555) 123-4567" 
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: +1 (country code) followed by your number
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Create an Account</CardTitle>
              <CardDescription>
                Enter your information to create a new account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPhone">Phone Number</Label>
                  <Input 
                    id="registerPhone" 
                    type="tel" 
                    placeholder="+1 (555) 123-4567" 
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: +1 (country code) followed by your number
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input 
                    id="registerPassword" 
                    type="password" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
