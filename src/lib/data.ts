export const API_BASE = "https://data.bitalgoresearch.com";
export const DOCS_URL = `${API_BASE}/docs`;
export const EXCHANGE_ID = "binance-futures";
export const SYMBOL_COUNT = 771;

export const navLinks = [
  { label: "Datasets", href: "#datasets" },
  { label: "Customize", href: "#customize" },
  { label: "Pricing", href: "#pricing" },
  { label: "Order", href: "#order" },
  { label: "Why BitALgo", href: "#why" },
  { label: "Docs", href: DOCS_URL },
  { label: "Contact", href: "#contact" },
];

export const codeSamples = {
  python: `# pip install tardis-client  (bare host, no /v1)
import asyncio
from tardis_client import TardisClient, Channel

client = TardisClient(
    endpoint="${API_BASE}",
    api_key="YOUR_API_KEY",
)

async def main():
    messages = client.replay(
        exchange="${EXCHANGE_ID}",
        from_date="2025-01-01",
        to_date="2025-01-02",
        filters=[Channel(name="aggTrade", symbols=["btcusdt"])],
    )
    async for local_timestamp, message in messages:
        print(local_timestamp, message)

asyncio.run(main())`,
  node: `// npm install tardis-dev  (with /v1, HTTPS only)
const { init, replay } = require("tardis-dev");

init({ endpoint: "${API_BASE}/v1", apiKey: "YOUR_API_KEY" });

const messages = replay({
  exchange: "${EXCHANGE_ID}",
  from: "2025-01-01",
  to: "2025-01-02",
  filters: [{ channel: "aggTrade", symbols: ["btcusdt"] }],
});

for await (const { localTimestamp, message } of messages) {
  console.log(localTimestamp, message);
}`,
};

export const apiSamples = {
  python: `import pandas, requests

rows = requests.get(
    "${API_BASE}/v2/data-feeds/${EXCHANGE_ID}",
    params={"channel": "trades_stat_5m", "symbols": "btcusdt",
            "startTime": 20250101, "limit": 100},
    headers={"Authorization": "Bearer YOUR_API_KEY"},
).json()

frame = pandas.DataFrame(rows)
frame["timestamp"] = pandas.to_datetime(frame["timestamp"], unit="ms", utc=True)`,
  node: `const url = new URL("${API_BASE}/v2/data-feeds/${EXCHANGE_ID}");
url.search = new URLSearchParams({
  channel: "trades_stat_5m",
  symbols: "btcusdt",
  startTime: "20250101",
  limit: "100",
});

const res = await fetch(url, {
  headers: { Authorization: "Bearer YOUR_API_KEY" },
});
const rows = await res.json();
// Next page starts at res.headers.get("X-BitGW-Next-Start")`,
  curl: `KEY='YOUR_API_KEY'

# Check what your key may download
curl -sg -H "Authorization: Bearer $KEY" \\
  '${API_BASE}/v1/api-key-info'

# 5-minute trade statistics as CSV
curl -sg -H "Authorization: Bearer $KEY" \\
  '${API_BASE}/v2/data-feeds/${EXCHANGE_ID}?channel=trades_stat_5m&symbols=btcusdt&startTime=20250101&limit=100&format=csv'`,
};

export const overviewFeatures = [
  {
    title: "Replay every tick",
    text: "Raw Binance websocket frames, untouched, each with a UTC capture timestamp. Rebuild the order book at any minute.",
    icon: "replay",
  },
  {
    title: "Drop-in Tardis compatible",
    text: "URLs, auth header, line format and error bodies match api.tardis.dev. Change the endpoint and key, nothing else.",
    icon: "api",
  },
  {
    title: "Binance USDⓈ-M futures",
    text: `Perpetual and dated futures, ${SYMBOL_COUNT} symbols currently trading, with history back to 2021.`,
    icon: "coverage",
  },
];

export const stats = [
  { value: String(SYMBOL_COUNT), label: "symbols trading" },
  { value: "2021", label: "history since" },
  { value: "5", label: "data channels" },
  { value: "1 min", label: "tick data per request" },
  { value: "5 min", label: "aggregated buckets" },
  { value: "~2 min", label: "behind live" },
];

export const dataTypes = [
  "aggTrade: every aggregated trade",
  "depth: order book diff updates",
  "depthSnapshot: periodic full book",
  "trades_stat_5m: VWAP, TWAP, volume",
  "orderbook_snapshot_12: spread & depth",
  "Gzipped NDJSON for tick data",
  "JSON or CSV for 5-minute stats",
  "Tardis-compatible error codes",
];

export type Channel = {
  id: string;
  name: string;
  api: "v1" | "v2";
  since: string; // YYYY-MM-DD
  description: string;
};

