
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import GoogleAuthButton from "./GoogleAuthButton";

type SignUpFormProps = {
  onSuccess: () => void;
};

export default function SignUpForm({
  onSuccess
}: SignUpFormProps) {
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email: email // This will be used by the trigger to create the profile
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Sign up successful! Please check your email to confirm."
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSignUp} className="space-y-4">
        <Input 
          type="email" 
          placeholder="Email" 
          autoComplete="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          disabled={loading} 
        />
        <Input 
          type="password" 
          placeholder="Password (min 8 chars)" 
          minLength={8} 
          autoComplete="new-password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          disabled={loading} 
        />
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full rounded bg-blue-700 hover:bg-blue-600 font-medium"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign Up
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-muted-foreground/30" />
        <span className="text-muted-foreground text-xs">OR</span>
        <div className="h-px flex-1 bg-muted-foreground/30" />
      </div>

      <GoogleAuthButton isSignUp disabled={loading} />
    </div>
  );
}
