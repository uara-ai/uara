"use client";

import { useAuth } from "@/contexts/auth-context";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { UserProfile } from "@/components/auth/user-profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to UARA.AI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {user
                ? "You are successfully authenticated!"
                : "Sign in to get started"}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Authentication Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {user ? "Account Information" : "Authentication"}
                  </CardTitle>
                  <CardDescription>
                    {user
                      ? "Your account details and settings"
                      : "Sign in with your Google account to access all features"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <UserProfile />
                  ) : (
                    <div className="space-y-4">
                      <GoogleSignInButton />
                      <p className="text-sm text-gray-500 text-center">
                        Secure authentication powered by Supabase
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Features Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>
                    What you can do with UARA.AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Google OAuth Integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Secure Authentication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Modern UI Components</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Next.js 15 with App Router</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    Follow these steps to set up your environment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">1. Environment Setup</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Copy{" "}
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                        .env.local.example
                      </code>{" "}
                      to{" "}
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                        .env.local
                      </code>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">2. Supabase Configuration</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add your Supabase project URL and anon key to the
                      environment variables
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">3. Google OAuth Setup</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configure Google OAuth in your Supabase dashboard under
                      Authentication → Providers
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tech Stack</CardTitle>
                  <CardDescription>
                    Built with modern technologies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span>Next.js 15</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Supabase</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>TypeScript</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Tailwind CSS</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Radix UI</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Google OAuth</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
