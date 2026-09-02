export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
