import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import GoogleAuthButton from "./GoogleAuthButton";
type LoginFormProps = {
  onSuccess: () => void;
};
export default function LoginForm({
  onSuccess
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validate = () => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email address",
        variant: "destructive"
      });
      return false;
    }
    if (password.length < 8) {
      toast({
        title: "Password must be at least 8 characters",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      toast({
        title: error.message,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    toast({
      title: "Logged in successfully!"
    });
    onSuccess();
    // Leave navigation to the parent component or hooks
    setLoading(false);
  };
  return <div className="space-y-4">
      <form onSubmit={handleLogin} className="space-y-4">
        <Input type="email" placeholder="Email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
        <Input type="password" placeholder="Password" minLength={8} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
        <Button type="submit" disabled={loading} className="w-full bg-pink-500 hover:bg-pink-400 rounded font-medium">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Login
        </Button>
      </form>
      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-muted-foreground/30" />
        <span className="text-muted-foreground text-xs">OR</span>
        <div className="h-px flex-1 bg-muted-foreground/30" />
      </div>
      <GoogleAuthButton disabled={loading} />
    </div>;
}