export const channels: Channel[] = [
  { id: "aggTrade", name: "Aggregated trades", api: "v1", since: "2021-01-01", description: "Every aggregated trade, as the exchange sent it." },
  { id: "depth", name: "Order book diffs", api: "v1", since: "2022-01-01", description: "Order book diff updates for rebuilding the full book." },
  { id: "depthSnapshot", name: "Book snapshots", api: "v1", since: "2022-01-01", description: "Periodic full order book snapshots." },
  { id: "trades_stat_5m", name: "Trade stats 5m", api: "v2", since: "2021-01-01", description: "Per-symbol trade statistics in five-minute buckets." },
  {
    id: "orderbook_snapshot_12",
    name: "Book stats 5m",
    api: "v2",
    since: "2021-01-01",
    description: "The book at the close of each five-minute bucket: spread, imbalance, depth and slope.",
  },
];

export type Dataset =
  | { kind: "tick"; channel: Channel; lines: string[] }
  | { kind: "csv"; channel: Channel; columns: string[]; rows: string[][]; notes?: { column: string; formula: string; meaning: string }[]; summary?: string[] };

const ch = (id: string) => channels.find((c) => c.id === id)!;

// Illustrative sample lines/rows; replace with real exports when available.
export const datasets: Dataset[] = [
  {
    kind: "tick",
    channel: ch("aggTrade"),
    lines: [
      `2026-09-10T00:05:00.2625039Z {"stream":"btcusdt@aggTrade","data":{"e":"aggTrade","E":1788998700262,"a":3447775262,"s":"BTCUSDT","p":"77248.40","q":"0.003","f":6120334811,"l":6120334811,"T":1788998700110,"m":true}}`,
      `2026-09-10T00:05:00.3170442Z {"stream":"btcusdt@aggTrade","data":{"e":"aggTrade","E":1788998700316,"a":3447775263,"s":"BTCUSDT","p":"77248.50","q":"0.120","f":6120334812,"l":6120334815,"T":1788998700164,"m":false}}`,
      `2026-09-10T00:05:00.4012876Z {"stream":"btcusdt@aggTrade","data":{"e":"aggTrade","E":1788998700400,"a":3447775264,"s":"BTCUSDT","p":"77248.40","q":"0.051","f":6120334816,"l":6120334816,"T":1788998700248,"m":true}}`,
    ],
  },
  {
    kind: "tick",
    channel: ch("depth"),
    lines: [
      `2026-09-10T00:05:00.1150231Z {"stream":"btcusdt@depth@0ms","data":{"e":"depthUpdate","E":1788998700114,"T":1788998700112,"s":"BTCUSDT","U":8812034411,"u":8812034420,"pu":8812034405,"b":[["77248.40","3.118"],["77248.10","0"]],"a":[["77248.50","1.402"]]}}`,
      `2026-09-10T00:05:00.1322087Z {"stream":"btcusdt@depth@0ms","data":{"e":"depthUpdate","E":1788998700131,"T":1788998700129,"s":"BTCUSDT","U":8812034421,"u":8812034433,"pu":8812034420,"b":[["77248.40","3.096"]],"a":[["77248.50","1.455"],["77249.00","0.600"]]}}`,
    ],
  },
  {
    kind: "tick",
    channel: ch("depthSnapshot"),
    lines: [
      `2026-09-10T00:05:00.0004416Z {"stream":"btcusdt@depthSnapshot","generated":true,"data":{"lastUpdateId":8812034400,"E":1788998699998,"T":1788998699996,"bids":[["77248.40","3.210"],["77248.30","0.842"],...],"asks":[["77248.50","1.390"],["77248.60","0.075"],...]}}`,
    ],
  },
  {
    kind: "csv",
    channel: ch("trades_stat_5m"),
    columns: ["timestamp", "symbol", "trade_amount", "quantity", "buyer_quantity", "buyer_amount", "trade_count", "buyer_count", "vwap_all", "vwap_buyer", "twap_all"],
    rows: [
      ["1735689600000", "BTCUSDT", "31982601.3068", "341.604", "193.286", "18097035.6557", "3341", "1542", "93624.7857367", "93628.27962553", "93626.56666667"],
      ["1735689900000", "BTCUSDT", "28410377.9021", "303.412", "151.905", "14223604.1180", "2987", "1411", "93635.1420518", "93634.90127744", "93636.02500000"],
      ["1735690200000", "BTCUSDT", "35120944.5530", "375.018", "201.330", "18853662.0412", "3620", "1705", "93651.4410297", "93645.12058316", "93649.87500000"],
    ],
    notes: [
      { column: "timestamp", formula: "bucket open, epoch ms", meaning: "Same value for every row in one bucket" },
      { column: "trade_amount", formula: "sum(price × quantity)", meaning: "Traded value, quote asset" },
      { column: "quantity", formula: "sum(quantity)", meaning: "Traded volume, base asset" },
      { column: "buyer_quantity", formula: "sum(quantity) where side = 'sell'", meaning: "Volume where the buyer was the maker" },
      { column: "buyer_amount", formula: "sum(price × quantity) where side = 'sell'", meaning: "Value where the buyer was the maker" },
      { column: "trade_count", formula: "count(*)", meaning: "Number of aggTrade records" },
      { column: "buyer_count", formula: "count(*) where side = 'sell'", meaning: "Number of buyer-maker records" },
      { column: "vwap_all", formula: "trade_amount / quantity", meaning: "VWAP across every trade" },
      { column: "vwap_buyer", formula: "buyer_amount / buyer_quantity", meaning: "VWAP across buyer-maker trades" },
      { column: "twap_all", formula: "mean(last price per 5s slice)", meaning: "TWAP over five-second slices" },
    ],
  },
  {
    kind: "csv",
    channel: ch("orderbook_snapshot_12"),
    columns: [],
    rows: [],
    summary: [
      "Best bid and ask prices, and the spread",
      "Resting size at the touch and across the whole book",
      "Imbalance over the top 5 and top 25 levels",
      "Slope over the top 5 and top 25 levels",
    ],
  },
];

