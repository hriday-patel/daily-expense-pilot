
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoading from "@/components/auth/AuthLoading";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL parameters
        const queryParams = new URLSearchParams(window.location.search);
        const urlError = queryParams.get('error');
        const errorDescription = queryParams.get('error_description');
        
        if (urlError) {
          throw new Error(errorDescription || `Authentication error: ${urlError}`);
        }
        
        // Get session after OAuth redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          toast({ 
            title: "Successfully signed in!", 
            description: `Signed in as ${session.user.email}`
          });
          navigate("/", { replace: true });
          return;
        }
        
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
        
        setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 2000);
      }
    };
    
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
