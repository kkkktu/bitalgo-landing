export const navLinks = [
  { label: "Datasets", href: "#datasets" },
  { label: "Customize", href: "#customize" },
  { label: "Pricing", href: "#pricing" },
  { label: "Order", href: "#order" },
  { label: "Why BitALgo", href: "#why" },
  { label: "Docs", href: "#" },
  { label: "Contact", href: "#contact" },
];

export const codeSamples = {
  python: `# pip install bitalgo-client
import asyncio
from bitalgo import replay, Channel

async def main():
    messages = replay(
        exchange="binance-futures",
        from_date="2024-03-01",
        to_date="2024-03-02",
        filters=[Channel(name="depth", symbols=["btcusdt"])],
        api_key="YOUR_API_KEY",
    )

    async for local_ts, message in messages:
        print(local_ts, message)

asyncio.run(main())`,
  node: `// npm install bitalgo-client
const { replay } = require("bitalgo-client");

async function main() {
  const messages = replay({
    exchange: "binance-futures",
    from: "2024-03-01",
    to: "2024-03-02",
    filters: [{ channel: "depth", symbols: ["btcusdt"] }],
    apiKey: "YOUR_API_KEY",
  });

  for await (const { localTimestamp, message } of messages) {
    console.log(localTimestamp, message);
  }
}

main();`,
};

export const apiSamples = {
  python: `from bitalgo import datasets

# Download normalized CSV files for a whole month
datasets.download(
    exchange="okex-swap",
    data_types=["trades", "book_snapshot_25", "liquidations"],
    from_date="2024-01-01",
    to_date="2024-02-01",
    symbols=["BTC-USDT-SWAP"],
    api_key="YOUR_API_KEY",
)`,
  node: `const { downloadDatasets } = require("bitalgo-client");

// Download normalized CSV files for a whole month
await downloadDatasets({
  exchange: "okex-swap",
  dataTypes: ["trades", "book_snapshot_25", "liquidations"],
  from: "2024-01-01",
  to: "2024-02-01",
  symbols: ["BTC-USDT-SWAP"],
  apiKey: "YOUR_API_KEY",
});`,
};

export const overviewFeatures = [
  {
    title: "Replay every tick",
    text: "Rebuild the exact state of any market at any millisecond using raw, tick-by-tick exchange messages.",
    icon: "replay",
  },
  {
    title: "Files or streaming API",
    text: "Grab ready-made daily CSV files, or stream historical data through our client libraries in Python and Node.js.",
    icon: "api",
  },
  {
    title: "Broad market coverage",
    text: "Spot, perpetuals, futures and options from the leading centralized exchanges, collected since 2019.",
    icon: "coverage",
  },
];

export const exchanges = [
  "Binance",
  "Binance Futures",
  "OKX",
  "Bybit",
  "Deribit",
  "BitMEX",
  "Coinbase",
  "Kraken",
  "Bitfinex",
  "Gate.io",
  "KuCoin",
  "HTX",
];

export const stats = [
  { value: "1.2T+", label: "trades collected" },
  { value: "6,000+ TB", label: "raw market data" },
  { value: "40+", label: "exchanges" },
  { value: "150k+", label: "instruments" },
  { value: "2019", label: "data available since" },
  { value: "99.9%", label: "capture uptime" },
];

export const dataTypes = [
  "Full-depth L2 order book updates",
  "Order book snapshots (top 5 / 25 levels)",
  "Tick-level trades",
  "Options chains with greeks",
  "Top-of-book quotes",
  "Funding rates & open interest",
  "Liquidations",
  "Mark & index prices",
];

export type Dataset = {
  id: string;
  name: string;
  description: string;
  columns: string[];
  rows: string[][];
};

