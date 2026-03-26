"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type HeaderProps = {
  title: string;
  onAddClick?: () => void;
};

export function Header({ title, onAddClick }: HeaderProps) {
  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <h1 className="page-title">{title}</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          type="button"
          className="rounded-md bg-primary px-4 text-primary-foreground hover:bg-primary/90"
          onClick={onAddClick}
        >
          <Plus className="mr-1 size-4" />
          Добавить
        </Button>
      </div>
    </header>
  );
}
