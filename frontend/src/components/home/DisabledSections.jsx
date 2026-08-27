import { FEATURE_FLAGS } from "@/data/content";

// v1 rule: cases, testimonials and result numbers are NOT invented.
// The section structure lives here, disabled via FEATURE_FLAGS, ready for real data.

export const CasesSection = () => {
  if (!FEATURE_FLAGS.showCases) return null;
  return (
    <section data-testid="cases-section" className="bg-obsidian px-6 py-32 md:px-10">
      {/* TODO: renderizar cases reais quando disponíveis */}
    </section>
  );
};

export const TestimonialsSection = () => {
  if (!FEATURE_FLAGS.showTestimonials) return null;
  return (
    <section data-testid="testimonials-section" className="bg-obsidian px-6 py-32 md:px-10">
      {/* TODO: renderizar depoimentos reais quando disponíveis */}
    </section>
  );
};

export const ResultsSection = () => {
  if (!FEATURE_FLAGS.showResults) return null;
  return (
    <section data-testid="results-section" className="bg-obsidian px-6 py-32 md:px-10">
      {/* TODO: renderizar números de resultados reais quando disponíveis */}
    </section>
  );
};
