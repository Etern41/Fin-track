import { cn } from "@/lib/utils";

type Props = {
  balance: number;
  className?: string;
};

/** Одна карточка баланса (при необходимости отдельно от сетки StatCards). */
export function BalanceCard({ balance, className }: Props) {
  const balanceClass = balance >= 0 ? "amount-income" : "amount-expense";
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 card-shadow",
        className
      )}
    >
      <p className="section-label mb-1">Баланс</p>
      <p className={cn("text-2xl font-semibold tabular-nums", balanceClass)}>
        {balance.toLocaleString("ru-RU", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        ₽
      </p>
    </div>
  );
}
