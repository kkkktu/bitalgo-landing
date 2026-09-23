"use client";

import { useState } from "react";
import { API_BASE, DOCS_URL, EXCHANGE_ID, datasets, type Dataset } from "@/lib/data";
import Section from "./Section";

const groups = [
  { kind: "tick" as const, title: "Tick data", meta: "v1 · NDJSON · .json.gz" },
  { kind: "csv" as const, title: "5-minute stats", meta: "v2 · CSV or JSON" },
];

function requestFor(ds: Dataset) {
  if (ds.kind === "tick") {
    return `curl -sg --compressed -H "Authorization: Bearer $KEY" \\
  '${API_BASE}/v1/data-feeds/${EXCHANGE_ID}?from=2026-09-10T00:05:00Z&offset=0&filters=[{"channel":"${ds.channel.id}","symbols":["btcusdt"]}]'`;
  }
  return `curl -sg -H "Authorization: Bearer $KEY" \\
  '${API_BASE}/v2/data-feeds/${EXCHANGE_ID}?channel=${ds.channel.id}&symbols=btcusdt&startTime=20250101&limit=100&format=csv'`;
}

export default function Datasets() {
  const [active, setActive] = useState(datasets[0].channel.id);
  const ds = datasets.find((d) => d.channel.id === active) ?? datasets[0];
  const since = ds.channel.since.slice(0, 7);

  return (
    <Section
      id="datasets"
      eyebrow="Datasets"
      title="Two ways to get Binance futures data"
      subtitle="Raw tick data exactly as the exchange sent it, or ready-made five-minute statistics as CSV."
      className="bg-slate-50"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.kind} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-semibold text-slate-900">{g.title}</p>
              <p className="font-mono text-xs text-slate-500">{g.meta}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {datasets
                .filter((d) => d.kind === g.kind)
                .map((d) => (
                  <button
                    key={d.channel.id}
                    onClick={() => setActive(d.channel.id)}
                    className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition ${
                      active === d.channel.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
                    }`}
                  >
                    {d.channel.id}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-mono text-base font-semibold text-slate-900">{ds.channel.id}</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">{ds.channel.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-700">API {ds.channel.api}</span>
              <span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-700">{since} → live</span>
              <span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-700">
                {ds.kind === "tick" ? "1 minute per request" : "5-minute buckets, up to 100 per request"}
              </span>
            </div>
          </div>
          <a href={DOCS_URL} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700">
            Try it in the docs →
          </a>
        </div>

        {ds.kind === "tick" && (
          <div className="p-6">
            <p className="text-sm text-slate-600">
              Each line is a 28-character UTC timestamp, a space, then the exchange&apos;s own websocket frame, untouched.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs leading-6 text-slate-200">
              {ds.lines.map((l) => (
                <div key={l} className="whitespace-pre">
                  <span className="text-amber-300">{l.slice(0, 28)}</span>
                  {l.slice(28)}
                </div>
              ))}
            </pre>
          </div>
        )}

        {ds.kind === "csv" && ds.columns.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {ds.columns.map((c) => (
                    <th key={c} className="whitespace-nowrap px-4 py-3 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ds.rows.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60">
                    {r.map((cell, j) => (
                      <td key={j} className="whitespace-nowrap px-4 py-2.5 text-slate-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {ds.kind === "csv" && ds.summary && (
          <div className="p-6">
            <p className="text-sm font-medium text-slate-700">Eighteen columns per row, per symbol, per bucket:</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {ds.summary.map((s) => (
                <li key={s} className="flex gap-2 text-sm text-slate-600">
                  <span className="text-blue-600">✓</span>
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Full column table: <code className="font-mono">/v2/exchanges/{EXCHANGE_ID}/{ds.channel.id}</code>
            </p>
          </div>
        )}

        {ds.kind === "csv" && ds.notes && (
          <div className="border-t border-slate-200 p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-2 pr-4 font-semibold">Column</th>
                    <th className="py-2 pr-4 font-semibold">Formula</th>
                    <th className="py-2 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {ds.notes.map((n) => (
                    <tr key={n.column} className="border-t border-slate-100">
                      <td className="whitespace-nowrap py-2 pr-4 font-mono text-slate-800">{n.column}</td>
                      <td className="whitespace-nowrap py-2 pr-4 font-mono text-slate-600">{n.formula}</td>
                      <td className="py-2 text-slate-600">{n.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <strong>Read buyer_* carefully.</strong> It counts trades where the buyer was the maker, meaning the taker was
              selling. It is not taker-buy volume.
            </p>
          </div>
        )}

        <div className="border-t border-slate-200 bg-slate-50 p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Request</p>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs leading-6 text-slate-200">{requestFor(ds)}</pre>
        </div>
      </div>
    </Section>
  );
}
