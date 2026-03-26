import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/api-auth";
import { isValidCategoryForType } from "@/lib/categories";
import type { TxType } from "@prisma/client";

type Ctx = { params: { id: string } };

type PatchBody = {
  type?: unknown;
  amount?: unknown;
  category?: unknown;
  description?: unknown;
  date?: unknown;
};

export async function PATCH(request: Request, context: Ctx) {
  const authResult = await requireUserId();
  if ("response" in authResult) return authResult.response;

  const { id } = context.params;

  const existing = await prisma.transaction.findFirst({
    where: { id, userId: authResult.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const nextType: TxType =
    body.type === "INCOME" || body.type === "EXPENSE"
      ? body.type
      : existing.type;

  const nextAmount =
    typeof body.amount === "number"
      ? body.amount
      : typeof body.amount === "string"
        ? Number(body.amount)
        : existing.amount;

  const nextCategory =
    typeof body.category === "string"
      ? body.category.trim()
      : existing.category;

  const nextDescription =
    body.description === undefined
      ? existing.description
      : typeof body.description === "string"
        ? body.description.slice(0, 200) || null
        : null;

  const nextDate =
    typeof body.date === "string"
      ? new Date(body.date)
      : existing.date;

  if (!Number.isFinite(nextAmount) || nextAmount <= 0) {
    return NextResponse.json(
      { error: "Сумма должна быть больше нуля" },
      { status: 400 }
    );
  }
  if (!isValidCategoryForType(nextCategory, nextType)) {
    return NextResponse.json({ error: "Недопустимая категория" }, { status: 400 });
  }
  if (Number.isNaN(nextDate.getTime())) {
    return NextResponse.json({ error: "Некорректная дата" }, { status: 400 });
  }

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      type: nextType,
      amount: nextAmount,
      category: nextCategory,
      description: nextDescription,
      date: nextDate,
    },
  });

  return NextResponse.json({ transaction });
}

export async function DELETE(_request: Request, context: Ctx) {
  const authResult = await requireUserId();
  if ("response" in authResult) return authResult.response;

  const { id } = context.params;

  const existing = await prisma.transaction.findFirst({
    where: { id, userId: authResult.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  await prisma.transaction.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
