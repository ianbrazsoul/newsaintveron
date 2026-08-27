import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  LogOut,
  Mail,
  Phone,
  Building2,
  Trash2,
  RefreshCw,
  Inbox,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useSeo } from "@/lib/seo";
import { useAuth } from "@/context/AuthContext";
import { adminApi, formatApiError } from "@/lib/adminApi";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

const STATUS = {
  novo: { label: "Novo", chip: "border-champagne/40 text-champagne bg-champagne/5" },
  em_contato: { label: "Em contato", chip: "border-blue-400/40 text-blue-300 bg-blue-400/5" },
  qualificado: { label: "Qualificado", chip: "border-emerald-400/40 text-emerald-300 bg-emerald-400/5" },
  descartado: { label: "Descartado", chip: "border-white/15 text-ivory-muted bg-white/5" },
};
const STATUS_KEYS = ["novo", "em_contato", "qualificado", "descartado"];

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const StatCard = ({ label, value, active, onClick, testid }) => (
  <button
    onClick={onClick}
    data-testid={testid}
    className={cn(
      "flex flex-col items-start rounded-[4px] border p-5 text-left transition-all duration-300",
      active
        ? "border-champagne/50 bg-graphite"
        : "border-white/[0.07] bg-graphite/40 hover:border-white/20"
    )}
  >
    <span className="font-serif text-4xl text-ivory">{value}</span>
    <span className="mt-1 font-sans text-xs uppercase tracking-[0.14em] text-ivory-muted">
      {label}
    </span>
  </button>
);

const LeadCard = ({ lead, onStatus, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(lead.note || "");
  const [saving, setSaving] = useState(false);
  const st = STATUS[lead.status] || STATUS.novo;

  const saveNote = async () => {
    setSaving(true);
    await onStatus(lead.id, { note });
    setSaving(false);
  };

  return (
    <div
      className="rounded-[4px] border border-white/[0.07] bg-graphite/40 transition-colors hover:border-white/15"
      data-testid={`lead-card-${lead.id}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        data-testid={`lead-toggle-${lead.id}`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-serif text-xl text-ivory">{lead.name}</span>
            <span className={cn("rounded-full border px-2.5 py-0.5 font-sans text-[11px]", st.chip)}>
              {st.label}
            </span>
            {lead.interest && (
              <span className="font-sans text-xs text-ivory-muted">· {lead.interest}</span>
            )}
          </div>
          <p className="mt-1 truncate font-sans text-sm text-ivory-muted">{lead.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-sans text-xs text-ivory-muted sm:block">
            {fmtDate(lead.created_at)}
          </span>
          <ChevronDown
            className={cn("h-5 w-5 text-ivory-muted transition-transform", open && "rotate-180")}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-white/[0.07] p-5" data-testid={`lead-detail-${lead.id}`}>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-2 font-sans text-sm text-ivory-muted hover:text-champagne"
            >
              <Mail className="h-4 w-4" /> {lead.email}
            </a>
            {lead.phone && (
              <span className="flex items-center gap-2 font-sans text-sm text-ivory-muted">
                <Phone className="h-4 w-4" /> {lead.phone}
              </span>
            )}
            {lead.company && (
              <span className="flex items-center gap-2 font-sans text-sm text-ivory-muted">
                <Building2 className="h-4 w-4" /> {lead.company}
              </span>
            )}
          </div>

          <p className="mt-5 whitespace-pre-wrap rounded-[4px] border border-white/[0.06] bg-obsidian p-4 font-sans text-sm leading-relaxed text-ivory">
            {lead.message}
          </p>

          <div className="mt-5">
            <p className="mb-2 font-sans text-xs uppercase tracking-[0.14em] text-ivory-muted">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_KEYS.map((k) => (
                <button
                  key={k}
                  onClick={() => onStatus(lead.id, { status: k })}
                  data-testid={`lead-status-${k}-${lead.id}`}
                  className={cn(
                    "rounded-full border px-3 py-1.5 font-sans text-xs transition-all",
                    lead.status === k
                      ? STATUS[k].chip
                      : "border-white/10 text-ivory-muted hover:border-white/30"
                  )}
                >
                  {STATUS[k].label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 font-sans text-xs uppercase tracking-[0.14em] text-ivory-muted">
              Nota interna
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Anotações sobre a triagem deste lead..."
              className="w-full resize-none rounded-[4px] border border-white/10 bg-obsidian px-4 py-3 font-sans text-sm text-ivory placeholder:text-ivory-muted/60 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
              data-testid={`lead-note-${lead.id}`}
            />
            <div className="mt-3 flex items-center justify-between">
              <Button variant="secondary" size="sm" loading={saving} onClick={saveNote} data-testid={`lead-save-note-${lead.id}`}>
                Salvar nota
              </Button>
              <button
                onClick={() => onDelete(lead.id)}
                data-testid={`lead-delete-${lead.id}`}
                className="flex items-center gap-2 font-sans text-xs text-ivory-muted transition-colors hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" /> Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  useSeo({ title: "Painel de Leads", description: "Área administrativa.", path: "/admin" });
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("todos");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        adminApi.get("/leads", { params: filter !== "todos" ? { status: filter } : {} }),
        adminApi.get("/leads/stats"),
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const onStatus = async (id, patch) => {
    try {
      await adminApi.patch(`/leads/${id}`, patch);
      toast.success("Lead atualizado.");
      load();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    }
  };

  const onDelete = async (id) => {
    try {
      await adminApi.delete(`/leads/${id}`);
      toast.success("Lead excluído.");
      load();
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    }
  };

  return (
    <div className="min-h-screen bg-obsidian" data-testid="admin-dashboard">
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-obsidian/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-serif text-lg">
              <span className="text-ivory">NEW SAINT</span>{" "}
              <span className="italic text-champagne">VÉRON</span>
            </p>
            <p className="font-sans text-xs text-ivory-muted">Painel de Leads</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-sans text-sm text-ivory-muted sm:block">
              {user?.email}
            </span>
            <button
              onClick={load}
              aria-label="Recarregar"
              data-testid="admin-refresh"
              className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-white/10 text-ivory-muted transition-colors hover:border-champagne/50 hover:text-champagne"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={logout}
              data-testid="admin-logout"
              className="flex items-center gap-2 rounded-[4px] border border-white/10 px-4 py-2 font-sans text-sm text-ivory-muted transition-colors hover:border-champagne/50 hover:text-champagne"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Total"
            value={stats ? stats.total : "—"}
            active={filter === "todos"}
            onClick={() => setFilter("todos")}
            testid="stat-todos"
          />
          {STATUS_KEYS.map((k) => (
            <StatCard
              key={k}
              label={STATUS[k].label}
              value={stats ? stats[k] : "—"}
              active={filter === k}
              onClick={() => setFilter(k)}
              testid={`stat-${k}`}
            />
          ))}
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-7 w-7 animate-spin text-champagne" />
            </div>
          ) : leads.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-[6px] border border-dashed border-white/[0.1] py-24 text-center"
              data-testid="admin-empty"
            >
              <Inbox className="h-10 w-10 text-ivory-muted" />
              <p className="mt-4 font-serif text-xl text-ivory">Nenhum lead por aqui</p>
              <p className="mt-2 font-sans text-sm text-ivory-muted">
                Os leads enviados pelo formulário do site aparecem aqui.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onStatus={onStatus} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
