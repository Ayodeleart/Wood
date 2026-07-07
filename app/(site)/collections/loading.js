export default function CollectionsLoading() {
  return (
    <div className="min-h-screen pt-6 pb-16 px-4 animate-pulse">
      <div className="h-7 w-40 bg-black/10 rounded mb-6" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-black/5 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
