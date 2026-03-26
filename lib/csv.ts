import Papa from "papaparse";

export function transactionsToCsv(
  transactions: {
    date: Date;
    type: string;
    amount: number;
    category: string;
    description?: string | null;
  }[]
): string {
  const rows = transactions.map((t) => ({
    Дата: new Date(t.date).toLocaleDateString("ru-RU"),
    Тип: t.type === "INCOME" ? "Доход" : "Расход",
    Сумма: t.amount.toFixed(2),
    Категория: t.category,
    Описание: t.description ?? "",
  }));
  return Papa.unparse(rows, { delimiter: ";", header: true });
}
