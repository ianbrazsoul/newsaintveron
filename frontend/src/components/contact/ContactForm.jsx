import { useState } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { CONTACT } from "@/data/content";
import { cn } from "@/lib/utils";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldBase =
  "w-full rounded-[4px] border border-white/10 bg-obsidian px-4 py-3.5 font-sans text-sm text-ivory placeholder:text-ivory-muted/60 transition-colors duration-300 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne";

const Field = ({ label, error, children, htmlFor, required }) => (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={htmlFor}
      className="font-sans text-xs uppercase tracking-[0.16em] text-ivory-muted"
    >
      {label} {required && <span className="text-champagne">*</span>}
    </label>
    {children}
    {error && (
      <span
        className="flex items-center gap-1.5 font-sans text-xs text-red-400"
        data-testid={`error-${htmlFor}`}
      >
        <AlertCircle className="h-3.5 w-3.5" />
        {error}
      </span>
    )}
  </div>
);

export const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    interest: CONTACT.interests[0],
    message: "",
    consent: false,
    website: "", // honeypot
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const set = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      next.name = "Informe seu nome.";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "E-mail inválido.";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Descreva seu projeto (mín. 10 caracteres).";
    if (!form.consent) next.consent = "É necessário aceitar para prosseguir.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;
    if (!validate()) return;

    setStatus("loading");
    try {
      const { data } = await axios.post(`${API}/leads`, {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || null,
        phone: form.phone.trim() || null,
        interest: form.interest,
        message: form.message.trim(),
        consent: form.consent,
        website: form.website,
      });
      setStatus("success");
      toast.success(data.message || "Mensagem enviada com sucesso.");
    } catch (err) {
      setStatus("error");
      const msg =
        err?.response?.status === 429
          ? "Muitas tentativas. Aguarde alguns minutos."
          : "Não foi possível enviar. Tente novamente.";
      toast.error(msg);
    }
  };

  if (status === "success") {
    return (
      <div
        data-testid="contact-success"
        className="flex flex-col items-start gap-6 rounded-[6px] border border-champagne/30 bg-graphite/60 p-10 md:p-14"
      >
        <CheckCircle2 className="h-12 w-12 text-champagne" />
        <div>
          <h3 className="font-serif text-3xl text-ivory">Mensagem recebida.</h3>
          <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-ivory-muted">
            Obrigado pelo contato. Nossa equipe retornará em breve com os
            próximos passos.
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setForm({
              name: "",
              email: "",
              company: "",
              phone: "",
              interest: CONTACT.interests[0],
              message: "",
              consent: false,
              website: "",
            });
            setStatus("idle");
          }}
          data-testid="contact-reset-btn"
        >
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      data-testid="contact-form"
      className="flex flex-col gap-6"
    >
      {/* Honeypot — hidden from users, catches bots */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={set("website")}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nome" htmlFor="name" required error={errors.name}>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Seu nome"
            className={cn(fieldBase, errors.name && "border-red-400/60")}
            data-testid="input-name"
          />
        </Field>
        <Field label="E-mail" htmlFor="email" required error={errors.email}>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="voce@empresa.com"
            className={cn(fieldBase, errors.email && "border-red-400/60")}
            data-testid="input-email"
          />
        </Field>
        <Field label="Empresa" htmlFor="company">
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={set("company")}
            placeholder="Nome da empresa"
            className={fieldBase}
            data-testid="input-company"
          />
        </Field>
        <Field label="Telefone" htmlFor="phone">
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+55 (11) 90000-0000"
            className={fieldBase}
            data-testid="input-phone"
          />
        </Field>
      </div>

      <Field label="Interesse" htmlFor="interest">
        <select
          id="interest"
          value={form.interest}
          onChange={set("interest")}
          className={cn(fieldBase, "appearance-none")}
          data-testid="input-interest"
        >
          {CONTACT.interests.map((opt) => (
            <option key={opt} value={opt} className="bg-obsidian">
              {opt}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Mensagem" htmlFor="message" required error={errors.message}>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="Conte-nos sobre seu projeto e objetivos."
          className={cn(fieldBase, "resize-none", errors.message && "border-red-400/60")}
          data-testid="input-message"
        />
      </Field>

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 font-sans text-sm text-ivory-muted">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={set("consent")}
            className="mt-0.5 h-4 w-4 shrink-0 accent-champagne"
            data-testid="input-consent"
          />
          <span>
            Concordo com o tratamento dos meus dados conforme a{" "}
            <a
              href="/politica-de-privacidade"
              className="text-ivory underline decoration-champagne/50 underline-offset-4 hover:text-champagne"
            >
              Política de Privacidade
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <span
            className="flex items-center gap-1.5 font-sans text-xs text-red-400"
            data-testid="error-consent"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.consent}
          </span>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={status === "loading"}
          icon={Send}
          data-testid="contact-submit-btn"
        >
          {status === "loading" ? "Enviando..." : "Enviar mensagem"}
        </Button>
      </div>
    </form>
  );
};
