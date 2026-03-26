"use client";

import {
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCards } from "@/components/analytics/StatCards";
import { CategoryChart } from "@/components/analytics/CategoryChart";
import { MonthlyChart } from "@/components/analytics/MonthlyChart";
import { IncomeExpenseBarChart } from "@/components/analytics/IncomeExpenseBarChart";

type Preset = "month" | "3m" | "6m" | "year" | "custom";

type StatsResponse = {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  byCategory: { category: string; amount: number; type: string }[];
  byMonth: { month: string; income: number; expense: number }[];
  transactionCount: number;
};

function rangeForPreset(preset: Preset): { from: Date; to: Date } {
  const now = new Date();
  const to = endOfDay(now);
  switch (preset) {
    case "month":
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case "3m":
      return { from: startOfDay(startOfMonth(subMonths(now, 2))), to };
    case "6m":
      return { from: startOfDay(startOfMonth(subMonths(now, 5))), to };
    case "year":
      return { from: startOfYear(now), to: endOfYear(now) };
    default:
      return { from: startOfMonth(now), to: endOfMonth(now) };
  }
}

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

function formatMonthLabel(key: string): string {
  const [y, m] = key.split("-");
  const short = monthRu[m ?? ""] ?? m;
  return `${short} ${y?.slice(2) ?? ""}`.trim();
}

export function AnalyticsView() {
  const [preset, setPreset] = useState<Preset>("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { from, to } = useMemo(() => {
    if (preset === "custom" && customFrom && customTo) {
      const f = startOfDay(new Date(customFrom));
      const t = endOfDay(new Date(customTo));
      return { from: f, to: t };
    }
    return rangeForPreset(preset === "custom" ? "month" : preset);
  }, [preset, customFrom, customTo]);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    p.set("from", from.toISOString());
    p.set("to", to.toISOString());
    return p.toString();
  }, [from, to]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stats?${query}`);
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        const j: unknown = await res.json().catch(() => ({}));
        const msg =
          typeof j === "object" &&
          j !== null &&
          "error" in j &&
          typeof (j as { error: unknown }).error === "string"
            ? (j as { error: string }).error
            : "Не удалось загрузить";
        setError(msg);
        setStats(null);
        return;
      }
      setStats((await res.json()) as StatsResponse);
    } catch {
      setError("Ошибка сети");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (preset === "custom" && (!customFrom || !customTo)) {
      setLoading(false);
      return;
    }
    fetchStats();
  }, [fetchStats, preset, customFrom, customTo]);

  useEffect(() => {
    const onChanged = () => fetchStats();
    window.addEventListener("fintrack-transactions-changed", onChanged);
    return () =>
      window.removeEventListener("fintrack-transactions-changed", onChanged);
  }, [fetchStats]);

  const barData = useMemo(
    () =>
      (stats?.byMonth ?? []).map((d) => ({
        ...d,
        label: formatMonthLabel(d.month),
      })),
    [stats]
  );

  const hasChartData =
    stats &&
    (stats.byMonth.some((m) => m.income > 0 || m.expense > 0) ||
      stats.byCategory.some((c) => c.amount > 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <p className="section-label">Период</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["month", "Текущий месяц"],
              ["3m", "Последние 3 месяца"],
              ["6m", "Последние 6 месяцев"],
              ["year", "Год"],
              ["custom", "Произвольный"],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={preset === key ? "default" : "outline"}
              onClick={() => {
                if (key === "custom") {
                  const now = new Date();
                  setCustomFrom(format(startOfMonth(now), "yyyy-MM-dd"));
                  setCustomTo(format(endOfMonth(now), "yyyy-MM-dd"));
                }
                setPreset(key);
              }}
            >
              {label}
            </Button>
          ))}
        </div>
        {preset === "custom" ? (
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label htmlFor="a-from">С</Label>
              <Input
                id="a-from"
                type="date"
                className="h-9 w-[160px]"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="a-to">По</Label>
              <Input
                id="a-to"
                type="date"
                className="h-9 w-[160px]"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-[320px] w-full" />
        </div>
      ) : !stats ? null : !hasChartData ? (
        <p className="text-center text-muted-foreground">
          Нет данных за выбранный период. Добавьте транзакции.
        </p>
      ) : (
        <>
          <StatCards
            balance={stats.balance}
            totalIncome={stats.totalIncome}
            totalExpense={stats.totalExpense}
            transactionCount={stats.transactionCount}
          />
          <div className="grid gap-6 lg:grid-cols-1">
            <MonthlyChart data={stats.byMonth} />
            <div className="grid gap-6 xl:grid-cols-2">
              <CategoryChart data={stats.byCategory} />
              <IncomeExpenseBarChart data={barData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
