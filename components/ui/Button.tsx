"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-primary hover:bg-primary/80 text-white dark:text-[#121212] border border-primary shadow-sm hover:shadow-md transition-all duration-300",
    secondary:
      "bg-secondary hover:bg-muted text-foreground border border-border hover:border-primary transition-all duration-300",
    danger:
      "bg-destructive hover:bg-destructive/80 text-white border border-destructive shadow-sm transition-all duration-300",
    success:
      "bg-success hover:bg-success/80 text-white border border-success shadow-sm transition-all duration-300",
    warning:
      "bg-warning hover:bg-warning/80 text-white border border-warning shadow-sm transition-all duration-300",
    ghost:
      "bg-transparent hover:bg-secondary text-foreground border border-border hover:border-primary transition-all duration-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
