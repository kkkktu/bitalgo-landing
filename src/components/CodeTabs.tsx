"use client";

import { useState } from "react";

type Lang = "python" | "node" | "curl";

const TOKEN_RE =
  /(\/\/.*|#.*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(import|from|const|let|await|async|for|of|in|def|return|function|require|print|while|if|curl)\b|\b(\d[\d_.]*)\b/g;

function highlight(code: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of code.matchAll(TOKEN_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(code.slice(last, idx));
    const cls = m[1]
      ? "text-slate-500 italic"
      : m[2]
        ? "text-emerald-300"
        : m[3]
          ? "text-sky-300"
          : "text-amber-300";
    out.push(
      <span key={key++} className={cls}>
        {m[0]}
      </span>,
    );
    last = idx + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

const LABELS: Record<Lang, string> = { python: "Python", node: "Node.js", curl: "cURL" };

export default function CodeTabs({ samples }: { samples: Partial<Record<Lang, string>> }) {
  const tabs = (Object.keys(LABELS) as Lang[]).filter((id) => samples[id] !== undefined).map((id) => ({ id, label: LABELS[id] }));
  const [lang, setLang] = useState<Lang>(tabs[0]?.id ?? "python");

  return (
    <div className="overflow-hidden rounded-xl bg-slate-900 shadow-2xl ring-1 ring-slate-900/10">
      <div className="flex items-center gap-1 border-b border-slate-700/60 px-3 pt-3">
        <div className="mr-3 flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-slate-700" />
          <span className="h-3 w-3 rounded-full bg-slate-700" />
          <span className="h-3 w-3 rounded-full bg-slate-700" />
        </div>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setLang(t.id)}
            className={`rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors ${
              lang === t.id ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto bg-slate-800/50 p-5 text-[13px] leading-6 text-slate-200">
        <code className="font-mono">{highlight(samples[lang] ?? "")}</code>
      </pre>
    </div>
  );
}
