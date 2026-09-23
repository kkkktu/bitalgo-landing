import { footerColumns } from "@/lib/data";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-6 lg:px-8">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm">Tick-level historical market data for Binance USDⓈ-M futures.</p>
        </div>
        {footerColumns.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-semibold text-white">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs sm:px-6 lg:px-8">© {new Date().getFullYear()} BitALgo. All rights reserved.</p>
      </div>
    </footer>
  );
}
