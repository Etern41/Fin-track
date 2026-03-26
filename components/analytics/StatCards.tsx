import { cn } from "@/lib/utils";

type Props = {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  className?: string;
};

export function StatCards({
  balance,
  totalIncome,
  totalExpense,
  transactionCount,
  className,
}: Props) {
  const balanceClass =
    balance >= 0 ? "amount-income text-2xl" : "amount-expense text-2xl";

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      <div className="rounded-lg border border-border bg-card p-4 card-shadow">
        <p className="section-label mb-1">Баланс</p>
        <p className={cn("font-semibold tabular-nums", balanceClass)}>
          {balance.toLocaleString("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ₽
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 card-shadow">
        <p className="section-label mb-1">Доходы</p>
        <p className="text-2xl font-semibold tabular-nums amount-income">
          {totalIncome.toLocaleString("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ₽
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 card-shadow">
        <p className="section-label mb-1">Расходы</p>
        <p className="text-2xl font-semibold tabular-nums amount-expense">
          {totalExpense.toLocaleString("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ₽
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 card-shadow">
        <p className="section-label mb-1">Транзакций</p>
        <p className="text-2xl font-semibold text-foreground tabular-nums">
          {transactionCount}
        </p>
      </div>
    </div>
  );
}
