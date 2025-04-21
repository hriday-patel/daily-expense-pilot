
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSession from "@/hooks/useSession";
import AuthLoading from "@/components/auth/AuthLoading";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Short timeout to avoid unnecessary flashing during quick session check
    const timer = setTimeout(() => setChecking(false), 500);
    
    if (session === null && !checking) {
      // Not logged in, redirect to /auth
      navigate("/auth", { replace: true });
    }
    
    return () => clearTimeout(timer);
  }, [session, navigate, checking]);

  // Show loading while checking session
  if (checking || session === null) {
    return <AuthLoading message="Verifying your session..." />;
  }

  return <>{children}</>;
}
