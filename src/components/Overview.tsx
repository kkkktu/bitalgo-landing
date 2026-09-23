import { EXCHANGE_ID, channels, overviewFeatures } from "@/lib/data";
import Section from "./Section";

const icons: Record<string, React.ReactNode> = {
  replay: <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4M12 8v4l3 2" />,
  api: <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12" />,
  coverage: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z" />,
};

export default function Overview() {
  return (
    <Section
      eyebrow="Overview"
      title="Institutional-grade data without the institutional hassle"
      subtitle="Historical market microstructure for Binance USDⓈ-M futures, served over plain HTTP."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {overviewFeatures.map((f) => (
          <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {icons[f.icon]}
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-slate-600">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
          Channels on <span className="font-mono normal-case">{EXCHANGE_ID}</span>
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {channels.map((c) => (
            <a
              key={c.id}
              href="#datasets"
              className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center transition hover:border-blue-300 hover:bg-white"
            >
              <span className="font-mono text-sm font-semibold text-slate-800">{c.id}</span>
              <span className="mt-1 text-xs text-slate-500">
                {c.api} · since {c.since.slice(0, 4)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
