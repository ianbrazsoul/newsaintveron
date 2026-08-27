import { useSeo } from "@/lib/seo";
import { ServiceDetail } from "@/components/services/ServiceDetail";

const IMG =
  "https://images.unsplash.com/photo-1704354428728-24b8ccab5c3d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";

export default function DigitalExperience() {
  useSeo({
    title: "Digital Experience",
    description:
      "Digital Experience pela NEW SAINT VÉRON: identidade, interface e produto digital construídos como um sistema coeso — do posicionamento ao pixel final.",
    path: "/digital-experience",
  });

  return (
    <ServiceDetail
      index="01"
      overline="Digital Experience"
      heroLines={["Marca, interface", "e produto —", "um só sistema."]}
      subtitle="Construímos experiências digitais que comunicam valor e convertem, unindo estratégia de marca, design de produto e engenharia front-end de alto padrão."
      image={IMG}
      intro={[
        "Digital Experience é onde a percepção da sua marca acontece. Cada tela, transição e microdetalhe comunica — ou compromete — o valor que você entrega.",
        "Tratamos interface como consequência de estratégia. Antes de desenhar, definimos posicionamento e as decisões estruturais que orientam todo o produto.",
      ]}
      capabilities={[
        { title: "Estratégia de marca digital", text: "Posicionamento, tom e narrativa traduzidos em decisões concretas de produto." },
        { title: "Design system tokenizado", text: "Cores, tipografia, espaçamento e componentes como um sistema escalável e consistente." },
        { title: "UX/UI de produto", text: "Fluxos, arquitetura de informação e interfaces pensadas para clareza e conversão." },
        { title: "Sites e plataformas premium", text: "Experiências editoriais performáticas, acessíveis e prontas para produção." },
        { title: "Prototipação e validação", text: "Protótipos navegáveis para validar decisões antes da engenharia." },
        { title: "Front-end de alto padrão", text: "Código limpo, movimento proposital e performance como parte da estética." },
      ]}
      approach={[
        { title: "Clareza antes de estética", text: "A beleza serve à mensagem. Primeiro definimos o que precisa ser dito, depois como encantar." },
        { title: "Sistema, não telas soltas", text: "Construímos um design system que mantém coerência à medida que o produto cresce." },
        { title: "Movimento com propósito", text: "Animações reforçam hierarquia e fluidez — nunca distração. E sempre acessíveis." },
      ]}
      sibling={{ to: "/inteligencia-artificial", label: "Ver Inteligência Artificial" }}
    />
  );
}
