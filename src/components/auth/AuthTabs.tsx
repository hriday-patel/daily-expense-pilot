
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
    <Tabs 
      value={tab} 
      onValueChange={v => setTab(v as any)} 
      className="mb-6 transition-all duration-2000 ease-in-out"
    >
      <TabsList className="mb-3 w-full">
        <TabsTrigger value="login" className="w-1/2" disabled={disabled}>Login</TabsTrigger>
        <TabsTrigger value="signup" className="w-1/2" disabled={disabled}>Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent 
        value="login" 
        className="animate-enter transition-all duration-2000 ease-in-out"
      >
        <LoginForm onSuccess={onAuthSuccess} />
      </TabsContent>
      <TabsContent 
        value="signup" 
        className="animate-enter transition-all duration-2000 ease-in-out"
      >
        <SignUpForm onSuccess={onSignUpSuccess} />
      </TabsContent>
    </Tabs>
  );
}
