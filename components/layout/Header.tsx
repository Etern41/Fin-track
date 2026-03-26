"use client";

import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type HeaderProps = {
  title: string;
  onAddClick?: () => void;
  onMenuClick?: () => void;
};

export function Header({ title, onAddClick, onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-[52px] shrink-0 items-center gap-2 border-b border-border bg-card px-3 sm:px-4">
      {onMenuClick ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 md:hidden"
          aria-label="Открыть меню"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>
      ) : null}
      <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-foreground sm:text-xl">
        {title}
      </h1>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <Button
          type="button"
          className="rounded-md bg-primary px-2.5 text-primary-foreground hover:bg-primary/90 sm:px-4"
          onClick={onAddClick}
          aria-label="Добавить транзакцию"
        >
          <Plus className="size-4 sm:mr-1" />
          <span className="hidden sm:inline">Добавить</span>
        </Button>
      </div>
    </header>
  );
}
