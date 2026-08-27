import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { MaskedHeading } from "@/components/common/MaskedHeading";
import { Button } from "@/components/common/Button";
import { NAV } from "@/data/content";

export default function NotFound() {
  useSeo({
    title: "Página não encontrada",
    description: "A página que você procura não foi encontrada.",
    path: "/404",
  });

  return (
    <section
      data-testid="not-found-page"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-obsidian px-6 md:px-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.08),transparent_55%)]" />
      <div className="relative mx-auto w-full max-w-4xl text-center">
        <p className="text-overline font-sans font-medium text-champagne">
          Erro 404
        </p>
        <MaskedHeading
          as="h1"
          lines={["404"]}
          className="mt-6 font-serif text-[clamp(6rem,26vw,20rem)] leading-none tracking-tighter text-ivory"
        />
        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-ivory-muted">
          A página que você procura não existe ou foi movida. Vamos te levar de
          volta ao caminho certo.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="primary" size="lg" to="/" icon={ArrowLeft} data-testid="notfound-home-btn">
            Voltar ao início
          </Button>
          <Button variant="outline" size="lg" to="/contato" data-testid="notfound-contact-btn">
            Falar conosco
          </Button>
        </div>
        <nav aria-label="Links úteis" className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-sans text-sm text-ivory-muted transition-colors hover:text-champagne"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
