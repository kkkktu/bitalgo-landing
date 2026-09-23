import { whyColumns } from "@/lib/data";
import Section from "./Section";

export default function WhyUs() {
  return (
    <Section id="why" eyebrow="Why BitALgo" title="Data you can build a strategy on">
      <div className="grid gap-8 md:grid-cols-3">
        {whyColumns.map((c) => (
          <div key={c.title} className="rounded-xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900">{c.title}</h3>
            <ul className="mt-5 space-y-3">
              {c.points.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
