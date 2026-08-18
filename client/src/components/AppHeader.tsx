import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Activity, ArrowUpRight, Menu, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

const navItems = [
  { label: "Overview", path: "/" },
  { label: "Live workspace", path: "/dashboard" },
  { label: "Architecture", path: "/architecture" },
];

export default function AppHeader() {
  const [location, setLocation] = useLocation();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <button className="brand-mark" onClick={() => setLocation("/")} aria-label="PulseStream home">
          <span className="brand-icon"><Activity size={18} strokeWidth={2.6} /></span>
          <span>Pulse<span>Stream</span></span>
        </button>

        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={location === item.path ? "active" : ""}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <div className="secure-pill"><ShieldCheck size={14} /> Auth-ready</div>
          <Button className="signin-button" variant="ghost" onClick={() => startLogin()}>Sign in</Button>
          <Button className="header-demo" onClick={() => setLocation("/dashboard")}>
            Try demo <ArrowUpRight size={15} />
          </Button>
          <button className="mobile-menu" aria-label="Open navigation"><Menu size={20} /></button>
        </div>
      </div>
    </header>
  );
}
