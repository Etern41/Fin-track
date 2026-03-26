import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/api-auth";
import { isValidCategoryForType } from "@/lib/categories";
import type { Prisma, TxType } from "@prisma/client";

const DEFAULT_LIMIT = 50;

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function GET(request: Request) {
  const authResult = await requireUserId();
  if ("response" in authResult) return authResult.response;

  const { searchParams } = new URL(request.url);
  const from = parseDate(searchParams.get("from"));
  const to = parseDate(searchParams.get("to"));
  const category = searchParams.get("category") ?? undefined;
  const typeParam = searchParams.get("type");
  const type: TxType | undefined =
    typeParam === "INCOME" || typeParam === "EXPENSE"
      ? typeParam
      : undefined;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT)
  );

  const where: Prisma.TransactionWhereInput = {
    userId: authResult.userId,
    ...(from || to
      ? {
          date: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        }
      : {}),
    ...(category ? { category } : {}),
    ...(type ? { type } : {}),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return NextResponse.json({
    transactions,
    total,
    page,
    totalPages,
  });
}

type PostBody = {
  type?: unknown;
  amount?: unknown;
  category?: unknown;
  description?: unknown;
  date?: unknown;
};

export async function POST(request: Request) {
  const authResult = await requireUserId();
  if ("response" in authResult) return authResult.response;

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const type = body.type === "INCOME" || body.type === "EXPENSE" ? body.type : null;
  const amount =
    typeof body.amount === "number"
      ? body.amount
      : typeof body.amount === "string"
        ? Number(body.amount)
        : NaN;
  const category =
    typeof body.category === "string" ? body.category.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.slice(0, 200) : null;
  const dateStr = typeof body.date === "string" ? body.date : "";

  if (!type) {
    return NextResponse.json({ error: "Укажите тип операции" }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Сумма должна быть больше нуля" },
      { status: 400 }
    );
  }
  if (!isValidCategoryForType(category, type)) {
    return NextResponse.json({ error: "Недопустимая категория" }, { status: 400 });
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Некорректная дата" }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: authResult.userId,
      type,
      amount,
      category,
      description: description || null,
      date,
    },
  });

  return NextResponse.json({ transaction });
}
