// Centralized pt-BR content for NEW SAINT VÉRON.
// Copy derived strictly from the brand positioning: Digital Experience & AI, premium/editorial.
// v1 rule: cases, testimonials and result numbers are NOT invented — see FEATURE_FLAGS.

export const BRAND = {
  name: "NEW SAINT VÉRON",
  mark: ["NEW SAINT", "VÉRON"],
  tagline: "Digital Experience & Artificial Intelligence",
  positioning:
    "Arquitetamos experiências digitais e sistemas de inteligência artificial para marcas que recusam o comum.",
  email: "contato@newsaintveron.com",
};

export const FEATURE_FLAGS = {
  // v1: no invented cases / testimonials / result numbers.
  showCases: false,
  showTestimonials: false,
  showResults: false,
};

export const NAV = [
  { label: "Início", to: "/" },
  { label: "Serviços", to: "/servicos" },
  { label: "Digital Experience", to: "/digital-experience" },
  { label: "Inteligência Artificial", to: "/inteligencia-artificial" },
  { label: "Contato", to: "/contato" },
];

export const HERO = {
  overline: "Digital Experience & AI",
  lines: ["Experiências", "que definem", "o extraordinário."],
  subline:
    "A NEW SAINT VÉRON une estratégia, design e engenharia de inteligência artificial para transformar ambição em produto — com o rigor de um estúdio e a precisão de uma consultoria.",
  ctaPrimary: { label: "Iniciar conversa", to: "/contato" },
  ctaSecondary: { label: "Ver serviços", to: "/servicos" },
};

export const POSITIONING = {
  overline: "Posicionamento",
  title: "Não fazemos mais do mesmo. Fazemos o que faltava.",
  body:
    "Somos uma casa digital dedicada a duas disciplinas complementares: a Experiência Digital, onde marca, interface e produto se encontram; e a Inteligência Artificial aplicada, onde dados e automação viram vantagem real. Trabalhamos por excelência, não por volume.",
  chapters: [
    {
      n: "01",
      title: "Marca antes de pixel",
      text: "Cada decisão de interface parte de uma tese de posicionamento. Estética é consequência da estratégia, nunca o ponto de partida.",
    },
    {
      n: "02",
      title: "IA com propósito",
      text: "Inteligência artificial só entra quando resolve um problema concreto — nunca como enfeite. Menos hype, mais resultado mensurável.",
    },
    {
      n: "03",
      title: "Engenharia de produção",
      text: "Entregamos software real: seguro por design, acessível, performático e pronto para escalar. Do protótipo ao produto vivo.",
    },
  ],
};

export const PROBLEMS = {
  overline: "O problema",
  title: "O digital genérico custa caro — só que você não vê a fatura.",
  items: [
    {
      title: "Presença sem posicionamento",
      text: "Sites bonitos que não comunicam valor, não convertem e envelhecem em meses.",
    },
    {
      title: "IA sem estratégia",
      text: "Ferramentas isoladas, promessas vagas e nenhum ganho operacional real.",
    },
    {
      title: "Experiência fragmentada",
      text: "Marca, produto e comunicação falando idiomas diferentes em cada canal.",
    },
    {
      title: "Tecnologia frágil",
      text: "Soluções improvisadas que quebram sob escala, atenção ou auditoria.",
    },
  ],
};

export const SERVICES = {
  overline: "Serviços",
  title: "Duas frentes. Um padrão de excelência.",
  intro:
    "Atuamos onde experiência e inteligência se encontram. Cada frente é entregue como um produto de software de produção — não como um entregável descartável.",
  items: [
    {
      slug: "digital-experience",
      index: "01",
      title: "Digital Experience",
      summary:
        "Identidade, interface e produto digital construídos como um sistema coeso — do posicionamento ao pixel final.",
      to: "/digital-experience",
      capabilities: [
        "Estratégia de marca digital",
        "Design system tokenizado",
        "UX/UI de produto",
        "Sites e plataformas premium",
        "Prototipação e validação",
        "Engenharia front-end de alto padrão",
      ],
    },
    {
      slug: "artificial-intelligence",
      index: "02",
      title: "Artificial Intelligence",
      summary:
        "IA aplicada a problemas reais de negócio: automação, assistentes, análise e produtos inteligentes com governança.",
      to: "/inteligencia-artificial",
      capabilities: [
        "Assistentes e copilotos sob medida",
        "Automação de processos com IA",
        "Integração de LLMs em produtos",
        "Pipelines de dados e RAG",
        "Governança e segurança de IA",
        "Prova de conceito ao produto",
      ],
    },
  ],
};

export const DIFFERENTIATORS = {
  overline: "Diferenciais",
  title: "Por que a NEW SAINT VÉRON.",
  items: [
    {
      title: "Padrão editorial",
      text: "Tratamos cada projeto com a curadoria de uma publicação premium: hierarquia, espaço e intenção em cada detalhe.",
    },
    {
      title: "Segurança by design",
      text: "Validação, sanitização e proteção de dados desde a primeira linha de código — não como remendo posterior.",
    },
    {
      title: "Acessibilidade real",
      text: "Contraste, foco visível e navegação por teclado tratados como requisito, seguindo diretrizes WCAG.",
    },
    {
      title: "Performance como estética",
      text: "Velocidade e fluidez fazem parte da experiência. O que é lento não é premium.",
    },
    {
      title: "Sem invenções",
      text: "Comunicamos apenas o que é verdadeiro. Nada de números fabricados ou promessas vazias.",
    },
    {
      title: "Parceria de longo prazo",
      text: "Não entregamos e desaparecemos. Construímos relações e produtos que evoluem com você.",
    },
  ],
};

