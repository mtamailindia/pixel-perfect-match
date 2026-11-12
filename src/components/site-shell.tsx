import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigation, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return <header className="site-header">
    <div className="container-site header-inner">
      <Link to="/" className="wordmark" aria-label="KRYZALON home">KRYZALON<span className="wordmark-dot">.</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <Link key={item.to} to={item.to} activeOptions={{ exact: true }} className="nav-link">{item.label}</Link>)}</nav>
      <Button asChild variant="nav" className="header-cta h-10 text-xs"><Link to="/about">Explore KRYZALON <ArrowRight /></Link></Button>
      <Button variant="heroOutline" size="icon" className="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{navigation.map(item => <Link key={item.to} to={item.to} className="nav-link" activeOptions={{ exact:true }}>{item.label}</Link>)}</nav>}
  </header>;
}

export function Footer() {
  return <footer className="footer"><div className="container-site">
    <div className="footer-main"><div className="footer-brand"><Link to="/" className="wordmark">KRYZALON<span className="wordmark-dot">.</span></Link><p className="footer-copy">Ideas into products. Technology into impact.<br />An emerging technology brand at the intersection of engineering, design and digital innovation.</p></div>
      <div><h2 className="footer-heading">EXPLORE</h2><nav className="footer-links" aria-label="Footer navigation">{navigation.slice(1).map(item => <Link key={item.to} to={item.to}>{item.label}</Link>)}</nav></div>
      <div><h2 className="footer-heading">LET’S CONNECT</h2><div className="footer-links"><span className="flex items-center gap-2"><MapPin className="size-3" />{site.location}</span><a href={`mailto:${site.contactEmail}`} className="break-all">{site.contactEmail}</a><a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp: {site.whatsappNumber}</a><Link to="/contact">Start a conversation <ArrowRight className="inline size-3" /></Link><span className="footer-copy">Building what comes next.</span></div></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getUTCFullYear()} KRYZALON. All rights reserved.</span><div className="flex gap-6"><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Use</Link></div></div>
  </div></footer>;
}