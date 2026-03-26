"use client";

import { useState } from "react";
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
import { formatAmount } from "@/lib/utils";
import type { TransactionRowData } from "@/types/transaction";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionRowData | null;
  onDeleted?: () => void;
};

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  transaction,
  onDeleted,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!transaction) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => ({}));
        const msg =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Не удалось удалить";
        toast.error(msg, { duration: 5000 });
        return;
      }
      toast.success("Транзакция удалена");
      onOpenChange(false);
      onDeleted?.();
    } catch {
      toast.error("Ошибка сети", { duration: 5000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90dvh,calc(100vh-2rem))] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Удалить транзакцию?</DialogTitle>
        </DialogHeader>
        {transaction ? (
          <p className="text-sm text-muted-foreground">
            {formatAmount(transaction.amount, transaction.type)} ·{" "}
            {transaction.category}
          </p>
        ) : null}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={loading || !transaction}
            onClick={handleDelete}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Удаление…
              </>
            ) : (
              "Удалить"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
