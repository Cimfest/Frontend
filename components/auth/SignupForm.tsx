"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  artistName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

export function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    artistName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: keyof SignUpFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError("First name is required.");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required.");
      return false;
    }
    if (!formData.artistName.trim()) {
      setError("Artist name is required.");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!formData.password) {
      setError("Password is required.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!formData.agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClientComponentClient();

      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            artist_name: formData.artistName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        console.log('User created:', authData.user.id);
        
        // Step 2: Insert into profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            artist_name: formData.artistName,
            email: formData.email,
          })
          .select();

        if (profileError) {
          console.log('Profile error details:', profileError);
          throw new Error(`Profile creation failed: ${profileError.message}`);
        }

        console.log('Profile created:', profileData);

        // Step 3: Auto login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          console.log('Auto login failed, but account created');
        }

        // Step 4: Redirect to dashboard
        router.push('/dashboard');
        router.refresh();

      } else {
        throw new Error('User creation failed');
      }

    } catch (error: any) {
      console.error('Complete error:', error);
      setError(error.message || "An error occurred during sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="signup" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin" asChild>
            <Link href="/Login">Sign In</Link>
          </TabsTrigger>
          <TabsTrigger value="Signup">Sign Up</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="artist-name">Artist Name</Label>
          <Input
            id="artist-name"
            placeholder="Your stage name"
            value={formData.artistName}
            onChange={(e) => updateFormData('artistName', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="artist@example.com"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreedToTerms}
            onCheckedChange={(checked) => updateFormData('agreedToTerms', Boolean(checked))}
            disabled={isLoading}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-normal text-gray-400"
            >
              I agree to the{" "}
              <Link href="/terms" className="underline hover:text-yellow-400">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-yellow-400">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-950 px-2 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="w-full" disabled={isLoading}>
          Google
        </Button>
        <Button variant="outline" className="w-full" disabled={isLoading}>
          Apple
        </Button>
      </div>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-yellow-400 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}