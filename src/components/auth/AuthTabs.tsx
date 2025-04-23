
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

type AuthTabsProps = {
  onAuthSuccess: () => void;
  onSignUpSuccess: () => void;
  disabled?: boolean;
};

export default function AuthTabs({
  onAuthSuccess,
  onSignUpSuccess,
  disabled = false,
}: AuthTabsProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <Tabs value={tab} onValueChange={v => setTab(v as any)} className="mb-6">
      <TabsList className="mb-3 w-full">
        <TabsTrigger 
          value="login" 
          className="w-1/2 transition-all duration-700 ease-in-out" 
          disabled={disabled}
        >
          Login
        </TabsTrigger>
        <TabsTrigger 
          value="signup" 
          className="w-1/2 transition-all duration-700 ease-in-out" 
          disabled={disabled}
        >
          Sign Up
        </TabsTrigger>
      </TabsList>
      <div className="relative">
        <TabsContent 
          value="login" 
          className="absolute w-full transition-all duration-700 ease-in-out animate-fade-in"
        >
          <div className="space-y-4">
            <LoginForm onSuccess={onAuthSuccess} />
          </div>
        </TabsContent>
        <TabsContent 
          value="signup" 
          className="absolute w-full transition-all duration-700 ease-in-out animate-fade-in"
        >
          <div className="space-y-4">
            <SignUpForm onSuccess={onSignUpSuccess} />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
