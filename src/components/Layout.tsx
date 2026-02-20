import React from 'react';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-dvh bg-[#F8FAF8] dark:bg-[#0A0F0A] overflow-x-hidden">
      <main className="w-full max-w-[480px] mx-auto px-4 pb-[84px] pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
