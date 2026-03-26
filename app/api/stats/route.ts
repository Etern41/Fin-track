import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/api-auth";
import type { Prisma } from "@prisma/client";

function monthKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** Все месяцы от календарного начала `from` до календарного `to` включительно. */
function enumerateMonthKeysInRange(from: Date, to: Date): string[] {
  const start = new Date(from.getFullYear(), from.getMonth(), 1);
  const end = new Date(to.getFullYear(), to.getMonth(), 1);
  if (start > end) {
    return [monthKey(from)];
  }
  const keys: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    keys.push(monthKey(cur));
    cur.setMonth(cur.getMonth() + 1);
  }
  return keys;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export async function GET(request: Request) {
  const authResult = await requireUserId();
  if ("response" in authResult) return authResult.response;

  const { searchParams } = new URL(request.url);
  const now = new Date();
  let from = searchParams.get("from")
    ? new Date(searchParams.get("from")!)
    : startOfMonth(now);
  let to = searchParams.get("to")
    ? new Date(searchParams.get("to")!)
    : endOfMonth(now);

  if (Number.isNaN(from.getTime())) from = startOfMonth(now);
  if (Number.isNaN(to.getTime())) to = endOfMonth(now);

  const where: Prisma.TransactionWhereInput = {
    userId: authResult.userId,
    date: { gte: from, lte: to },
  };

  const txs = await prisma.transaction.findMany({
    where,
    select: {
      type: true,
      amount: true,
      category: true,
      date: true,
    },
  });

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryMap = new Map<
    string,
    { amount: number; type: "INCOME" | "EXPENSE" }
  >();
  const monthMap = new Map<string, { income: number; expense: number }>();

  for (const t of txs) {
    if (t.type === "INCOME") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }

    const ck = `${t.category}__${t.type}`;
    const prev = categoryMap.get(ck);
    if (prev) {
      prev.amount += t.amount;
    } else {
      categoryMap.set(ck, { amount: t.amount, type: t.type });
    }

    const mk = monthKey(t.date);
    const mp = monthMap.get(mk) ?? { income: 0, expense: 0 };
    if (t.type === "INCOME") mp.income += t.amount;
    else mp.expense += t.amount;
    monthMap.set(mk, mp);
  }

  const balance = totalIncome - totalExpense;

  const byCategory = Array.from(categoryMap.entries()).map(([key, v]) => {
    const category = key.split("__")[0] ?? key;
    return {
      category,
      amount: v.amount,
      type: v.type,
    };
  });

  const monthKeys = enumerateMonthKeysInRange(from, to);
  const byMonth = monthKeys.map((month) => {
    const v = monthMap.get(month) ?? { income: 0, expense: 0 };
    return {
      month,
      income: v.income,
      expense: v.expense,
    };
  });

  return NextResponse.json({
    balance,
    totalIncome,
    totalExpense,
    byCategory,
    byMonth,
    transactionCount: txs.length,
  });
}
