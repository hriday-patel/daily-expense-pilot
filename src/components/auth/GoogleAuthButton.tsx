
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type GoogleAuthButtonProps = {
  isSignUp?: boolean;
  disabled?: boolean;
};

export default function GoogleAuthButton({ isSignUp = false, disabled = false }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({ 
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            // Force a fresh login every time to ensure account selection
            prompt: 'select_account',
            // Request offline access to get refresh token
            access_type: 'offline',
            // Add response type to ensure we get both ID and access tokens
            response_type: 'code',
            // Prevent caching issues with a unique nonce
            nonce: Math.random().toString(36).substring(2, 15)
          }
        }
      });
      
      if (error) {
        console.error("Google auth error:", error);
        toast({ 
          title: "Authentication failed", 
          description: error.message, 
          variant: "destructive" 
        });
      } else if (!data.url) {
        toast({ 
          title: "Authentication failed", 
          description: "No redirect URL returned from authentication provider.", 
          variant: "destructive" 
        });
      }
    } catch (e) {
      console.error("Google auth error:", e);
      toast({ 
        title: "Authentication failed", 
        description: "Could not connect to Google. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      disabled={disabled || isLoading}
      onClick={handleGoogleAuth}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
        <path fill="none" d="M1 1h22v22H1z" />
      </svg>
      {isLoading ? "Connecting..." : isSignUp ? "Sign up with Google" : "Sign in with Google"}
    </Button>
  );
}
