import { LegalPage } from "@/components/legal/LegalPage";

export default function Privacy() {
  return (
    <LegalPage
      seo={{
        title: "Política de Privacidade",
        description:
          "Política de Privacidade da NEW SAINT VÉRON — como coletamos, usamos e protegemos seus dados pessoais, em conformidade com a LGPD.",
        path: "/politica-de-privacidade",
      }}
      overline="Legal"
      title="Política de Privacidade"
      updated="Junho de 2026"
      sections={[
        {
          paragraphs: [
            "A NEW SAINT VÉRON valoriza a sua privacidade. Esta Política descreve como tratamos os dados pessoais coletados por meio deste site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).",
          ],
        },
        {
          heading: "1. Dados que coletamos",
          paragraphs: [
            "Coletamos apenas os dados que você nos fornece voluntariamente, principalmente através do formulário de contato:",
          ],
          list: [
            "Nome",
            "E-mail",
            "Empresa (opcional)",
            "Telefone (opcional)",
            "Mensagem e assunto de interesse",
          ],
        },
        {
          heading: "2. Como usamos seus dados",
          paragraphs: [
            "Utilizamos seus dados exclusivamente para responder ao seu contato, entender sua necessidade e conduzir a comunicação comercial decorrente. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.",
          ],
        },
        {
          heading: "3. Base legal",
          paragraphs: [
            "O tratamento se baseia no seu consentimento, coletado no momento do envio do formulário, e no legítimo interesse de responder solicitações comerciais.",
          ],
        },
        {
          heading: "4. Armazenamento e segurança",
          paragraphs: [
            "Seus dados são armazenados de forma segura, com validação e sanitização de entradas e proteção contra acesso não autorizado. Adotamos práticas de segurança por design em toda a camada de aplicação.",
          ],
        },
        {
          heading: "5. Seus direitos",
          paragraphs: ["Você pode, a qualquer momento, solicitar:"],
          list: [
            "Confirmação da existência de tratamento",
            "Acesso aos seus dados",
            "Correção de dados incompletos ou desatualizados",
            "Eliminação dos dados tratados com base no consentimento",
            "Revogação do consentimento",
          ],
        },
        {
          heading: "6. Contato",
          paragraphs: [
            "Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, entre em contato pelo e-mail contato@newsaintveron.com.",
          ],
        },
      ]}
    />
  );
}
