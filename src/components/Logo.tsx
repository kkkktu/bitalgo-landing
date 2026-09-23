export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-blue-600" />
        <path d="M7 21l5-6 4 3 7-9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="23" cy="9" r="2" fill="white" />
      </svg>
      <span className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
        BitALgo
      </span>
    </span>
  );
}
