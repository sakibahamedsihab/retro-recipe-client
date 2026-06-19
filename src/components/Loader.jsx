export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] gap-6">
      {/* Modern Sharp Wireframe Line Loader */}
      <div className="relative w-12 h-12 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-none">
        <div className="absolute inset-0 border-2 border-t-zinc-900 border-r-zinc-900 dark:border-t-zinc-50 dark:border-r-zinc-50 animate-spin rounded-none"></div>
        <div className="w-2 h-2 bg-zinc-900 dark:bg-zinc-50 animate-ping rounded-none"></div>
      </div>

      {/* Micro Text Detail */}
      <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs animate-pulse">
        Preparing ingredients...
      </p>
    </div>
  );
}
