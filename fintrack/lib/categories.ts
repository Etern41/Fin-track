export const INCOME_CATEGORIES = [
  "Зарплата",
  "Фриланс",
  "Инвестиции",
  "Подарки",
  "Другое",
] as const;

export const EXPENSE_CATEGORIES = [
  "Еда и продукты",
  "Транспорт",
  "Жильё",
  "Развлечения",
  "Здоровье",
  "Одежда",
  "Связь",
  "Образование",
  "Другое",
] as const;

export const ALL_CATEGORIES = Array.from(
  new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])
);

export const CATEGORY_COLORS: Record<string, string> = {
  Зарплата: "#10B981",
  Фриланс: "#34D399",
  Инвестиции: "#6EE7B7",
  Подарки: "#A7F3D0",
  "Еда и продукты": "#EF4444",
  Транспорт: "#F97316",
  Жильё: "#EAB308",
  Развлечения: "#8B5CF6",
  Здоровье: "#EC4899",
  Одежда: "#06B6D4",
  Связь: "#3B82F6",
  Образование: "#F59E0B",
  Другое: "#6B7280",
};

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export function isValidCategoryForType(
  category: string,
  type: "INCOME" | "EXPENSE"
): boolean {
  if (type === "INCOME") {
    return (INCOME_CATEGORIES as readonly string[]).includes(category);
  }
  return (EXPENSE_CATEGORIES as readonly string[]).includes(category);
}
