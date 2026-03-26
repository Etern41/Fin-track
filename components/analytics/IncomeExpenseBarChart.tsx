"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { month: string; income: number; expense: number; label: string };

type Props = {
  data: Point[];
};

export function IncomeExpenseBarChart({ data }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 card-shadow">
      <p className="section-label mb-3">Доходы и расходы по месяцам</p>
      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
              interval={data.length > 8 ? "preserveStartEnd" : 0}
              angle={data.length > 12 ? -35 : 0}
              textAnchor={data.length > 12 ? "end" : "middle"}
              height={data.length > 12 ? 56 : undefined}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) =>
                `${Number(v).toLocaleString("ru-RU", { maximumFractionDigits: 0 })}`
              }
            />
            <Tooltip
              formatter={(value) =>
                `${Number(value ?? 0).toLocaleString("ru-RU")} ₽`
              }
            />
            <Legend />
            <Bar dataKey="income" name="Доходы" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Расходы" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
