import * as React from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// 4 variants x 6 states (default, hover, focus, active, disabled, loading)
const VARIANTS = {
  primary:
    "bg-champagne text-obsidian hover:bg-champagne-muted active:bg-[#b8933f] disabled:bg-champagne/40 disabled:text-obsidian/60",
  secondary:
    "bg-graphite text-ivory border border-white/10 hover:border-champagne/60 hover:text-champagne active:bg-[#151515] disabled:opacity-40",
  outline:
    "bg-transparent text-ivory border border-white/20 hover:border-champagne hover:text-champagne active:bg-white/[0.03] disabled:opacity-40",
  ghost:
    "bg-transparent text-ivory-muted hover:text-champagne active:text-champagne-muted disabled:opacity-40",
};

const SIZES = {
  sm: "h-10 px-5 text-xs",
  md: "h-12 px-7 text-sm",
  lg: "h-14 px-9 text-sm",
};

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-[4px] font-medium uppercase tracking-[0.14em] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:pointer-events-none select-none min-w-[44px]";

export const Button = React.forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    to,
    href,
    loading = false,
    disabled = false,
    className,
    children,
    icon: Icon,
    ...props
  },
  ref
) {
  const classes = cn(base, VARIANTS[variant], SIZES[size], className);
  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      <span>{children}</span>
      {!loading && Icon && (
        <Icon
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (to && !disabled && !loading) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href && !disabled && !loading) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {content}
    </button>
  );
});
