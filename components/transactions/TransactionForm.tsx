"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/categories";
import type { TransactionRowData } from "@/types/transaction";
import {
  MAX_TRANSACTION_AMOUNT,
  MAX_TRANSACTION_DESCRIPTION_LENGTH,
} from "@/lib/validation";

type Mode = "create" | "edit";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  initialTransaction?: TransactionRowData;
  onSuccess?: () => void;
};

function toInputDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayInput(): string {
  return toInputDate(new Date().toISOString());
}

export function TransactionForm({
  open,
  onOpenChange,
  mode,
  initialTransaction,
  onSuccess,
}: Props) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState(todayInput());
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (mode === "edit" && initialTransaction) {
      setType(initialTransaction.type);
      setAmount(String(initialTransaction.amount));
      setCategory(initialTransaction.category);
      setDate(toInputDate(initialTransaction.date));
      setDescription(initialTransaction.description ?? "");
    } else {
      setType("EXPENSE");
      setAmount("");
      setCategory("");
      setDate(todayInput());
      setDescription("");
    }
  }, [open, mode, initialTransaction]);

  const categories =
    type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (!open) return;
    const list =
      type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (category && !(list as readonly string[]).includes(category)) {
      setCategory("");
    }
  }, [type, open, category]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const num = Number(amount.replace(",", "."));
    if (!Number.isFinite(num) || num < 0.01) {
      setError("Введите сумму не меньше 0,01");
      return;
    }
    if (num > MAX_TRANSACTION_AMOUNT) {
      setError("Сумма превышает допустимый максимум");
      return;
    }
    if (description.length > MAX_TRANSACTION_DESCRIPTION_LENGTH) {
      setError(
        `Описание не длиннее ${MAX_TRANSACTION_DESCRIPTION_LENGTH} символов`
      );
      return;
    }
    if (!category) {
      setError("Выберите категорию");
      return;
    }

    const payload = {
      type,
      amount: num,
      category,
      date: new Date(date).toISOString(),
      description: description.trim() || undefined,
    };

    setSubmitting(true);
    try {
      const url =
        mode === "edit" && initialTransaction
          ? `/api/transactions/${initialTransaction.id}`
          : "/api/transactions";
      const res = await fetch(url, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Не удалось сохранить";
        setError(msg);
        return;
      }

      toast.success("Транзакция сохранена");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      setError("Ошибка сети. Попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Новая транзакция" : "Редактирование"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Тип</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "INCOME" ? "default" : "outline"}
                className={cn("flex-1")}
                onClick={() => setType("INCOME")}
              >
                Доход
              </Button>
              <Button
                type="button"
                variant={type === "EXPENSE" ? "default" : "outline"}
                className={cn("flex-1")}
                onClick={() => setType("EXPENSE")}
              >
                Расход
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-amount">Сумма</Label>
            <Input
              id="tx-amount"
              type="number"
              min={0.01}
              max={MAX_TRANSACTION_AMOUNT}
              step={0.01}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label>Категория</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-date">Дата</Label>
            <Input
              id="tx-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-desc">Описание</Label>
            <Textarea
              id="tx-desc"
              maxLength={MAX_TRANSACTION_DESCRIPTION_LENGTH}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Необязательно"
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/{MAX_TRANSACTION_DESCRIPTION_LENGTH}
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Сохранение…
                </>
              ) : (
                "Сохранить"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
