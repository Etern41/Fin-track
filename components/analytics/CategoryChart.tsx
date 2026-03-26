"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORY_COLORS } from "@/lib/categories";
import { useMediaQuery } from "@/hooks/use-media-query";

type Item = { category: string; amount: number; type: string };

type Props = {
  data: Item[];
};

export function CategoryChart({ data }: Props) {
  const narrow = useMediaQuery("(max-width: 639px)");
  const expenses = data.filter((d) => d.type === "EXPENSE" && d.amount > 0);

  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 sm:p-4 card-shadow">
        <p className="section-label mb-3">Расходы по категориям</p>
        <p className="text-sm text-muted-foreground">Нет данных о расходах</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3 sm:p-4 card-shadow">
      <p className="section-label mb-3">Расходы по категориям</p>
      <div className="h-[min(360px,70vw)] w-full min-w-0 overflow-hidden sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenses}
              dataKey="amount"
              nameKey="category"
              cx={narrow ? "50%" : "40%"}
              cy={narrow ? "42%" : "50%"}
              outerRadius={narrow ? "48%" : 100}
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
            <Legend
              layout={narrow ? "horizontal" : "vertical"}
              align={narrow ? "center" : "right"}
              verticalAlign={narrow ? "bottom" : "middle"}
              wrapperStyle={
                narrow
                  ? { fontSize: "11px", paddingTop: "8px" }
                  : { fontSize: "12px" }
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
