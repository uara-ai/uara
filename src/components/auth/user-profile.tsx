"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignOut } from "@/components/overview/sign-out";
import { User, Mail, Calendar } from "lucide-react";

export function UserProfile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={user.profilePictureUrl || ""}
              alt={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
            />
            <AvatarFallback className="text-lg">
              {user.firstName?.charAt(0) ||
                user.lastName?.charAt(0) ||
                user.email?.charAt(0) ||
                "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">
          {`${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"}
        </CardTitle>
        <Badge variant="secondary" className="w-fit mx-auto">
          <User className="w-3 h-3 mr-1" />
          Authenticated
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>

          {user.createdAt && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <SignOut />
        </div>
      </CardContent>
    </Card>
  );
}
