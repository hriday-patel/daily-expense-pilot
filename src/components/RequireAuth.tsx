
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSession from "@/hooks/useSession";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session === null) {
      // Not logged in, redirect to /auth
      navigate("/auth", { replace: true });
    }
  }, [session, navigate]);

  // If session not checked yet or null, don't render children
  if (session === null) return null;

  return <>{children}</>;
}
