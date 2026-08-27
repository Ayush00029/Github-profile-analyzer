export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-sm font-medium text-slate-400 animate-pulse">{label}</span>
    </div>
  );
}
