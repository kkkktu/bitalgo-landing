import { apiSamples } from "@/lib/data";
import CodeTabs from "./CodeTabs";

const points = [
  "Replay historical feeds exactly as they arrived, message by message",
  "Normalized trades, book changes and derived bars across exchanges",
  "Local caching so repeated backtests run at disk speed",
  "Self-hosted server option with HTTP and WebSocket endpoints",
];

export default function DeveloperApi() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <CodeTabs samples={apiSamples} />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Developer API</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Built for the people who write the code</h2>
          <p className="mt-4 text-lg text-slate-600">
            Open source clients for Python and Node.js get you from API key to backtest in a few lines.
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-slate-700">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-700">✓</span>
                {p}
              </li>
            ))}
          </ul>
          <a href="#" className="mt-8 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
            Read the documentation →
          </a>
        </div>
      </div>
    </section>
  );
}
