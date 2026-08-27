import { cn } from "@/lib/utils";

export const Card = ({ className, children, interactive = false, ...props }) => (
  <div
    className={cn(
      "rounded-[4px] border border-white/[0.07] bg-graphite/70 p-8 transition-all duration-500",
      interactive &&
        "hover:border-champagne/40 hover:bg-graphite hover:-translate-y-1",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
