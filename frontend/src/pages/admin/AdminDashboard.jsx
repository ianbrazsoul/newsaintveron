import { useEffect, useState, useCallback, useRef } from "react";
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
  Search,
  Download,
  Volume2,
  VolumeX,
  CheckCheck,
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

const LeadCard = ({ lead, onStatus, onDelete, unread, onOpen }) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(lead.note || "");
  const [saving, setSaving] = useState(false);
  const st = STATUS[lead.status] || STATUS.novo;

  const saveNote = async () => {
    setSaving(true);
    await onStatus(lead.id, { note });
    setSaving(false);
  };

  const toggle = () => {
    setOpen((v) => {
      if (!v && unread) onOpen?.(lead.id);
      return !v;
    });
  };

  return (
    <div
      className={cn(
        "rounded-[4px] border bg-graphite/40 transition-colors",
        unread
          ? "border-champagne/40 bg-champagne/[0.03] hover:border-champagne/60"
          : "border-white/[0.07] hover:border-white/15"
      )}
      data-testid={`lead-card-${lead.id}`}
    >
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        data-testid={`lead-toggle-${lead.id}`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            {unread && (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-champagne"
                aria-label="Não lido"
                data-testid={`lead-unread-dot-${lead.id}`}
              />
            )}
            <span className={cn("font-serif text-xl", unread ? "text-ivory" : "text-ivory/90")}>
              {lead.name}
            </span>
            <span className={cn("rounded-full border px-2.5 py-0.5 font-sans text-[11px]", st.chip)}>
              {st.label}
            </span>
            {unread && (
              <span className="rounded-full bg-champagne px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-obsidian">
                Não lido
              </span>
            )}
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
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recentes");
  const [readIds, setReadIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("nsv_read_leads") || "[]"));
    } catch {
      return new Set();
    }
  });
  const [loading, setLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(
    () => localStorage.getItem("nsv_sound") !== "off"
  );
  const lastTotalRef = useRef(null);
  const audioCtxRef = useRef(null);

  const markRead = useCallback((id) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem("nsv_read_leads", JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      leads.forEach((l) => next.add(l.id));
      try {
        localStorage.setItem("nsv_read_leads", JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
    toast.success("Todos marcados como lidos.");
  }, [leads]);

  // Discreet two-note chime via Web Audio (no asset needed)
  const playChime = useCallback(() => {
    if (!soundOn) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      [
        [880, 0],
        [1174.66, 0.13],
      ].forEach(([freq, t]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + t);
        gain.gain.exponentialRampToValueAtTime(0.1, now + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.36);
      });
    } catch {
      /* ignore audio errors */
    }
  }, [soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((v) => {
      const next = !v;
      localStorage.setItem("nsv_sound", next ? "on" : "off");
      return next;
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        adminApi.get("/leads", { params: filter !== "todos" ? { status: filter } : {} }),
        adminApi.get("/leads/stats"),
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
      if (lastTotalRef.current === null) lastTotalRef.current = statsRes.data.total;
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  // Real-time-ish polling: alert (chime + toast) when the total grows
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const { data } = await adminApi.get("/leads/stats");
        if (lastTotalRef.current !== null && data.total > lastTotalRef.current) {
          const diff = data.total - lastTotalRef.current;
          playChime();
          toast.success(
            diff === 1 ? "Novo lead recebido!" : `${diff} novos leads recebidos!`
          );
          load();
        }
        lastTotalRef.current = data.total;
      } catch {
        /* silent — keep polling */
      }
    }, 20000);
    return () => clearInterval(id);
  }, [playChime, load]);

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

  const q = search.trim().toLowerCase();
  const searched = q
    ? leads.filter((l) =>
        [l.name, l.email, l.company, l.phone]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q))
      )
    : leads;

  const STATUS_ORDER = { novo: 0, em_contato: 1, qualificado: 2, descartado: 3 };
  const filtered = [...searched].sort((a, b) => {
    if (sort === "antigos") return new Date(a.created_at) - new Date(b.created_at);
    if (sort === "status")
      return (
        (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9) ||
        new Date(b.created_at) - new Date(a.created_at)
      );
    return new Date(b.created_at) - new Date(a.created_at); // recentes
  });

  const unreadCount = filtered.filter((l) => !readIds.has(l.id)).length;

  const exportCsv = () => {
    if (!filtered.length) {
      toast.error("Nada para exportar.");
      return;
    }
    const headers = [
      "Nome", "E-mail", "Empresa", "Telefone", "Interesse",
      "Status", "Nota", "Data", "Mensagem",
    ];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [headers.join(",")];
    filtered.forEach((l) => {
      lines.push(
        [
          l.name, l.email, l.company, l.phone, l.interest,
          STATUS[l.status]?.label || l.status, l.note,
          fmtDate(l.created_at), l.message,
        ]
          .map(esc)
          .join(",")
      );
    });
    const csv = "\ufeff" + lines.join("\r\n"); // BOM p/ acentos no Excel
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-nsv-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filtered.length} lead(s) exportado(s).`);
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
              onClick={toggleSound}
              aria-label={soundOn ? "Desativar aviso sonoro" : "Ativar aviso sonoro"}
              title={soundOn ? "Aviso sonoro ativado" : "Aviso sonoro desativado"}
              data-testid="admin-sound-toggle"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-[4px] border transition-colors",
                soundOn
                  ? "border-champagne/40 text-champagne hover:border-champagne"
                  : "border-white/10 text-ivory-muted hover:border-champagne/50 hover:text-champagne"
              )}
            >
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
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

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, e-mail, empresa..."
              data-testid="admin-search"
              className="w-full rounded-[4px] border border-white/10 bg-graphite/40 py-3 pl-10 pr-4 font-sans text-sm text-ivory placeholder:text-ivory-muted/60 focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              data-testid="admin-sort"
              className="rounded-[4px] border border-white/10 bg-graphite/40 px-3 py-3 font-sans text-sm text-ivory focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
              aria-label="Ordenar leads"
            >
              <option value="recentes" className="bg-obsidian">Mais recentes</option>
              <option value="antigos" className="bg-obsidian">Mais antigos</option>
              <option value="status" className="bg-obsidian">Por status</option>
            </select>
            <span className="font-sans text-xs text-ivory-muted">
              {filtered.length} resultado(s)
              {unreadCount > 0 && (
                <span className="ml-1 text-champagne" data-testid="admin-unread-count">
                  · {unreadCount} não lido(s)
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                data-testid="admin-mark-all-read"
                className="flex items-center gap-1.5 rounded-[4px] border border-white/10 px-3 py-2 font-sans text-xs text-ivory-muted transition-colors hover:border-champagne/50 hover:text-champagne"
              >
                <CheckCheck className="h-4 w-4" /> Marcar todos como lidos
              </button>
            )}
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={exportCsv}
              data-testid="admin-export-csv"
            >
              Exportar CSV
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-7 w-7 animate-spin text-champagne" />
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-[6px] border border-dashed border-white/[0.1] py-24 text-center"
              data-testid="admin-empty"
            >
              <Inbox className="h-10 w-10 text-ivory-muted" />
              <p className="mt-4 font-serif text-xl text-ivory">
                {q ? "Nenhum resultado para a busca" : "Nenhum lead por aqui"}
              </p>
              <p className="mt-2 font-sans text-sm text-ivory-muted">
                {q
                  ? "Tente outro termo de busca."
                  : "Os leads enviados pelo formulário do site aparecem aqui."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onStatus={onStatus}
                  onDelete={onDelete}
                  unread={!readIds.has(lead.id)}
                  onOpen={markRead}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
