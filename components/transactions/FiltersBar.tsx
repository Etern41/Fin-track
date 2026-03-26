"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ALL_CATEGORIES } from "@/lib/categories";
import { MAX_SEARCH_QUERY_LENGTH } from "@/lib/validation";

export type FilterType = "ALL" | "INCOME" | "EXPENSE";

export type FiltersState = {
  from: string;
  to: string;
  category: string;
  type: FilterType;
  search: string;
};

type Props = {
  values: FiltersState;
  onChange: (next: FiltersState) => void;
};

export function FiltersBar({ values, onChange }: Props) {
  function patch(partial: Partial<FiltersState>) {
    onChange({ ...values, ...partial });
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 card-shadow">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label htmlFor="f-from" className="text-xs">
            С:
          </Label>
          <Input
            id="f-from"
            type="date"
            className="h-9 w-[160px]"
            value={values.from}
            onChange={(e) => patch({ from: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="f-to" className="text-xs">
            По:
          </Label>
          <Input
            id="f-to"
            type="date"
            className="h-9 w-[160px]"
            value={values.to}
            onChange={(e) => patch({ to: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Категория</Label>
          <Select
            value={values.category || "__all__"}
            onValueChange={(v) =>
              patch({ category: v === "__all__" ? "" : v })
            }
          >
            <SelectTrigger className="h-9 w-[200px]">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Все категории</SelectItem>
              {ALL_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Тип</Label>
          <div className="flex rounded-md border border-border p-0.5">
            {(
              [
                ["ALL", "Все"],
                ["INCOME", "Доходы"],
                ["EXPENSE", "Расходы"],
              ] as const
            ).map(([key, label]) => (
              <Button
                key={key}
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-3",
                  values.type === key && "bg-muted font-medium"
                )}
                onClick={() => patch({ type: key })}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-md space-y-1">
        <Label htmlFor="f-search" className="text-xs">
          Поиск по описанию
        </Label>
        <Input
          id="f-search"
          type="search"
          placeholder="Текст…"
          maxLength={MAX_SEARCH_QUERY_LENGTH}
          className="h-9"
          value={values.search}
          onChange={(e) => patch({ search: e.target.value })}
        />
      </div>
    </div>
  );
}
