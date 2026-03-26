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
    balance >= 0
      ? "amount-income text-xl sm:text-2xl"
      : "amount-expense text-xl sm:text-2xl";

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      <div className="rounded-lg border border-border bg-card p-3 sm:p-4 card-shadow">
        <p className="section-label mb-1">Баланс</p>
        <p className={cn("break-words font-semibold tabular-nums", balanceClass)}>
          {balance.toLocaleString("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ₽
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-3 sm:p-4 card-shadow">
        <p className="section-label mb-1">Доходы</p>
        <p className="break-words text-xl font-semibold tabular-nums amount-income sm:text-2xl">
          {totalIncome.toLocaleString("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ₽
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-3 sm:p-4 card-shadow">
        <p className="section-label mb-1">Расходы</p>
        <p className="break-words text-xl font-semibold tabular-nums amount-expense sm:text-2xl">
          {totalExpense.toLocaleString("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ₽
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-3 sm:p-4 card-shadow">
        <p className="section-label mb-1">Транзакций</p>
        <p className="text-xl font-semibold text-foreground tabular-nums sm:text-2xl">
          {transactionCount}
        </p>
      </div>
    </div>
  );
}
