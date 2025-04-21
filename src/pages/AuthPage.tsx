
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import useSession from "@/hooks/useSession";
import ThemeToggle from "@/components/ThemeToggle";
import AuthLoading from "@/components/auth/AuthLoading";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const { session } = useSession();
  const [initialLoading, setInitialLoading] = useState(true);
  const [authInProgress, setAuthInProgress] = useState(false);
  
  // Handle navigation after successful auth
  const handleAuthSuccess = () => {
    setAuthInProgress(true);
    // The redirection will be handled by useSession effect
  };
  
  // Check for existing session and handle redirect
  useEffect(() => {
    // Short timeout to allow session to load, avoids flash
    const timer = setTimeout(() => setInitialLoading(false), 500);
    
    // If session exists, navigate to main
    if (session) {
      navigate("/", { replace: true });
    }
    
    return () => clearTimeout(timer);
  }, [session, navigate]);
  
  // Show loading while checking session or during auth process
  if (initialLoading) {
    return <AuthLoading message="Loading..." />;
  }
  
  // Show loading when authentication is in progress
  if (authInProgress) {
    return <AuthLoading message="Authenticating..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-lg shadow-lg p-8 bg-card glass-morphism">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome to Daily Expense Pilot</h1>
        </div>
        <Tabs value={tab} onValueChange={v => setTab(v as any)} className="mb-6">
          <TabsList className="mb-3 w-full">
            <TabsTrigger value="login" className="w-1/2">Login</TabsTrigger>
            <TabsTrigger value="signup" className="w-1/2">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSuccess={handleAuthSuccess} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm onSuccess={() => setTab("login")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
