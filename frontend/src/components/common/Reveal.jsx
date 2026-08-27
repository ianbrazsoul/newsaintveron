import { motion, useReducedMotion } from "framer-motion";

// Scroll-triggered reveal that respects prefers-reduced-motion.
export const Reveal = ({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  as = "div",
}) => {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
};
