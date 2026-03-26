"use client";

import { Download } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmDialog } from "@/components/transactions/DeleteConfirmDialog";
import {
  FiltersBar,
  type FiltersState,
} from "@/components/transactions/FiltersBar";
import { TransactionList } from "@/components/transactions/TransactionList";
import { useEditTransaction } from "@/components/transactions/edit-transaction-context";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { TransactionRowData } from "@/types/transaction";

type ListResponse = {
  transactions: {
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    category: string;
    description: string | null;
    date: string;
  }[];
  total: number;
  page: number;
  totalPages: number;
};

function mapRow(t: ListResponse["transactions"][number]): TransactionRowData {
  return {
    id: t.id,
    type: t.type,
    amount: t.amount,
    category: t.category,
    description: t.description,
    date: t.date,
  };
}

function EmptyIllustration() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      className="mx-auto text-muted-foreground"
      aria-hidden
    >
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 34h24M20 26h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TransactionsView() {
  const onEdit = useEditTransaction();
  const [filters, setFilters] = useState<FiltersState>({
    from: "",
    to: "",
    category: "",
    type: "ALL",
    search: "",
  });
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ListResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TransactionRowData | null>(
    null
  );
  const [deleteOpen, setDeleteOpen] = useState(false);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.from) p.set("from", new Date(filters.from).toISOString());
    if (filters.to) {
      const end = new Date(filters.to);
      end.setHours(23, 59, 59, 999);
      p.set("to", end.toISOString());
    }
    if (filters.category) p.set("category", filters.category);
    if (filters.type !== "ALL") p.set("type", filters.type);
    p.set("page", String(page));
    p.set("limit", "50");
    return p.toString();
  }, [filters.from, filters.to, filters.category, filters.type, page]);

  const exportHref = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.from) p.set("from", new Date(filters.from).toISOString());
    if (filters.to) {
      const end = new Date(filters.to);
      end.setHours(23, 59, 59, 999);
      p.set("to", end.toISOString());
    }
    if (filters.category) p.set("category", filters.category);
    if (filters.type !== "ALL") p.set("type", filters.type);
    return `/api/export?${p.toString()}`;
  }, [filters.from, filters.to, filters.category, filters.type]);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/transactions?${queryString}`);
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        const j: unknown = await res.json().catch(() => ({}));
        const msg =
          typeof j === "object" &&
          j !== null &&
          "error" in j &&
          typeof (j as { error: unknown }).error === "string"
            ? (j as { error: string }).error
            : "Не удалось загрузить";
        setError(msg);
        setData(null);
        return;
      }
      const json = (await res.json()) as ListResponse;
      setData(json);
    } catch {
      setError("Ошибка сети");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    const onChanged = () => {
      fetchList();
    };
    window.addEventListener("fintrack-transactions-changed", onChanged);
    return () =>
      window.removeEventListener("fintrack-transactions-changed", onChanged);
  }, [fetchList]);

  useEffect(() => {
    setPage(1);
  }, [filters.from, filters.to, filters.category, filters.type]);

  const filteredRows = useMemo(() => {
    if (!data?.transactions) return [];
    const q = debouncedSearch.trim().toLowerCase();
    const rows = data.transactions.map(mapRow);
    if (!q) return rows;
    return rows.filter((r) =>
      (r.description ?? "").toLowerCase().includes(q)
    );
  }, [data, debouncedSearch]);

  const total = data?.total ?? 0;
  const startIdx = total === 0 ? 0 : (page - 1) * 50 + 1;
  const endIdx = total === 0 ? 0 : Math.min(page * 50, total);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
          <a href={exportHref} download>
            <Download className="mr-2 size-4" />
            Экспорт CSV
          </a>
        </Button>
      </div>

      <FiltersBar values={filters} onChange={setFilters} />

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="space-y-2 rounded-lg border border-border p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : !data || total === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 card-shadow">
          <EmptyIllustration />
          <p className="mt-4 text-muted-foreground">
            Нет транзакций по выбранным фильтрам
          </p>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 card-shadow">
          <EmptyIllustration />
          <p className="mt-4 text-muted-foreground">
            Нет совпадений по описанию
          </p>
        </div>
      ) : (
        <>
          <TransactionList
            rows={filteredRows}
            onEdit={onEdit}
            onDelete={(row) => {
              setDeleteTarget(row);
              setDeleteOpen(true);
            }}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              Показано {startIdx}–{endIdx} из {total}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Назад
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= (data.totalPages ?? 1)}
                onClick={() =>
                  setPage((p) =>
                    Math.min(data.totalPages ?? 1, p + 1)
                  )
                }
              >
                Вперёд
              </Button>
            </div>
          </div>
        </>
      )}

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        transaction={deleteTarget}
        onDeleted={() => {
          fetchList();
        }}
      />
    </div>
  );
}
