import { useSeo } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { EditorialMarquee } from "@/components/common/Marquee";
import { Positioning } from "@/components/home/Positioning";
import { Problems } from "@/components/home/Problems";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { Differentiators } from "@/components/home/Differentiators";
import { Methodology } from "@/components/home/Methodology";
import { Technology } from "@/components/home/Technology";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCta } from "@/components/home/FinalCta";
import {
  CasesSection,
  TestimonialsSection,
  ResultsSection,
} from "@/components/home/DisabledSections";

export default function Home() {
  useSeo({
    title: null,
    description:
      "NEW SAINT VÉRON — consultoria premium de Digital Experience e Inteligência Artificial. Estratégia, design e engenharia de IA para marcas que exigem excelência.",
    path: "/",
  });

  return (
    <>
      <Hero />
      <EditorialMarquee />
      <Positioning />
      <Problems />
      <ServicesPreview />
      <Differentiators />
      <Methodology />
      <Technology />
      {/* v1: seções desativadas, prontas para dados reais */}
      <CasesSection />
      <TestimonialsSection />
      <ResultsSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
