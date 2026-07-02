export default function ProductLoading() {
  return (
    <main className="flex-1 pt-28 pb-24 px-6 md:px-14 animate-pulse">
      <div className="h-3 w-24 bg-line/60 mb-8" />
      <div className="grid md:grid-cols-2 gap-12 mt-8">
        <div>
          <div className="aspect-square bg-smoke" />
          <div className="flex gap-3 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-smoke" />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="h-10 md:h-14 w-3/4 bg-line/60 mb-4" />
          <div className="h-4 w-24 bg-line/60 mb-8" />
          <div className="h-3 w-full max-w-md bg-line/60 mb-2" />
          <div className="h-3 w-5/6 max-w-md bg-line/60 mb-2" />
          <div className="h-3 w-2/3 max-w-md bg-line/60 mb-8" />
          <div className="h-5 w-44 bg-line/60" />
        </div>
      </div>
    </main>
  );
}
