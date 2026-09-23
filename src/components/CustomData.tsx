"use client";

import { useState } from "react";
import {
  API_BASE,
  EXCHANGE_ID,
  SYMBOL_COUNT,
  channelMbPerSymbolDay,
  channels,
  customMinPrice,
  customPricePerGb,
  popularSymbols,
} from "@/lib/data";
import CodeTabs from "./CodeTabs";
import DateField from "./DateField";
import Section from "./Section";

const DAY_MS = 86_400_000;
const BUCKET_MS = 300_000;

function chipCls(active: boolean) {
  return `rounded-full border px-3 py-1.5 font-mono text-xs font-medium transition ${
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
  if (mb >= 1) return `${Math.round(mb)} MB`;
  return `${Math.max(1, Math.round(mb * 1024))} KB`;
}

const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

function StepTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{n}</span>
      {children}
    </h3>
  );
}

export default function CustomData() {
  const [allSymbols, setAllSymbols] = useState(false);
  const [symbols, setSymbols] = useState<string[]>(["BTCUSDT"]);
  const [draft, setDraft] = useState("");
  const [channelIds, setChannelIds] = useState<string[]>(["aggTrade", "trades_stat_5m"]);
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2025-01-31");
  const [v2Format, setV2Format] = useState<"csv" | "json">("csv");
  const [requested, setRequested] = useState(false);
  const [now] = useState(() => Date.now());

  const change = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setRequested(false);
  };

  const addDraft = () => {
    const s = draft.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "");
    if (s && !symbols.includes(s)) change(setSymbols)([...symbols, s]);
    setDraft("");
  };

  const selected = channels.filter((c) => channelIds.includes(c.id));
  const v1 = selected.filter((c) => c.api === "v1");
  const v2 = selected.filter((c) => c.api === "v2");

  const fromMs = Date.parse(from);
  const toMs = Date.parse(to);
  const days = Math.floor((toMs - fromMs) / DAY_MS) + 1;
  const validRange = days > 0;
  const symbolCount = allSymbols ? SYMBOL_COUNT : symbols.length;
  const thisYear = new Date(now).getUTCFullYear();

  const tooEarly = selected.filter((c) => from < c.since);
  const reachesLive = toMs + DAY_MS > now;

  const summary = (() => {
    const d = validRange ? days : 0;
    const mb = selected.reduce((sum, c) => sum + (channelMbPerSymbolDay[c.id] ?? 0), 0) * symbolCount * d;
    const v1Requests = v1.length > 0 && symbolCount > 0 ? d * 1440 : 0;
    const v2Requests = symbolCount > 0 ? v2.length * Math.ceil((d * 288) / 100) : 0;
    const price = mb > 0 ? Math.max(customMinPrice, Math.round((mb / 1024) * customPricePerGb)) : 0;
    return { mb, v1Requests, v2Requests, price };
  })();

  const code = (() => {
    const lower = symbols.map((s) => s.toLowerCase());
    const pyList = lower.map((s) => `"${s}"`).join(", ");
    const endExclusive = isoDay(toMs + DAY_MS);
    const endMs = toMs + DAY_MS - BUCKET_MS; // open of the last bucket, inclusive
    const startCompact = from.replaceAll("-", "");
    const symbolsParam = allSymbols ? "" : lower.join(",");

    const py: string[] = [];
    const node: string[] = [];
    const curl: string[] = [`KEY='YOUR_API_KEY'`];

    if (v1.length) {
      const pyFilters = v1
        .map((c) => `        Channel(name="${c.id}", symbols=[${allSymbols ? "" : pyList}]),`)
        .join("\n");
      py.push(`# Tick data (v1): raw frames, replayed minute by minute
import asyncio
from tardis_client import TardisClient, Channel

client = TardisClient(endpoint="${API_BASE}", api_key="YOUR_API_KEY")

async def replay_ticks():
    messages = client.replay(
        exchange="${EXCHANGE_ID}",
        from_date="${from}",
        to_date="${endExclusive}",  # exclusive
        filters=[
${pyFilters}${allSymbols ? "  # [] = every symbol" : ""}
        ],
    )
    async for local_timestamp, message in messages:
        print(local_timestamp, message)

asyncio.run(replay_ticks())`);

      const nodeFilters = v1
        .map((c) => (allSymbols ? `    { channel: "${c.id}" },` : `    { channel: "${c.id}", symbols: [${pyList}] },`))
        .join("\n");
      node.push(`// Tick data (v1): raw frames, replayed minute by minute
const { init, replay } = require("tardis-dev");

init({ endpoint: "${API_BASE}/v1", apiKey: "YOUR_API_KEY" });

const messages = replay({
  exchange: "${EXCHANGE_ID}",
  from: "${from}",
  to: "${endExclusive}", // exclusive
  filters: [
${nodeFilters}
  ],
});

for await (const { localTimestamp, message } of messages) {
  console.log(localTimestamp, message);
}`);

      const filters = JSON.stringify(v1.map((c) => (allSymbols ? { channel: c.id } : { channel: c.id, symbols: lower })));
      curl.push(`# v1: first minute, ${from}T00:00Z (increment offset for the next minute)
curl -sg --compressed -H "Authorization: Bearer $KEY" \\
  '${API_BASE}/v1/data-feeds/${EXCHANGE_ID}?from=${from}T00:00:00Z&offset=0&filters=${filters}' \\
  > ticks-${from}-0000.ndjson`);
    }

    for (const c of v2) {
      const params = `"channel": "${c.id}",${symbolsParam ? ` "symbols": "${symbolsParam}",` : ""}
                "startTime": start, "endTime": ${endMs}, "limit": 100, "format": "${v2Format}"`;
      py.push(
        v2Format === "csv"
          ? `# 5-minute stats (v2): ${c.id} -> ${c.id}.csv
import requests

session = requests.Session()
session.headers["Authorization"] = "Bearer YOUR_API_KEY"

start, first = "${startCompact}", True
with open("${c.id}.csv", "w") as out:
    while start:
        r = session.get("${API_BASE}/v2/data-feeds/${EXCHANGE_ID}",
                        params={${params}})
        r.raise_for_status()
        lines = r.text.splitlines()
        if len(lines) <= 1:
            break
        out.write("\\n".join(lines if first else lines[1:]) + "\\n")
        first = False
        start = r.headers.get("X-BitGW-Next-Start")
        if start and int(start) > ${endMs}:
            break`
          : `# 5-minute stats (v2): ${c.id} -> pandas DataFrame
import pandas, requests

session = requests.Session()
session.headers["Authorization"] = "Bearer YOUR_API_KEY"

start, rows = "${startCompact}", []
while start:
    r = session.get("${API_BASE}/v2/data-feeds/${EXCHANGE_ID}",
                    params={${params}})
    r.raise_for_status()
    page = r.json()
    if not page:
        break
    rows.extend(page)
    start = r.headers.get("X-BitGW-Next-Start")
    if start and int(start) > ${endMs}:
        break

frame = pandas.DataFrame(rows)
frame["timestamp"] = pandas.to_datetime(frame["timestamp"], unit="ms", utc=True)`,
      );

      node.push(`// 5-minute stats (v2): ${c.id}
let start = "${startCompact}";
const pages = [];
while (start) {
  const url = new URL("${API_BASE}/v2/data-feeds/${EXCHANGE_ID}");
  url.search = new URLSearchParams({
    channel: "${c.id}",${symbolsParam ? `\n    symbols: "${symbolsParam}",` : ""}
    startTime: start,
    endTime: "${endMs}",
    limit: "100",
    format: "${v2Format}",
  });
  const res = await fetch(url, { headers: { Authorization: "Bearer YOUR_API_KEY" } });
  if (!res.ok) throw new Error(await res.text());
  const body = await res.${v2Format === "csv" ? "text" : "json"}();
  if (${v2Format === "csv" ? `body.split("\\n").filter(Boolean).length <= 1` : "body.length === 0"}) break;
  pages.push(body);
  start = res.headers.get("X-BitGW-Next-Start");
  if (start && Number(start) > ${endMs}) break;
}`);

      curl.push(`# v2: first page of ${c.id} (use X-BitGW-Next-Start for the next page)
curl -sg -D - -H "Authorization: Bearer $KEY" \\
  '${API_BASE}/v2/data-feeds/${EXCHANGE_ID}?channel=${c.id}${symbolsParam ? `&symbols=${symbolsParam}` : ""}&startTime=${startCompact}&endTime=${endMs}&limit=100&format=${v2Format}'`);
    }

    const empty = "Select at least one channel and symbol";
    const ready = symbolCount > 0 && selected.length > 0;
    return {
      python: ready ? py.join("\n\n\n") : `# ${empty}`,
      node: ready ? node.join("\n\n") : `// ${empty}`,
      curl: ready ? curl.join("\n\n") : `# ${empty}`,
    };
  })();

  const canRequest = validRange && symbolCount > 0 && selected.length > 0;

  return (
    <Section
      id="customize"
      eyebrow="Customize data"
      title="Build exactly the dataset you need"
      subtitle="Pick symbols, channels and a date range. We estimate the size and price instantly and generate the download code for you."
    >
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <div>
            <StepTitle n={1}>Exchange</StepTitle>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-blue-600 bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">
                Binance USDⓈ-M Futures
              </span>
              <span className="font-mono text-xs text-slate-500">{EXCHANGE_ID} · perpetual & dated</span>
            </div>
          </div>

          <div>
            <StepTitle n={2}>Symbols</StepTitle>
            <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={allSymbols}
                onChange={(e) => change(setAllSymbols)(e.target.checked)}
                className="accent-blue-600"
              />
              All {SYMBOL_COUNT} symbols
            </label>
            {!allSymbols && (
              <>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[...new Set([...popularSymbols, ...symbols])].map((s) => (
                    <button key={s} type="button" onClick={() => change(setSymbols)(toggle(symbols, s))} className={chipCls(symbols.includes(s))}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addDraft();
                      }
                    }}
                    placeholder="Add a symbol, e.g. LINKUSDT"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button type="button" onClick={addDraft} className="rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600">
                    Add
                  </button>
                </div>
              </>
            )}
          </div>

          <div>
            <StepTitle n={3}>Channels</StepTitle>
            {(["v1", "v2"] as const).map((api) => (
              <div key={api} className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {api === "v1" ? "Tick data · v1 · .json.gz" : "5-minute stats · v2 · CSV / JSON"}
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {channels
                    .filter((c) => c.api === api)
                    .map((c) => (
                      <label
                        key={c.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                          channelIds.includes(c.id) ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={channelIds.includes(c.id)}
                          onChange={() => change(setChannelIds)(toggle(channelIds, c.id))}
                          className="accent-blue-600"
                        />
                        <span className="flex-1">
                          <span className="block font-mono text-xs font-semibold text-slate-800">{c.id}</span>
                          <span className="block text-xs text-slate-500">{c.name} · since {c.since.slice(0, 7)}</span>
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <StepTitle n={4}>Date range & output</StepTitle>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <DateField label="From (UTC)" value={from} onChange={change(setFrom)} minYear={2021} maxYear={thisYear} />
              <DateField label="To (UTC, inclusive)" value={to} onChange={change(setTo)} minYear={2021} maxYear={thisYear} />
            </div>
            {v2.length > 0 && (
              <fieldset className="mt-4">
                <legend className="text-sm font-medium text-slate-700">5-minute stats format</legend>
                <div className="mt-1.5 grid grid-cols-2 gap-2 sm:w-1/2">
                  {(["csv", "json"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setV2Format(f)}
                      className={`rounded-md border px-3 py-2 text-sm font-medium uppercase ${
                        v2Format === f ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {v1.length > 0 && <p className="mt-3 text-xs text-slate-500">Tick data is always NDJSON, gzipped on request.</p>}
            <div className="mt-3 space-y-1 text-sm">
              {!validRange && <p className="text-red-600">The end date must be on or after the start date.</p>}
              {tooEarly.map((c) => (
                <p key={c.id} className="text-amber-700">
                  <span className="font-mono">{c.id}</span> starts on {c.since}. Earlier days return error 150.
                </p>
              ))}
              {reachesLive && <p className="text-slate-500">The last ~2 minutes before now are not servable yet.</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl bg-slate-900 p-6 text-white lg:sticky lg:top-20">
            <p className="text-sm text-slate-400">Your custom dataset</p>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-slate-400">Days</dt>
                <dd className="text-2xl font-bold">{validRange ? days : 0}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Symbols</dt>
                <dd className="text-2xl font-bold">{symbolCount}</dd>
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
            <div className="mt-4 space-y-1 border-t border-slate-700 pt-4 text-xs text-slate-400">
              {summary.v1Requests > 0 && <p>v1 tick requests: {summary.v1Requests.toLocaleString()} (one per minute)</p>}
              {summary.v2Requests > 0 && <p>v2 stats requests: {summary.v2Requests.toLocaleString()} (100 buckets each)</p>}
              <p>
                One-time purchase, minimum ${customMinPrice}. Final price confirmed in the quote.
              </p>
            </div>
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
