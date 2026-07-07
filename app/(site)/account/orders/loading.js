export default function OrdersLoading() {
  return (
    <div className="min-h-screen pt-6 pb-16 px-4 animate-pulse">
      <div className="h-7 w-40 bg-black/10 rounded mb-8" />
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-black/5 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
