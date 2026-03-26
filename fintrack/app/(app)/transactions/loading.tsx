import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-40 w-full" />
      <div className="space-y-2 rounded-lg border border-border p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
