export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  className = "",
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-16 py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || subtitle) && (
          <div className="mx-auto mb-12 max-w-2xl text-center">
            {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</p>}
            {title && <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-4 text-lg text-slate-600">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
