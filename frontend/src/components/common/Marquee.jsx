import Marquee from "react-fast-marquee";
import { TECHNOLOGY } from "@/data/content";

// Slow editorial marquee. Pauses on hover; reduced-motion users get a static row.
export const EditorialMarquee = () => {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const words = [
    "Digital Experience",
    "Artificial Intelligence",
    "Design Systems",
    "Product Engineering",
    "Brand Strategy",
    "Automation",
  ];

  const Item = ({ children }) => (
    <span className="mx-8 inline-flex items-center gap-8 font-serif text-[clamp(2rem,6vw,5rem)] italic text-ivory/90">
      {children}
      <span className="text-champagne not-italic">✦</span>
    </span>
  );

  return (
    <div
      className="relative w-full overflow-hidden border-y border-white/[0.07] bg-obsidian py-8"
      data-testid="editorial-marquee"
    >
      {reduce ? (
        <div className="flex justify-center">
          {words.slice(0, 3).map((w) => (
            <Item key={w}>{w}</Item>
          ))}
        </div>
      ) : (
        <Marquee speed={45} gradient={false} pauseOnHover autoFill>
          {words.map((w) => (
            <Item key={w}>{w}</Item>
          ))}
        </Marquee>
      )}
    </div>
  );
};

export const StackMarquee = () => (
  <div className="relative w-full overflow-hidden py-2" data-testid="stack-marquee">
    <Marquee speed={30} gradient={false} autoFill>
      {TECHNOLOGY.stack.map((s) => (
        <span
          key={s}
          className="mx-4 rounded-[4px] border border-white/10 px-5 py-2 font-sans text-sm text-ivory-muted"
        >
          {s}
        </span>
      ))}
    </Marquee>
  </div>
);