export const METHODOLOGY = {
  overline: "Metodologia",
  title: "Um processo pensado para excelência, não para pressa.",
  steps: [
    {
      n: "01",
      title: "Imersão",
      text: "Entendemos negócio, público e ambição. Alinhamos o problema real antes de propor qualquer solução.",
    },
    {
      n: "02",
      title: "Estratégia",
      text: "Definimos posicionamento, escopo e as decisões estruturais que orientarão design e engenharia.",
    },
    {
      n: "03",
      title: "Design & Prototipação",
      text: "Traduzimos a estratégia em sistema visual e experiência, validados antes da construção.",
    },
    {
      n: "04",
      title: "Engenharia",
      text: "Construímos software de produção — seguro, acessível e performático — com IA aplicada onde faz sentido.",
    },
    {
      n: "05",
      title: "Lançamento & Evolução",
      text: "Publicamos, medimos e refinamos. O produto nasce vivo e continua melhorando.",
    },
  ],
};

export const TECHNOLOGY = {
  overline: "Tecnologia & IA",
  title: "Ferramentas de ponta, empregadas com critério.",
  body:
    "Trabalhamos com arquiteturas modernas de front-end, back-end e dados, e integramos modelos de linguagem de última geração quando eles resolvem um problema concreto. Tecnologia é meio — a decisão é sempre orientada a resultado.",
  pillars: [
    {
      title: "Experiência",
      text: "Interfaces fluidas, design systems e front-end de alto padrão, com movimento proposital e acessível.",
    },
    {
      title: "Inteligência",
      text: "LLMs, automação e pipelines de dados integrados de forma governada e segura.",
    },
    {
      title: "Infraestrutura",
      text: "Back-end robusto, APIs bem desenhadas e práticas de segurança e observabilidade.",
    },
  ],
  stack: [
    "React",
    "Design Systems",
    "FastAPI",
    "LLMs",
    "Automação",
    "RAG",
    "Cloud",
    "Segurança",
    "Acessibilidade",
    "Performance",
  ],
};

export const FAQ = {
  overline: "Perguntas frequentes",
  title: "O essencial, sem rodeios.",
  items: [
    {
      q: "Que tipo de empresa trabalha com a NEW SAINT VÉRON?",
      a: "Empresas que buscam um padrão premium de experiência digital e inteligência artificial, e que valorizam estratégia, design e engenharia como um único sistema.",
    },
    {
      q: "Vocês fazem projetos pontuais ou parcerias contínuas?",
      a: "Ambos. Começamos por um escopo bem definido e, quando faz sentido, evoluímos para uma parceria de longo prazo acompanhando o produto.",
    },
    {
      q: "Como a inteligência artificial entra nos projetos?",
      a: "Somente quando resolve um problema real: assistentes, automação, análise ou produtos inteligentes — sempre com governança e segurança.",
    },
    {
      q: "Vocês seguem boas práticas de segurança e acessibilidade?",
      a: "Sim. Validação e sanitização de dados, proteção contra abuso e diretrizes WCAG de acessibilidade fazem parte do padrão de entrega.",
    },
    {
      q: "Como começo uma conversa?",
      a: "Pelo formulário de contato ou pelo WhatsApp. Retornamos com os próximos passos e um diagnóstico inicial.",
    },
  ],
};

export const FINAL_CTA = {
  overline: "Vamos construir",
  title: "Sua próxima experiência começa com uma conversa.",
  body:
    "Conte o que você quer alcançar. Respondemos com clareza sobre como podemos ajudar — sem promessas vazias.",
  ctaPrimary: { label: "Falar com a equipe", to: "/contato" },
};

export const CONTACT = {
  overline: "Contato",
  title: "Vamos conversar.",
  body:
    "Preencha o formulário e nossa equipe retornará. Prefere algo mais direto? Fale pelo WhatsApp.",
  interests: [
    "Digital Experience",
    "Inteligência Artificial",
    "Ambos",
    "Outro assunto",
  ],
};

export const FOOTER = {
  blurb:
    "Consultoria premium de Digital Experience e Inteligência Artificial. Estratégia, design e engenharia para marcas que exigem excelência.",
  columns: [
    {
      title: "Navegação",
      links: [
        { label: "Início", to: "/" },
        { label: "Serviços", to: "/servicos" },
        { label: "Digital Experience", to: "/digital-experience" },
        { label: "Inteligência Artificial", to: "/inteligencia-artificial" },
        { label: "Contato", to: "/contato" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Política de Privacidade", to: "/politica-de-privacidade" },
        { label: "Política de Cookies", to: "/politica-de-cookies" },
        { label: "Termos de Uso", to: "/termos-de-uso" },
      ],
    },
  ],
};

export const WHATSAPP_MESSAGE =
  "Olá, NEW SAINT VÉRON! Gostaria de conversar sobre um projeto de experiência digital / IA.";
