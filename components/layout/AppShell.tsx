import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: ReactNode;
  /** When true, render the Quran sidebar on lg+ screens */
  withSidebar?: boolean;
}

export function AppShell({ children, withSidebar = false }: AppShellProps) {
  if (!withSidebar) return <div className="container-page py-8 md:py-12">{children}</div>;
  return (
    <div className="container-page grid gap-8 py-8 md:py-12 lg:grid-cols-[220px_1fr] lg:gap-10">
      <Sidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
