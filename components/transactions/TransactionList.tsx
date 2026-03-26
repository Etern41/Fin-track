"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAmount } from "@/lib/utils";
import type { TransactionRowData } from "@/types/transaction";

type ListProps = {
  rows: TransactionRowData[];
  onEdit: (row: TransactionRowData) => void;
  onDelete: (row: TransactionRowData) => void;
};

type RowProps = {
  row: TransactionRowData;
  onEdit: (row: TransactionRowData) => void;
  onDelete: (row: TransactionRowData) => void;
};

function TransactionCard({ row, onEdit, onDelete }: RowProps) {
  const desc = row.description ?? "";
  return (
    <div className="rounded-lg border border-border bg-card p-3 card-shadow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {format(new Date(row.date), "dd.MM.yyyy", { locale: ru })}
            </span>
            <Badge
              variant="secondary"
              className={
                row.type === "INCOME"
                  ? "border-transparent bg-primary/15 text-primary"
                  : "border-transparent bg-destructive/15 text-destructive"
              }
            >
              {row.type === "INCOME" ? "Доход" : "Расход"}
            </Badge>
          </div>
          <p className="text-sm font-medium text-foreground">{row.category}</p>
          <p className="break-words text-sm text-muted-foreground">
            {desc || "—"}
          </p>
        </div>
        <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-border pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          <p
            className={`text-lg font-semibold tabular-nums sm:text-right ${
              row.type === "INCOME" ? "amount-income" : "amount-expense"
            }`}
          >
            {formatAmount(row.amount, row.type)}
          </p>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              aria-label="Редактировать"
              onClick={() => onEdit(row)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 text-destructive hover:text-destructive"
              aria-label="Удалить"
              onClick={() => onDelete(row)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TransactionRow({ row, onEdit, onDelete }: RowProps) {
  const desc = row.description ?? "";
  const truncated = desc.length > 40 ? `${desc.slice(0, 40)}…` : desc;

  return (
    <tr className="border-b border-border">
      <td className="px-3 py-2 text-sm text-foreground">
        {format(new Date(row.date), "dd.MM.yyyy", { locale: ru })}
      </td>
      <td className="px-3 py-2">
        <Badge
          variant="secondary"
          className={
            row.type === "INCOME"
              ? "border-transparent bg-primary/15 text-primary"
              : "border-transparent bg-destructive/15 text-destructive"
          }
        >
          {row.type === "INCOME" ? "Доход" : "Расход"}
        </Badge>
      </td>
      <td className="px-3 py-2 text-sm text-foreground">{row.category}</td>
      <td
        className="max-w-[200px] truncate px-3 py-2 text-sm text-muted-foreground"
        title={desc || undefined}
      >
        {truncated || "—"}
      </td>
      <td
        className={`px-3 py-2 text-base font-semibold tabular-nums ${
          row.type === "INCOME" ? "amount-income" : "amount-expense"
        }`}
      >
        {formatAmount(row.amount, row.type)}
      </td>
      <td className="px-3 py-2 text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Редактировать"
          onClick={() => onEdit(row)}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive"
          aria-label="Удалить"
          onClick={() => onDelete(row)}
        >
          <Trash2 className="size-4" />
        </Button>
      </td>
    </tr>
  );
}

export function TransactionList({ rows, onEdit, onDelete }: ListProps) {
  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <TransactionCard
            key={row.id}
            row={row}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card md:block card-shadow">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="section-label px-3 py-2">Дата</th>
              <th className="section-label px-3 py-2">Тип</th>
              <th className="section-label px-3 py-2">Категория</th>
              <th className="section-label px-3 py-2">Описание</th>
              <th className="section-label px-3 py-2">Сумма</th>
              <th className="section-label px-3 py-2 text-right">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <TransactionRow
                key={row.id}
                row={row}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
