"use client";

import { useState } from "react";
import { categoryBasePrice, pricingCategories, pricingFeatures, pricingTiers, type PricingCategory } from "@/lib/data";
import Section from "./Section";

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <span className="text-blue-600">✓</span>;
  if (v === false) return <span className="text-slate-300">—</span>;
  return <span>{v}</span>;
}

export default function Pricing() {
  const [cat, setCat] = useState<PricingCategory>("Perpetuals");
  const base = categoryBasePrice[cat];

  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Simple pricing, billed per data plan"
      subtitle="Pick the market type you need and the plan that fits your team. Monthly prices shown, billed yearly."
    >
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-1 rounded-lg bg-slate-100 p-1">
          {pricingCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                cat === c ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pricingTiers.map((t, i) => (
          <div
            key={t.name}
            className={`flex flex-col rounded-xl border p-6 ${
              t.highlighted ? "border-blue-600 shadow-lg ring-1 ring-blue-600" : "border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{t.name}</h3>
              {t.highlighted && (
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Popular</span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">{t.tagline}</p>
            <p className="mt-6">
              <span className="text-4xl font-extrabold text-slate-900">${Math.round(base * t.multiplier).toLocaleString()}</span>
              <span className="text-sm text-slate-500"> /month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {pricingFeatures.map((f) => (
                <li key={f.label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 text-slate-600">
                  <span>{f.label}</span>
                  <span className="text-right font-medium text-slate-800">
                    <Cell v={f.values[i]} />
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="#order"
              className={`mt-6 rounded-md px-4 py-2.5 text-center text-sm font-semibold ${
                t.highlighted ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-300 text-slate-800 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              Get started
            </a>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        Need a single exchange or a custom date range? <a href="#contact" className="font-semibold text-blue-600">Contact us</a> for a quote.
      </p>
    </Section>
  );
}
