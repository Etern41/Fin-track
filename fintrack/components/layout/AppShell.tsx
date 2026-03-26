"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { EditTransactionProvider } from "@/components/transactions/edit-transaction-context";
import type { TransactionRowData } from "@/types/transaction";

const titles: Record<string, string> = {
  "/dashboard": "Дашборд",
  "/transactions": "Транзакции",
  "/analytics": "Аналитика",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const title = titles[pathname ?? ""] ?? "FinTrack";

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<TransactionRowData | null>(null);

  const handleSaved = useCallback(() => {
    router.refresh();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("fintrack-transactions-changed"));
    }
  }, [router]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setCreateOpen(true);
  }, []);

  const openEdit = useCallback((row: TransactionRowData) => {
    setEditing(row);
    setEditOpen(true);
  }, []);

  return (
    <>
      <DashboardShell title={title} onAddClick={openCreate}>
        <EditTransactionProvider onEdit={openEdit}>
          {children}
        </EditTransactionProvider>
      </DashboardShell>
      <TransactionForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSuccess={handleSaved}
      />
      <TransactionForm
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditing(null);
        }}
        mode="edit"
        initialTransaction={editing ?? undefined}
        onSuccess={handleSaved}
      />
    </>
  );
}
