export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="px-6 md:px-14 pt-20 pb-8">
        <div className="h-3 w-40 bg-line/60 mb-3" />
        <div className="h-12 md:h-20 w-2/3 max-w-md bg-line/60" />
      </div>
      <div className="flex gap-6 px-6 md:px-14 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="shrink-0 w-[280px] md:w-[340px] aspect-[4/5] bg-smoke" />
        ))}
      </div>
    </div>
  );
}