export const datasets: Dataset[] = [
  {
    id: "incremental_book_L2",
    name: "Incremental L2 book",
    description:
      "Every price level change of the full order book, so you can reconstruct the book at any point in time.",
    columns: ["exchange", "symbol", "timestamp", "local_timestamp", "is_snapshot", "side", "price", "amount"],
    rows: [
      ["binance-futures", "BTCUSDT", "1709251200012000", "1709251200015312", "false", "bid", "61840.10", "0.482"],
      ["binance-futures", "BTCUSDT", "1709251200012000", "1709251200015312", "false", "ask", "61840.20", "3.105"],
      ["binance-futures", "BTCUSDT", "1709251200019000", "1709251200021874", "false", "bid", "61839.80", "0"],
      ["binance-futures", "BTCUSDT", "1709251200024000", "1709251200026950", "false", "ask", "61841.00", "1.270"],
    ],
  },
  {
    id: "book_snapshot_25",
    name: "Book snapshots",
    description: "Top 25 bid and ask levels captured on every book change, flattened into columns.",
    columns: ["exchange", "symbol", "timestamp", "asks[0].price", "asks[0].amount", "bids[0].price", "bids[0].amount"],
    rows: [
      ["okex-swap", "BTC-USDT-SWAP", "1709251200101000", "61842.5", "12.4", "61842.4", "30.1"],
      ["okex-swap", "BTC-USDT-SWAP", "1709251200108000", "61842.5", "11.9", "61842.4", "30.1"],
      ["okex-swap", "BTC-USDT-SWAP", "1709251200113000", "61842.6", "4.0", "61842.5", "0.8"],
    ],
  },
  {
    id: "trades",
    name: "Trades",
    description: "Every individual trade with aggressor side, price and size as reported by the exchange.",
    columns: ["exchange", "symbol", "timestamp", "local_timestamp", "id", "side", "price", "amount"],
    rows: [
      ["bybit", "ETHUSDT", "1709251200201000", "1709251200203415", "a91f-22c0", "buy", "3402.15", "1.20"],
      ["bybit", "ETHUSDT", "1709251200203000", "1709251200205117", "a91f-22c1", "sell", "3402.10", "0.35"],
      ["bybit", "ETHUSDT", "1709251200211000", "1709251200213990", "a91f-22c2", "buy", "3402.20", "4.80"],
    ],
  },
  {
    id: "options_chain",
    name: "Options chain",
    description: "Tick-level quotes for every listed option, including implied volatility and greeks.",
    columns: ["symbol", "type", "strike", "expiry", "bid_price", "ask_price", "mark_iv", "delta"],
    rows: [
      ["BTC-29MAR24-65000-C", "call", "65000", "1711699200000000", "0.0415", "0.0430", "58.2", "0.39"],
      ["BTC-29MAR24-55000-P", "put", "55000", "1711699200000000", "0.0120", "0.0128", "61.7", "-0.15"],
      ["ETH-29MAR24-3500-C", "call", "3500", "1711699200000000", "0.0655", "0.0680", "63.1", "0.46"],
    ],
  },
  {
    id: "derivative_ticker",
    name: "Funding & OI",
    description: "Funding rates, open interest, mark and index prices for perpetual and futures contracts.",
    columns: ["exchange", "symbol", "timestamp", "funding_rate", "open_interest", "mark_price", "index_price"],
    rows: [
      ["bitmex", "XBTUSD", "1709251200000000", "0.000100", "412884100", "61838.4", "61836.9"],
      ["bitmex", "XBTUSD", "1709251201000000", "0.000100", "412901300", "61839.1", "61837.2"],
      ["bitmex", "XBTUSD", "1709251202000000", "0.000100", "412897600", "61840.0", "61838.5"],
    ],
  },
  {
    id: "liquidations",
    name: "Liquidations",
    description: "Forced liquidation orders published by exchanges, normalized into a single format.",
    columns: ["exchange", "symbol", "timestamp", "id", "side", "price", "amount"],
    rows: [
      ["deribit", "BTC-PERPETUAL", "1709251260412000", "7719021", "sell", "61790.0", "25000"],
      ["deribit", "BTC-PERPETUAL", "1709251260418000", "7719022", "sell", "61788.5", "8000"],
      ["deribit", "ETH-PERPETUAL", "1709251262001000", "7719040", "buy", "3409.25", "14000"],
    ],
  },
];

export const pricingCategories = ["Perpetuals", "Options", "Spot", "Derivatives", "All exchanges"] as const;
export type PricingCategory = (typeof pricingCategories)[number];

export const pricingTiers = [
  { name: "Academic", tagline: "For students and university research", multiplier: 0.25, highlighted: false },
  { name: "Solo", tagline: "For individual traders and quants", multiplier: 1, highlighted: false },
  { name: "Professional", tagline: "For trading teams and funds", multiplier: 2.5, highlighted: true },
  { name: "Business", tagline: "For firms redistributing insights", multiplier: 5, highlighted: false },
];

