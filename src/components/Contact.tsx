"use client";

import { useState } from "react";
import Section from "./Section";

const inputCls =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <Section id="contact" eyebrow="Contact" title="Talk to us" subtitle="Questions about coverage, pricing or custom data? We usually reply within one business day.">
      {sent ? (
        <div className="mx-auto max-w-xl rounded-xl border border-blue-200 bg-blue-50 p-8 text-center">
          <p className="text-lg font-semibold text-blue-800">Thanks! Your message has been received.</p>
          <button onClick={() => setSent(false)} className="mt-4 text-sm font-semibold text-blue-600">
            Send another message
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="mx-auto max-w-xl space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <label className="block text-sm font-medium text-slate-700">
            Subject
            <input required className={inputCls} placeholder="e.g. Custom dataset request" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input required type="email" className={inputCls} placeholder="you@company.com" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Message
            <textarea required rows={5} className={inputCls} placeholder="How can we help?" />
          </label>
          <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Send message
          </button>
        </form>
      )}
    </Section>
  );
}
