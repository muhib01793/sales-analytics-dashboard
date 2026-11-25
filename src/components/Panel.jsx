/** Reusable card wrapper with a header, optional actions, and body. */
export default function Panel({ title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`panel ${className}`.trim()}>
      <header className="panel__header">
        <div>
          <h2 className="panel__title">{title}</h2>
          {subtitle && <p className="panel__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="panel__actions">{actions}</div>}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  );
}
