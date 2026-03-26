"use client";

import { Sidebar } from "@/components/layout/Sidebar";
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
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} onAddClick={onAddClick} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