export const categoryBasePrice: Record<PricingCategory, number> = {
  Perpetuals: 200,
  Options: 250,
  Spot: 150,
  Derivatives: 350,
  "All exchanges": 600,
};

export const pricingFeatures: { label: string; values: (string | boolean)[] }[] = [
  { label: "Daily CSV datasets", values: [true, true, true, true] },
  { label: "Replay API & client libraries", values: [true, true, true, true] },
  { label: "API keys", values: ["1", "1", "5", "Unlimited"] },
  { label: "Historical depth", values: ["1 year", "Full history", "Full history", "Full history"] },
  { label: "Monthly download limit", values: ["2 TB", "10 TB", "50 TB", "Unlimited"] },
  { label: "Commercial use", values: [false, false, true, true] },
  { label: "Support", values: ["Email", "Email", "Priority email", "Dedicated channel"] },
];

export const whyColumns = [
  {
    title: "Complete",
    points: [
      "Full-depth order books, not just top of book",
      "Raw exchange messages alongside normalized formats",
      "Spot, futures, perpetuals and options in one place",
      "Consistent instrument metadata through a single API",
    ],
  },
  {
    title: "Transparent",
    points: [
      "Collected directly from public real-time WebSocket feeds",
      "Nanosecond-precision local timestamps on every message",
      "Open source client libraries you can audit",
      "Documented gaps and incidents, never hidden",
    ],
  },
  {
    title: "Reliable",
    points: [
      "Redundant collectors in multiple regions",
      "Fast downloads from a global CDN",
      "Responsive support from engineers who know the data",
      "Simple, predictable pricing with no hidden fees",
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
export const customExchanges = [
  { id: "binance-futures", label: "Binance Futures", symbols: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"] },
  { id: "binance", label: "Binance Spot", symbols: ["BTCUSDT", "ETHUSDT", "SOLUSDT"] },
  { id: "okex-swap", label: "OKX Swap", symbols: ["BTC-USDT-SWAP", "ETH-USDT-SWAP"] },
  { id: "bybit", label: "Bybit", symbols: ["BTCUSDT", "ETHUSDT", "SOLUSDT"] },
  { id: "deribit", label: "Deribit", symbols: ["BTC-PERPETUAL", "ETH-PERPETUAL", "OPTIONS"] },
  { id: "bitmex", label: "BitMEX", symbols: ["XBTUSD", "ETHUSD"] },
  { id: "coinbase", label: "Coinbase", symbols: ["BTC-USD", "ETH-USD"] },
];

export const customDataTypes = [
  { id: "incremental_book_L2", label: "Incremental L2 book", mbPerDay: 900 },
  { id: "book_snapshot_25", label: "Book snapshot 25", mbPerDay: 450 },
  { id: "book_snapshot_5", label: "Book snapshot 5", mbPerDay: 120 },
  { id: "trades", label: "Trades", mbPerDay: 60 },
  { id: "quotes", label: "Quotes", mbPerDay: 80 },
  { id: "derivative_ticker", label: "Funding & OI", mbPerDay: 8 },
  { id: "liquidations", label: "Liquidations", mbPerDay: 1 },
  { id: "options_chain", label: "Options chain", mbPerDay: 1500 },
];

export const customFormats = [
  { id: "csv", label: "CSV (gzip)", sizeFactor: 1 },
  { id: "parquet", label: "Parquet", sizeFactor: 0.6 },
  { id: "jsonl", label: "JSON Lines (gzip)", sizeFactor: 1.4 },
];

export const customIntervals = [
  { id: "raw", label: "Tick-by-tick", sizeFactor: 1 },
  { id: "1s", label: "1 second", sizeFactor: 0.25 },
  { id: "1m", label: "1 minute", sizeFactor: 0.02 },
];

// Placeholder: price per GB of custom export
export const customPricePerGb = 0.8;
export const customMinPrice = 50;

export const footerColumns = [
  { title: "Product", links: ["Datasets", "Pricing", "Docs", "FAQ"] },
  { title: "Support", links: ["Contact", "Status", "X / Twitter"] },
  { title: "Resources", links: ["Blog", "Newsletter", "Open source"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
];
