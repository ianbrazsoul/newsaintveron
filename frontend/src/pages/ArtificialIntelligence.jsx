import { useSeo } from "@/lib/seo";
import { ServiceDetail } from "@/components/services/ServiceDetail";

const IMG =
  "https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";

export default function ArtificialIntelligence() {
  useSeo({
    title: "Inteligência Artificial",
    description:
      "IA aplicada pela NEW SAINT VÉRON: assistentes, automação, integração de LLMs e produtos inteligentes com governança e segurança.",
    path: "/inteligencia-artificial",
  });

  return (
    <ServiceDetail
      index="02"
      overline="Artificial Intelligence"
      heroLines={["Inteligência", "com propósito,", "não com hype."]}
      subtitle="Aplicamos IA a problemas reais de negócio — automação, assistentes, análise e produtos inteligentes — sempre com governança, segurança e resultado mensurável."
      image={IMG}
      intro={[
        "Inteligência artificial só entra quando resolve um problema concreto. Nada de recursos decorativos ou promessas vagas.",
        "Integramos modelos de linguagem de última geração à sua operação e aos seus produtos, com pipelines de dados governados e práticas de segurança desde o início.",
      ]}
      capabilities={[
        { title: "Assistentes e copilotos", text: "Interfaces conversacionais sob medida, integradas ao seu contexto e às suas regras." },
        { title: "Automação com IA", text: "Processos manuais transformados em fluxos inteligentes, com ganho operacional real." },
        { title: "Integração de LLMs", text: "Modelos de linguagem incorporados a produtos existentes de forma segura e escalável." },
        { title: "Pipelines de dados e RAG", text: "Recuperação aumentada por geração para respostas fundamentadas nos seus dados." },
        { title: "Governança e segurança", text: "Controle de acesso, sanitização e rastreabilidade tratados como requisito." },
        { title: "Da prova de conceito ao produto", text: "Validamos rápido e evoluímos para software de produção quando faz sentido." },
      ]}
      approach={[
        { title: "Problema antes de modelo", text: "Começamos pelo resultado desejado, não pela tecnologia da moda." },
        { title: "Governança por padrão", text: "Segurança, privacidade e controle de dados fazem parte da arquitetura, não são remendo." },
        { title: "Mensurável ou não conta", text: "Se não dá para medir o ganho, revisitamos a abordagem." },
      ]}
      sibling={{ to: "/digital-experience", label: "Ver Digital Experience" }}
    />
  );
}
