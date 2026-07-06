export default function CollectionLoading() {
  return (
    <main className="flex-1 pt-6 pb-24 px-6 md:px-14 animate-pulse">
      <div className="h-3 w-32 bg-line/60 mb-3" />
      <div className="h-14 md:h-24 w-1/2 max-w-sm bg-line/60 mb-14" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className="aspect-square bg-smoke" />
            <div className="pt-4 flex items-baseline justify-between">
              <div className="h-4 w-2/3 bg-line/60" />
              <div className="h-3 w-10 bg-line/60" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
