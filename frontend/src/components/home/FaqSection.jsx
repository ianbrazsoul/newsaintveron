import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, Overline } from "@/components/common/Section";
import { Reveal } from "@/components/common/Reveal";
import { FAQ } from "@/data/content";

export const FaqSection = () => (
  <Section id="faq" className="bg-obsidian" data-testid="faq-section">
    <div className="grid gap-12 md:grid-cols-12">
      <div className="md:col-span-4">
        <Reveal>
          <Overline>{FAQ.overline}</Overline>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-7 font-serif text-display text-ivory">{FAQ.title}</h2>
        </Reveal>
      </div>

      <div className="md:col-span-7 md:col-start-6">
        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/[0.1]"
              >
                <AccordionTrigger
                  data-testid={`faq-trigger-${i}`}
                  className="py-6 font-serif text-xl text-ivory hover:no-underline [&[data-state=open]]:text-champagne md:text-2xl"
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 font-sans text-sm leading-relaxed text-ivory-muted md:text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </div>
  </Section>
);
