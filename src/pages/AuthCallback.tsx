
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoading from "@/components/auth/AuthLoading";
import useSession from "@/hooks/useSession";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { session } = useSession();
  
  // Handle OAuth callback and session check
  useEffect(() => {
    // Process the URL hash if it exists (needed for some OAuth providers)
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      // If there are tokens in the URL, we need to manually set the session
      if (accessToken && refreshToken) {
        try {
          // Exchange the tokens for a session
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) throw error;
        } catch (error) {
          console.error("Error setting session:", error);
          toast({ 
            title: "Authentication failed", 
            description: "Could not complete the authentication. Please try again.", 
            variant: "destructive" 
          });
          navigate("/auth", { replace: true });
          return;
        }
      }
    };
    
    // Process URL hash if needed
    handleAuthCallback();
    
    // If session is available, authentication was successful
    if (session) {
      toast({ title: "You're now signed in!" });
      navigate("/", { replace: true });
    } 
    
    // Set a timeout to redirect to auth page if session doesn't load
    const timeoutId = setTimeout(() => {
      if (!session) {
        toast({ 
          title: "Authentication failed", 
          description: "Please try logging in again", 
          variant: "destructive" 
        });
        navigate("/auth", { replace: true });
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [session, navigate]);
  
  return <AuthLoading message="Completing authentication..." />;
}
