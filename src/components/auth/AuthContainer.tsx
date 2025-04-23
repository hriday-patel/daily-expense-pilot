import ThemeToggle from "@/components/ThemeToggle";
import AuthTabs from "./AuthTabs";
import AuthHeader from "./AuthHeader";
type AuthContainerProps = {
  onAuthSuccess: () => void;
  onSignUpSuccess: () => void;
  authInProgress: boolean;
};
export default function AuthContainer({
  onAuthSuccess,
  onSignUpSuccess,
  authInProgress
}: AuthContainerProps) {
  return <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md shadow-lg p-8 glass-morphism bg-slate-100 rounded-3xl">
        <AuthHeader />
        <AuthTabs onAuthSuccess={onAuthSuccess} onSignUpSuccess={onSignUpSuccess} disabled={authInProgress} />
      </div>
    </div>;
}