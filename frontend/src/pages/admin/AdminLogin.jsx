import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, AlertCircle } from "lucide-react";
import { useSeo } from "@/lib/seo";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-[4px] border border-white/10 bg-obsidian px-4 py-3.5 font-sans text-sm text-ivory placeholder:text-ivory-muted/60 transition-colors focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne";

export default function AdminLogin() {
  useSeo({ title: "Admin", description: "Área administrativa.", path: "/admin/login" });
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/admin", { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (res.ok) navigate("/admin", { replace: true });
    else setError(res.error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.07),transparent_55%)]" />
      <div className="relative w-full max-w-md" data-testid="admin-login-page">
        <div className="mb-8 text-center">
          <p className="font-serif text-xl">
            <span className="text-ivory">NEW SAINT</span>{" "}
            <span className="italic text-champagne">VÉRON</span>
          </p>
          <p className="text-overline mt-3 text-ivory-muted">Painel de Leads</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-[6px] border border-white/[0.08] bg-graphite/50 p-8"
          data-testid="admin-login-form"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-white/10 text-champagne">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-serif text-2xl text-ivory">Acesso restrito</h1>
              <p className="font-sans text-xs text-ivory-muted">Entre para gerenciar os leads.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="admin-email" className="mb-2 block font-sans text-xs uppercase tracking-[0.16em] text-ivory-muted">
                E-mail
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldBase}
                placeholder="admin@newsaintveron.com"
                data-testid="admin-email-input"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block font-sans text-xs uppercase tracking-[0.16em] text-ivory-muted">
                Senha
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldBase}
                placeholder="••••••••"
                data-testid="admin-password-input"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <p
              className="mt-4 flex items-center gap-2 font-sans text-sm text-red-400"
              data-testid="admin-login-error"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}

          <div className="mt-8">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className={cn("w-full")}
              data-testid="admin-login-submit"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center font-sans text-xs text-ivory-muted">
          <a href="/" className="hover:text-champagne">← Voltar ao site</a>
        </p>
      </div>
    </div>
  );
}
