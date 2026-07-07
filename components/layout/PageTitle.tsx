interface PageTitleProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageTitle({ title, subtitle, actions }: PageTitleProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground transition-colors duration-300">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1 transition-colors duration-300">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
