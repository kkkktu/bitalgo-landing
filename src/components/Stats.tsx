import { dataTypes, stats } from "@/lib/data";

export default function Stats() {
  return (
    <section className="bg-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-white sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
        <ul className="mt-14 grid gap-x-8 gap-y-3 border-t border-slate-700 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {dataTypes.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-0.5 text-blue-400">✓</span>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
