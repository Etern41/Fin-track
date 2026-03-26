"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { month: string; income: number; expense: number };

type Props = {
  data: Point[];
};

const monthRu: Record<string, string> = {
  "01": "янв",
  "02": "фев",
  "03": "мар",
  "04": "апр",
  "05": "май",
  "06": "июн",
  "07": "июл",
  "08": "авг",
  "09": "сен",
  "10": "окт",
  "11": "ноя",
  "12": "дек",
};

function formatMonthLabel(key: string, useFullYear: boolean): string {
  const [y, m] = key.split("-");
  const short = monthRu[m ?? ""] ?? m;
  const yearPart = useFullYear ? y : y?.slice(2) ?? "";
  return `${short} ${yearPart}`.trim();
}

export function MonthlyChart({ data }: Props) {
  const years = new Set(data.map((d) => d.month.split("-")[0]));
  const useFullYear = years.size > 1;
  const chartData = data.map((d) => ({
    ...d,
    label: formatMonthLabel(d.month, useFullYear),
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-3 sm:p-4 card-shadow">
      <p className="section-label mb-3">Динамика по месяцам</p>
      <div className="h-[240px] w-full min-w-0 sm:h-[300px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
              interval={chartData.length > 8 ? "preserveStartEnd" : 0}
              angle={chartData.length > 12 ? -35 : 0}
              textAnchor={chartData.length > 12 ? "end" : "middle"}
              height={chartData.length > 12 ? 56 : undefined}
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
            <Line
              type="monotone"
              dataKey="income"
              name="Доходы"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Расходы"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
