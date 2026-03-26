import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCards } from "@/components/analytics/StatCards";
import { formatAmount } from "@/lib/utils";
import { relativeTime } from "@/lib/relative-time";
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
      <rect
        x="8"
        y="12"
        width="48"
        height="40"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 24h32M16 32h24M16 40h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const [recent, incomeAgg, expenseAgg, countMonth] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 10,
      }),
      prisma.transaction.aggregate({
        where: { userId, date: { gte: start, lte: end }, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, date: { gte: start, lte: end }, type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
        where: { userId, date: { gte: start, lte: end } },
      }),
    ]);

  const totalIncome = incomeAgg._sum.amount ?? 0;
  const totalExpense = expenseAgg._sum.amount ?? 0;
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <StatCards
        balance={balance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        transactionCount={countMonth}
      />

      <section>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="page-title text-lg sm:text-xl">Последние транзакции</h2>
          <Link
            href="/transactions"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            Все транзакции →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-12 card-shadow">
            <EmptyIllustration />
            <p className="mt-4 text-center text-muted-foreground">
              Нет транзакций. Добавьте первую!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Нажмите «Добавить» в шапке.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 md:hidden">
              {recent.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg border border-border bg-card p-3 card-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {relativeTime(t.date)}
                      </p>
                      <p className="break-words text-sm text-foreground">
                        {t.description ?? "—"}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {t.category}
                      </p>
                    </div>
                    <p
                      className={`shrink-0 text-base font-semibold tabular-nums ${
                        t.type === "INCOME"
                          ? "amount-income"
                          : "amount-expense"
                      }`}
                    >
                      {formatAmount(t.amount, t.type)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto rounded-lg border border-border bg-card md:block card-shadow">
              <table className="w-full min-w-[480px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="section-label px-3 py-2">Дата</th>
                    <th className="section-label px-3 py-2">Описание</th>
                    <th className="section-label px-3 py-2">Категория</th>
                    <th className="section-label px-3 py-2 text-right">
                      Сумма
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => (
                    <tr key={t.id} className="border-b border-border">
                      <td className="px-3 py-2 text-sm text-muted-foreground">
                        {relativeTime(t.date)}
                      </td>
                      <td className="px-3 py-2 text-sm text-foreground">
                        {t.description ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-sm text-foreground">
                        {t.category}
                      </td>
                      <td
                        className={`px-3 py-2 text-right text-base font-semibold tabular-nums ${
                          t.type === "INCOME"
                            ? "amount-income"
                            : "amount-expense"
                        }`}
                      >
                        {formatAmount(t.amount, t.type)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
