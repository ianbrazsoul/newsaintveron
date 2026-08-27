import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV } from "@/data/content";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

const Wordmark = ({ onClick }) => (
  <Link
    to="/"
    onClick={onClick}
    data-testid="brand-logo"
    aria-label="NEW SAINT VÉRON — início"
    className="group flex items-baseline gap-2 font-serif leading-none"
  >
    <span className="text-lg tracking-tight text-ivory transition-colors group-hover:text-champagne md:text-xl">
      NEW SAINT
    </span>
    <span className="text-lg italic tracking-tight text-champagne md:text-xl">
      VÉRON
    </span>
  </Link>
);

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      data-testid="site-header"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/[0.07] bg-obsidian/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        <Wordmark />

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-9 lg:flex"
        >
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={`nav-link-${item.to === "/" ? "home" : item.to.slice(1)}`}
              className={({ isActive }) =>
                cn(
                  "relative font-sans text-sm text-ivory-muted transition-colors duration-300 hover:text-ivory",
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-champagne after:transition-all after:duration-300",
                  isActive
                    ? "text-ivory after:w-full"
                    : "after:w-0 hover:after:w-full"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Button variant="primary" size="sm" to="/contato" data-testid="header-cta-btn">
            Fale conosco
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          data-testid="mobile-menu-toggle"
          className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-white/10 text-ivory transition-colors hover:border-champagne/50 hover:text-champagne lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-20 z-40 bg-obsidian px-6 pb-10 pt-8 lg:hidden"
            data-testid="mobile-menu"
          >
            <nav aria-label="Navegação mobile" className="flex flex-col">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.05, duration: 0.4 }}
                >
                  <NavLink
                    to={item.to}
                    data-testid={`mobile-nav-link-${item.to === "/" ? "home" : item.to.slice(1)}`}
                    className={({ isActive }) =>
                      cn(
                        "block border-b border-white/[0.07] py-5 font-serif text-3xl tracking-tight transition-colors",
                        isActive ? "text-champagne" : "text-ivory hover:text-champagne"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="mt-8">
              <Button variant="primary" size="lg" to="/contato" className="w-full" data-testid="mobile-cta-btn">
                Fale conosco
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
