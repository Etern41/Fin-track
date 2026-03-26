"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "Дашборд", icon: "📊" },
  { href: "/transactions", label: "Транзакции", icon: "💳" },
  { href: "/analytics", label: "Аналитика", icon: "📈" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-border bg-card text-card-foreground">
      <div className="border-b border-border px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <span className="text-xl text-primary" aria-hidden>
            💰
          </span>
          <span className="text-foreground">FinTrack</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "border-l-2 border-primary bg-primary/10 pl-[10px] text-primary"
                  : "border-l-2 border-transparent pl-[10px] hover:bg-muted"
              )}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <div className="mb-2 truncate text-sm font-medium text-foreground">
          {session?.user?.name ?? "Пользователь"}
        </div>
        <div className="mb-3 truncate text-xs text-muted-foreground">
          {session?.user?.email}
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Выйти
        </Button>
      </div>
    </aside>
  );
}
