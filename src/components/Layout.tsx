import React from 'react';
import BottomNav from './BottomNav';
import { useRamadanPhase } from '../hooks/useRamadanPhase';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { phase } = useRamadanPhase();

  const bgClass =
    phase === 'laylat-qadr'
      ? 'bg-[#FFFDF5] dark:bg-[#0D0A14]'
      : phase === 'last-ten'
        ? 'bg-[#F0F0FF] dark:bg-[#0A0A1A]'
        : 'bg-[#F8FAF8] dark:bg-[#0A0F0A]';

  return (
    <div className={`min-h-dvh ${bgClass} overflow-x-hidden transition-colors duration-500`}>
      <main className="w-full max-w-[480px] mx-auto px-4 pb-[84px] pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
