"use client";

import { useState } from "react";
import { categoryBasePrice, pricingCategories, pricingTiers, type PricingCategory } from "@/lib/data";
import Section from "./Section";

const intervals = [
  { id: "yearly", label: "Yearly", months: 12, discount: 0 },
  { id: "quarterly", label: "Quarterly", months: 3, discount: 0.1 },
  { id: "monthly", label: "Monthly", months: 1, discount: 0.2 },
];

const steps = ["Choose your data", "Pay securely", "Receive your API key"];

const selectCls =
  "mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600";

export default function OrderForm() {
  const [cat, setCat] = useState<PricingCategory>(pricingCategories[0]);
  const [tier, setTier] = useState(pricingTiers[1].name);
  const [interval, setBilling] = useState("yearly");
  const [agreed, setAgreed] = useState(false);

  const t = pricingTiers.find((x) => x.name === tier) ?? pricingTiers[1];
  const iv = intervals.find((x) => x.id === interval) ?? intervals[0];
  const monthly = categoryBasePrice[cat] * t.multiplier * (1 + iv.discount);
  const total = Math.max(300, Math.round(monthly * iv.months));

  return (
    <Section
      id="order"
      eyebrow="Order"
      title="Get access in three steps"
      subtitle="Configure your plan below and see the price update instantly."
      className="bg-slate-50"
    >
      <ol className="mx-auto mb-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{i + 1}</span>
            <span className="text-sm font-medium text-slate-700">{s}</span>
          </li>
        ))}
      </ol>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto grid max-w-4xl gap-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-5 md:p-8"
      >
        <div className="space-y-5 md:col-span-3">
          <label className="block text-sm font-medium text-slate-700">
            Data
            <select className={selectCls} value={cat} onChange={(e) => setCat(e.target.value as PricingCategory)}>
              {pricingCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Plan
            <select className={selectCls} value={tier} onChange={(e) => setTier(e.target.value)}>
              {pricingTiers.map((p) => (
                <option key={p.name}>{p.name}</option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="text-sm font-medium text-slate-700">Billing interval</legend>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {intervals.map((x) => (
                <button
                  type="button"
                  key={x.id}
                  onClick={() => setBilling(x.id)}
                  className={`rounded-md border px-3 py-2.5 text-sm font-medium ${
                    interval === x.id ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-blue-600" />
            <span>
              I agree to the <a href="#" className="font-medium text-blue-600">Terms of Service</a>
            </span>
          </label>
        </div>

        <div className="flex flex-col justify-between rounded-lg bg-slate-900 p-6 text-white md:col-span-2">
          <div>
            <p className="text-sm text-slate-400">Order summary</p>
            <p className="mt-3 text-sm">
              {cat} · {tier} · {iv.label}
            </p>
            <p className="mt-6 text-4xl font-extrabold">${total.toLocaleString()}</p>
            <p className="mt-1 text-sm text-slate-400">per {iv.months === 12 ? "year" : iv.months === 3 ? "quarter" : "month"}, excl. VAT</p>
            <p className="mt-4 text-xs text-slate-500">Minimum order value is $300.</p>
          </div>
          <button
            type="submit"
            disabled={!agreed}
            className="mt-6 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Proceed to checkout
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Prefer an invoice or a formal quotation? <a href="#contact" className="font-semibold text-blue-600">Get in touch</a>.
      </p>
    </Section>
  );
}
