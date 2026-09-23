export default function FinalCta() {
  return (
    <section className="bg-blue-600">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to start backtesting?</h2>
        <p className="max-w-xl text-blue-100">Create an account, grab your API key and download your first dataset in minutes.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#" className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
            Start now
          </a>
          <a href="#" className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
            Read the docs
          </a>
        </div>
      </div>
    </section>
  );
}
