
import { ReactNode } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";
import useSession from "@/hooks/useSession";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { user } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Expense Pilot</h1>
          <p className="text-sm opacity-90">Track, manage, and analyze your expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && <LogoutButton />}
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4">{children}</main>
      <footer className="bg-gray-100 py-4 px-6 text-center text-sm text-gray-600 dark:bg-background/70 dark:text-gray-400">
        <p>© 2024 Daily Expense Pilot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
