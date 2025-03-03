
import React, { createContext, useContext, ReactNode } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

interface AuthContextType {
  isSignedIn: boolean;
  userId: string | null;
  userFullName: string | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  
  // For simplicity, we'll consider users with specific emails as admins
  // In a real app, this would come from a database or claims
  const isAdmin = isSignedIn && 
    (user?.primaryEmailAddress?.emailAddress?.endsWith('@hospital-admin.com') || false);

  const value = {
    isSignedIn: isSignedIn || false,
    userId: user?.id || null,
    userFullName: user ? `${user.firstName} ${user.lastName}` : null,
    isAdmin,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
