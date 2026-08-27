import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Masked line-by-line reveal for large editorial headings.
// Each line sits in an overflow-hidden mask; inner span slides up.
export const MaskedHeading = ({
  lines = [],
  className,
  lineClassName,
  as: Tag = "h1",
  stagger = 0.12,
  delay = 0.15,
  animateOnLoad = true,
}) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const viewProps = animateOnLoad
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: { once: true, margin: "-10% 0px" } };

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className={cn("mask-line", lineClassName)}>
          <motion.span
            className="block will-change-transform"
            initial="hidden"
            {...viewProps}
            variants={{
              hidden: { y: "115%" },
              visible: { y: "0%" },
            }}
            transition={{
              duration: 1.05,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};
