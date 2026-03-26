"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

type DashboardShellProps = {
  children: React.ReactNode;
  title: string;
  onAddClick?: () => void;
};

export function DashboardShell({
  children,
  title,
  onAddClick,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-background">
      <Sidebar />
      {mobileNavOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-label="Закрыть меню"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-[min(280px,88vw)] flex-col border-r border-border bg-card text-card-foreground shadow-xl md:hidden"
            aria-modal="true"
            role="dialog"
            aria-label="Навигация"
          >
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <Header
          title={title}
          onAddClick={onAddClick}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
