
import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Daily Expense Pilot</h1>
          <p className="text-sm opacity-90">Track, manage, and analyze your expenses</p>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4">
        {children}
      </main>
      
      <footer className="bg-gray-100 py-4 px-6 text-center text-sm text-gray-600">
        <p>© 2024 Daily Expense Pilot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
