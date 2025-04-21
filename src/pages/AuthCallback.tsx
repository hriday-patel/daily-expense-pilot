
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoading from "@/components/auth/AuthLoading";
import useSession from "@/hooks/useSession";
import { toast } from "@/components/ui/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { session } = useSession();
  
  // Handle OAuth callback and session check
  useEffect(() => {
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
