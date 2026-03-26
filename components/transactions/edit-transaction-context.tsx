"use client";

import { createContext, useContext, useMemo } from "react";
import type { TransactionRowData } from "@/types/transaction";

type EditCtx = (row: TransactionRowData) => void;

const EditTransactionContext = createContext<EditCtx>(() => {});

export function EditTransactionProvider({
  children,
  onEdit,
}: {
  children: React.ReactNode;
  onEdit: EditCtx;
}) {
  const value = useMemo(() => onEdit, [onEdit]);
  return (
    <EditTransactionContext.Provider value={value}>
      {children}
    </EditTransactionContext.Provider>
  );
}

export function useEditTransaction() {
  return useContext(EditTransactionContext);
}
