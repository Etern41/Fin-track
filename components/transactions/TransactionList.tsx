"use client";

import { TransactionRow } from "@/components/transactions/TransactionRow";
import type { TransactionRowData } from "@/types/transaction";

type Props = {
  rows: TransactionRowData[];
  onEdit: (row: TransactionRowData) => void;
  onDelete: (row: TransactionRowData) => void;
};

export function TransactionList({ rows, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card card-shadow">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="section-label px-3 py-2">Дата</th>
            <th className="section-label px-3 py-2">Тип</th>
            <th className="section-label px-3 py-2">Категория</th>
            <th className="section-label px-3 py-2">Описание</th>
            <th className="section-label px-3 py-2">Сумма</th>
            <th className="section-label px-3 py-2 text-right">Действия</th>
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
  );
}
