import { cn } from "@/lib/utils";

export const Section = ({
  as: Tag = "section",
  id,
  className,
  containerClassName,
  children,
  ...props
}) => (
  <Tag
    id={id}
    className={cn("relative w-full px-6 py-24 md:px-10 md:py-32", className)}
    {...props}
  >
    <div className={cn("mx-auto w-full max-w-7xl", containerClassName)}>
      {children}
    </div>
  </Tag>
);

export const Overline = ({ children, className }) => (
  <span
    className={cn(
      "text-overline inline-flex items-center gap-3 font-sans font-medium text-champagne",
      className
    )}
  >
    <span className="h-px w-8 bg-champagne/60" aria-hidden="true" />
    {children}
  </span>
);
