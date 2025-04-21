
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Google } from "lucide-react";

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!validateEmail(email)) {
      toast({ title: "Invalid email address", variant: "destructive" });
      return false;
    }
    if (password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    if (tab === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      toast({ title: "Logged in successfully!" });
      navigate("/");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({ title: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      toast({ title: "Sign up successful! Please check your email to confirm." });
      setTab("login");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) toast({ title: error.message, variant: "destructive" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg shadow-lg p-8 bg-card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome to Daily Expense Pilot</h1>
        </div>
        <Tabs value={tab} onValueChange={v => setTab(v as any)} className="mb-6">
          <TabsList className="mb-3 w-full">
            <TabsTrigger value="login" className="w-1/2">Login</TabsTrigger>
            <TabsTrigger value="signup" className="w-1/2">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleAuth} className="space-y-4">
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
                placeholder="Password"
                minLength={8}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <Button className="w-full" type="submit" loading={loading}>Login</Button>
            </form>
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-muted-foreground/30" />
              <span className="text-muted-foreground text-xs">OR</span>
              <div className="h-px flex-1 bg-muted-foreground/30" />
            </div>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              disabled={loading}
              onClick={handleGoogle}
            >
              <Google className="w-5 h-5 mr-2" /> Sign in with Google
            </Button>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleAuth} className="space-y-4">
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
              <Button className="w-full" type="submit" loading={loading}>Sign Up</Button>
            </form>
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-muted-foreground/30" />
              <span className="text-muted-foreground text-xs">OR</span>
              <div className="h-px flex-1 bg-muted-foreground/30" />
            </div>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              disabled={loading}
              onClick={handleGoogle}
            >
              <Google className="w-5 h-5 mr-2" /> Sign up with Google
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
