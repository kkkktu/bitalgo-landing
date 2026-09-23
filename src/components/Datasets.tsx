"use client";

import { useState } from "react";
import { datasets } from "@/lib/data";
import Section from "./Section";

export default function Datasets() {
  const [active, setActive] = useState(datasets[0].id);
  const ds = datasets.find((d) => d.id === active) ?? datasets[0];

  return (
    <Section
      id="datasets"
      eyebrow="Datasets"
      title="Normalized CSV files for every data type"
      subtitle="Daily gzip-compressed files per exchange, data type and symbol. Same schema across all venues."
      className="bg-slate-50"
    >
      <div className="flex flex-wrap justify-center gap-2">
        {datasets.map((d) => (
          <button
            key={d.id}
            onClick={() => setActive(d.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active === d.id
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-mono text-base font-semibold text-slate-900">{ds.id}</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">{ds.description}</p>
          </div>
          <div className="flex shrink-0 gap-4 text-sm font-semibold">
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Download sample
            </a>
            <a href="#" className="text-slate-600 hover:text-blue-700">
              CSV schema
            </a>
          </div>
        </div>
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
      </div>
    </Section>
  );
}
