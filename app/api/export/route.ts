import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/api-auth";
import { transactionsToCsv } from "@/lib/csv";
import type { Prisma, TxType } from "@prisma/client";

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

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
  });

  const csvString = transactionsToCsv(transactions);
  // UTF-8 BOM: иначе Excel на Windows открывает файл как ANSI и ломает кириллицу.
  const csvWithBom = `\uFEFF${csvString}`;

  return new Response(csvWithBom, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="fintrack-export.csv"',
    },
  });
}
