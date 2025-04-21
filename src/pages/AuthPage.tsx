
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSession from "@/hooks/useSession";
import AuthLoading from "@/components/auth/AuthLoading";
import AuthContainer from "@/components/auth/AuthContainer";

export default function AuthPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [initialLoading, setInitialLoading] = useState(true);
  const [authInProgress, setAuthInProgress] = useState(false);

  // Handle navigation after successful auth
  const handleAuthSuccess = () => {
    setAuthInProgress(true);
    // Redirection is handled by useSession effect
  };

  useEffect(() => {
    // Short timeout to allow session to load, avoids flash
    const timer = setTimeout(() => setInitialLoading(false), 500);

    // If session exists, navigate to main
    if (session) {
      navigate("/", { replace: true });
    }

    return () => clearTimeout(timer);
  }, [session, navigate]);

  // Show loading while checking session
  if (initialLoading) {
    return <AuthLoading message="Loading..." />;
  }

  // Show loading when authentication is in progress
  if (authInProgress) {
    return <AuthLoading message="Authenticating..." />;
  }

  return (
    <AuthContainer
      onAuthSuccess={handleAuthSuccess}
      onSignUpSuccess={() => {}}
      authInProgress={authInProgress}
    />
  );
}
