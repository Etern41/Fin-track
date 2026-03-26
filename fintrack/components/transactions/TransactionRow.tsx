"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAmount } from "@/lib/utils";
import type { TransactionRowData } from "@/types/transaction";

type Props = {
  row: TransactionRowData;
  onEdit: (row: TransactionRowData) => void;
  onDelete: (row: TransactionRowData) => void;
};

export function TransactionRow({ row, onEdit, onDelete }: Props) {
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
        className={`px-3 py-2 text-base font-semibold ${
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