export const pricingCategories = ["Tick data (v1)", "5-min stats (v2)", "Full access"] as const;
export type PricingCategory = (typeof pricingCategories)[number];

export const pricingTiers = [
  { name: "Academic", tagline: "For students and university research", multiplier: 0.25, highlighted: false },
  { name: "Solo", tagline: "For individual traders and quants", multiplier: 1, highlighted: false },
  { name: "Professional", tagline: "For trading teams and funds", multiplier: 2.5, highlighted: true },
  { name: "Business", tagline: "For firms redistributing insights", multiplier: 5, highlighted: false },
];

// Placeholder prices
export const categoryBasePrice: Record<PricingCategory, number> = {
  "Tick data (v1)": 300,
  "5-min stats (v2)": 100,
  "Full access": 350,
};

export const pricingFeatures: { label: string; values: (string | boolean)[] }[] = [
  { label: "Tick data replay (v1)", values: [true, true, true, true] },
  { label: "5-min stats, JSON or CSV (v2)", values: [true, true, true, true] },
  { label: "Tardis client compatible", values: [true, true, true, true] },
  { label: "API keys", values: ["1", "1", "5", "Unlimited"] },
  { label: "Historical depth", values: ["1 year", "Full history", "Full history", "Full history"] },
  { label: "Commercial use", values: [false, false, true, true] },
  { label: "Support", values: ["Email", "Email", "Priority email", "Dedicated channel"] },
];

export const whyColumns = [
  {
    title: "Complete",
    points: [
      "Every aggregated trade since January 2021",
      "Order book diffs and full snapshots since 2022",
      `All ${SYMBOL_COUNT} perpetual and dated USDⓈ-M futures`,
      "Pre-aggregated 5-minute trade and book statistics",
    ],
  },
  {
    title: "Transparent",
    points: [
      "Exchange websocket frames served untouched",
      "UTC capture timestamp at 100 ns resolution on every line",
      "Column formulas published for every aggregated field",
      "Empty windows return 200 with an empty body, not a fake error",
    ],
  },
  {
    title: "Easy to adopt",
    points: [
      "Works with the tardis-client and tardis-dev libraries",
      "API key in a header only, never in a URL",
      "Interactive docs with sample values pre-filled",
      "Live data settles about two minutes behind real time",
    ],
  },
];

export const testimonials = [
  {
    quote: "Sample testimonial — replace with a real quote from one of your customers about data quality.",
    author: "Customer name",
    role: "Role, Company A",
  },
  {
    quote: "Sample testimonial — replace with a real quote about how easy the API is to integrate.",
    author: "Customer name",
    role: "Role, Company B",
  },
  {
    quote: "Sample testimonial — replace with a real quote about support and reliability.",
    author: "Customer name",
    role: "Role, Company C",
  },
];

// Custom data builder. Sizes are rough placeholder estimates (compressed MB per symbol per day).
export const popularSymbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "DOGEUSDT"];

export const channelMbPerSymbolDay: Record<string, number> = {
  aggTrade: 40,
  depth: 600,
  depthSnapshot: 120,
  trades_stat_5m: 0.03,
  orderbook_snapshot_12: 0.05,
};

// Placeholder: price per GB of custom export
export const customPricePerGb = 0.8;
export const customMinPrice = 50;

export const footerColumns = [
  { title: "Product", links: ["Datasets", "Pricing", "Docs", "FAQ"] },
  { title: "Support", links: ["Contact", "Status", "X / Twitter"] },
  { title: "Resources", links: ["Blog", "Newsletter", "Open source"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
];
