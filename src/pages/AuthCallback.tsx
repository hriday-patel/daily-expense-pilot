
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoading from "@/components/auth/AuthLoading";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  // Handle OAuth callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL parameters - common in OAuth flows
        const queryParams = new URLSearchParams(window.location.search);
        const urlError = queryParams.get('error');
        const errorDescription = queryParams.get('error_description');
        
        if (urlError) {
          throw new Error(errorDescription || `Authentication error: ${urlError}`);
        }
        
        // Handle hash fragment that might contain tokens
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          // If we have tokens in the URL, manually set the session
          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) throw error;
          }
        }

        // Get session - this should work after OAuth redirect
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session) {
          toast({ title: "Successfully signed in!" });
          navigate("/", { replace: true });
          return;
        }
        
        // If we reach here with no session, something went wrong
        throw new Error("No session found after authentication. Please try again.");
      } catch (err) {
        console.error("Auth callback error:", err);
        const errorMessage = err instanceof Error ? err.message : "Authentication failed";
        setError(errorMessage);
        toast({ 
          title: "Authentication failed", 
          description: errorMessage, 
          variant: "destructive" 
        });
        
        // Short delay before redirecting to auth page
        setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 2000);
      }
    };
    
    // Process the authentication callback
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <AuthLoading 
      message={
        error 
          ? `Authentication failed: ${error}. Redirecting...` 
          : "Completing authentication..."
      } 
    />
  );
}
