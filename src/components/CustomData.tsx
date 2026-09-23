"use client";

import { useMemo, useState } from "react";
import {
  customDataTypes,
  customExchanges,
  customFormats,
  customIntervals,
  customMinPrice,
  customPricePerGb,
} from "@/lib/data";
import CodeTabs from "./CodeTabs";
import Section from "./Section";

const inputCls =
  "mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600";

function chipCls(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-sm font-medium transition ${
    active
      ? "border-blue-600 bg-blue-600 text-white"
      : "border-slate-300 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
  }`;
}

function toggle<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function formatSize(mb: number) {
  if (mb >= 1024 * 1024) return `${(mb / 1024 / 1024).toFixed(2)} TB`;
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${Math.round(mb)} MB`;
}

function StepTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{n}</span>
      {children}
    </h3>
  );
}

export default function CustomData() {
  const [exchangeIds, setExchangeIds] = useState<string[]>(["binance-futures"]);
  const [symbols, setSymbols] = useState<string[]>(["binance-futures:BTCUSDT"]);
  const [typeIds, setTypeIds] = useState<string[]>(["trades", "book_snapshot_25"]);
  const [from, setFrom] = useState("2024-03-01");
  const [to, setTo] = useState("2024-03-31");
  const [formatId, setFormatId] = useState(customFormats[0].id);
  const [intervalId, setIntervalId] = useState(customIntervals[0].id);
  const [requested, setRequested] = useState(false);

  const toggleExchange = (id: string) => {
    setExchangeIds((prev) => toggle(prev, id));
    // Drop symbols of an exchange once it is deselected
    if (exchangeIds.includes(id)) setSymbols((prev) => prev.filter((s) => !s.startsWith(`${id}:`)));
    setRequested(false);
  };

  const days = Math.floor((Date.parse(to) - Date.parse(from)) / 86_400_000) + 1;
  const validRange = Number.isFinite(days) && days > 0;

  const summary = useMemo(() => {
    const format = customFormats.find((f) => f.id === formatId) ?? customFormats[0];
    const interval = customIntervals.find((i) => i.id === intervalId) ?? customIntervals[0];
    const types = customDataTypes.filter((t) => typeIds.includes(t.id));
    const d = validRange ? days : 0;
    const perSymbolMb = types.reduce((sum, t) => sum + t.mbPerDay, 0);
    const mb = perSymbolMb * symbols.length * d * format.sizeFactor * interval.sizeFactor;
    const files = symbols.length * types.length * d;
    const price = files > 0 ? Math.max(customMinPrice, Math.round((mb / 1024) * customPricePerGb)) : 0;
    return { mb, files, price, format, interval };
  }, [formatId, intervalId, typeIds, symbols, days, validRange]);

  const code = useMemo(() => {
    const groups = exchangeIds
      .map((ex) => ({ ex, syms: symbols.filter((s) => s.startsWith(`${ex}:`)).map((s) => s.slice(ex.length + 1)) }))
      .filter((g) => g.syms.length > 0);
    const q = (list: string[]) => list.map((x) => `"${x}"`).join(", ");
    const py = groups
      .map(
        (g) => `datasets.download(
    exchange="${g.ex}",
    data_types=[${q(typeIds)}],
    symbols=[${q(g.syms)}],
    from_date="${from}",
    to_date="${to}",
    format="${formatId}",
    interval="${intervalId}",
    api_key="YOUR_API_KEY",
)`,
      )
      .join("\n\n");
    const node = groups
      .map(
        (g) => `await downloadDatasets({
  exchange: "${g.ex}",
  dataTypes: [${q(typeIds)}],
  symbols: [${q(g.syms)}],
  from: "${from}",
  to: "${to}",
  format: "${formatId}",
  interval: "${intervalId}",
  apiKey: "YOUR_API_KEY",
});`,
      )
      .join("\n\n");
    return {
      python: `from bitalgo import datasets\n\n${py || "# Select at least one symbol"}`,
      node: `const { downloadDatasets } = require("bitalgo-client");\n\n${node || "// Select at least one symbol"}`,
    };
  }, [exchangeIds, symbols, typeIds, from, to, formatId, intervalId]);

  const canRequest = summary.files > 0;

  return (
    <Section
      id="customize"
      eyebrow="Customize data"
      title="Build exactly the dataset you need"
      subtitle="Pick exchanges, symbols, data types and a date range. We estimate the size and price instantly and generate the download code for you."
    >
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <div>
            <StepTitle n={1}>Exchanges</StepTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {customExchanges.map((e) => (
                <button key={e.id} type="button" onClick={() => toggleExchange(e.id)} className={chipCls(exchangeIds.includes(e.id))}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <StepTitle n={2}>Symbols</StepTitle>
            {exchangeIds.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Select an exchange first.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {customExchanges
                  .filter((e) => exchangeIds.includes(e.id))
                  .map((e) => (
                    <div key={e.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500">{e.label}</span>
                      <div className="flex flex-wrap gap-2">
                        {e.symbols.map((s) => {
                          const key = `${e.id}:${s}`;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setSymbols((prev) => toggle(prev, key));
                                setRequested(false);
                              }}
                              className={`${chipCls(symbols.includes(key))} font-mono text-xs`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div>
            <StepTitle n={3}>Data types</StepTitle>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {customDataTypes.map((t) => (
                <label
                  key={t.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                    typeIds.includes(t.id) ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={typeIds.includes(t.id)}
                    onChange={() => {
                      setTypeIds((prev) => toggle(prev, t.id));
                      setRequested(false);
                    }}
                    className="accent-blue-600"
                  />
                  <span className="flex-1 font-medium text-slate-700">{t.label}</span>
                  <span className="font-mono text-xs text-slate-400">{t.id}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <StepTitle n={4}>Date range & output</StepTitle>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                From
                <input type="date" min="2019-01-01" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                To
                <input type="date" min="2019-01-01" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                File format
                <select value={formatId} onChange={(e) => setFormatId(e.target.value)} className={inputCls}>
                  {customFormats.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Aggregation
                <select value={intervalId} onChange={(e) => setIntervalId(e.target.value)} className={inputCls}>
                  {customIntervals.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {!validRange && <p className="mt-2 text-sm text-red-600">The end date must be on or after the start date.</p>}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl bg-slate-900 p-6 text-white lg:sticky lg:top-20">
            <p className="text-sm text-slate-400">Your custom dataset</p>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-slate-400">Days</dt>
                <dd className="text-2xl font-bold">{validRange ? days : 0}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Files</dt>
                <dd className="text-2xl font-bold">{summary.files.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Estimated size</dt>
                <dd className="text-2xl font-bold">{formatSize(summary.mb)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Estimated price</dt>
                <dd className="text-2xl font-bold text-blue-400">${summary.price.toLocaleString()}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-slate-500">
              {symbols.length} symbol(s) · {typeIds.length} data type(s) · {summary.format.label} · {summary.interval.label}. One-time
              purchase, minimum ${customMinPrice}. Final price confirmed in the quote.
            </p>
            {requested ? (
              <p className="mt-6 rounded-md bg-blue-600/20 px-4 py-3 text-center text-sm font-medium text-blue-200">
                Request received! We will email you a quote within one business day.
              </p>
            ) : (
              <button
                type="button"
                disabled={!canRequest}
                onClick={() => setRequested(true)}
                className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Request this dataset
              </button>
            )}
            <a href="#pricing" className="mt-3 block text-center text-xs text-slate-400 hover:text-white">
              Need everything? Compare subscription plans →
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold text-slate-700">Generated download code</p>
        <CodeTabs samples={code} />
      </div>
    </Section>
  );
}
