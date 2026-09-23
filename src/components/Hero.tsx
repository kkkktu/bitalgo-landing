import { DOCS_URL, SYMBOL_COUNT, codeSamples } from "@/lib/data";
import CodeTabs from "./CodeTabs";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 to-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_55%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Tick-level historical market data
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Every tick of <span className="text-blue-600">Binance futures</span>, ready for research
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            BitALgo captures aggregated trades, order book diffs and snapshots for all {SYMBOL_COUNT} Binance USDⓈ-M
            futures, then serves them as raw tick data or ready-made five-minute CSV statistics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#pricing"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              See pricing
            </a>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-blue-600 hover:text-blue-600"
            >
              Try the API docs →
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Already on Tardis? Change the endpoint and API key, nothing else.
          </p>
        </div>
        <CodeTabs samples={codeSamples} />
      </div>
    </section>
  );
}
