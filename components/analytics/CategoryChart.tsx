"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORY_COLORS } from "@/lib/categories";

type Item = { category: string; amount: number; type: string };

type Props = {
  data: Item[];
};

export function CategoryChart({ data }: Props) {
  const expenses = data.filter((d) => d.type === "EXPENSE" && d.amount > 0);

  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 card-shadow">
        <p className="section-label mb-3">Расходы по категориям</p>
        <p className="text-sm text-muted-foreground">Нет данных о расходах</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 card-shadow">
      <p className="section-label mb-3">Расходы по категориям</p>
      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenses}
              dataKey="amount"
              nameKey="category"
              cx="40%"
              cy="50%"
              outerRadius={100}
            >
              {expenses.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category] ?? "#6B7280"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${Number(value ?? 0).toLocaleString("ru-RU")} ₽`,
                String(name ?? ""),
              ]}
            />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
