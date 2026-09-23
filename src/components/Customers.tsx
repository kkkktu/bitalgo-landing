import { testimonials } from "@/lib/data";
import Section from "./Section";

const placeholders = ["Company A", "Company B", "Company C", "Company D", "Company E", "Company F"];

export default function Customers() {
  return (
    <Section eyebrow="Customers" title="Trusted by trading teams worldwide" className="bg-slate-50">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {placeholders.map((p) => (
          <div
            key={p}
            className="flex h-14 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm font-semibold text-slate-400"
          >
            {p}
          </div>
        ))}
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <figure key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <blockquote className="text-slate-700">“{t.quote}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-slate-200" />
              <span>
                <span className="block text-sm font-semibold text-slate-900">{t.author}</span>
                <span className="block text-xs text-slate-500">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
