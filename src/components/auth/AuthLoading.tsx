
import { Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

type AuthLoadingProps = {
  message: string;
};

export default function AuthLoading({ message }: AuthLoadingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
      <h2 className="text-lg font-semibold">{message}</h2>
    </div>
  );
}
