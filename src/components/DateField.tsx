"use client";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const selectCls =
  "rounded-md border border-slate-300 bg-white px-2 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600";

const pad = (n: number) => String(n).padStart(2, "0");

// Locale-independent date picker (native <input type="date"> follows the device language).
export default function DateField({
  label,
  value,
  onChange,
  minYear,
  maxYear,
}: {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (v: string) => void;
  minYear: number;
  maxYear: number;
}) {
  const [y, m, d] = value.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();

  const set = (ny: number, nm: number, nd: number) => {
    const max = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
    onChange(`${ny}-${pad(nm)}-${pad(Math.min(nd, max))}`);
  };

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-700">{label}</legend>
      <div className="mt-1.5 grid grid-cols-[1fr_1.2fr_1.3fr] gap-2">
        <select aria-label={`${label} day`} value={d} onChange={(e) => set(y, m, Number(e.target.value))} className={selectCls}>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select aria-label={`${label} month`} value={m} onChange={(e) => set(y, Number(e.target.value), d)} className={selectCls}>
          {MONTHS.map((name, i) => (
            <option key={name} value={i + 1}>
              {name}
            </option>
          ))}
        </select>
        <select aria-label={`${label} year`} value={y} onChange={(e) => set(Number(e.target.value), m, d)} className={selectCls}>
          {years.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}
