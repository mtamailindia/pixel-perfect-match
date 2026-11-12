import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowDown, MapPin, MoveUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactCTA, Eyebrow, FocusCards, Principles, Process } from "@/components/page-parts";
import { pageHead } from "@/lib/site";
import hero from "@/assets/engineering-concepts.jpg";

export const Route = createFileRoute("/")({
  head: () => pageHead("KRYZALON | Technology, Engineering & Product Innovation", "KRYZALON is an emerging technology brand exploring 3D printing, physical product development, engineering and proprietary software products."),
  component: Index,
});
function Index() {
 return <main>
  <section className="hero"><img className="hero-image" src={hero} width={1536} height={1024} fetchPriority="high" alt="Conceptual precision-engineered silver ring, blue ribbed block and translucent cyan cube" /><div className="hero-shade" />
   <div className="container-site hero-content"><div className="reveal"><Eyebrow><span className="status-dot" /> ENGINEERING WHAT’S NEXT</Eyebrow><h1 className="hero-title">Ideas Into Products.<br /><span className="blue-line">Technology Into<br />Impact.</span></h1><p className="hero-description">An emerging technology brand building toward a future of innovative physical products, advanced manufacturing and proprietary software.</p><div className="hero-actions"><Button asChild variant="hero" size="lg"><a href="#focus">Explore Our Focus Areas<ArrowRight /></a></Button><Button asChild variant="heroOutline" size="lg"><Link to="/about">Discover KRYZALON<MoveUpRight /></Link></Button></div></div><div className="hero-bottom"><span><MapPin /> Bengaluru, India <span className="mx-2">/</span> Built on curiosity. Driven by engineering.</span><span>EXPLORE THE POSSIBILITIES <ArrowDown /></span></div></div>
  </section>
  <section className="section"><div className="container-site intro-layout"><div><Eyebrow>THIS IS KRYZALON</Eyebrow><h2 className="section-heading">One vision.<br />A world of possibilities.</h2></div><div><p className="section-copy">We believe the best ideas deserve to become real. KRYZALON is an emerging technology venture connecting engineering, manufacturing and software to explore what comes next.</p><p className="section-copy mt-4">From a physical prototype to a digital experience, our ambition is simple: create useful products with thought, purpose and possibility.</p><Link to="/about" className="text-link">Get to know KRYZALON <ArrowRight /></Link></div></div></section>
  <section className="section bg-muted" id="focus"><div className="container-site"><div className="section-head-row"><div><Eyebrow>OUR FOCUS AREAS</Eyebrow><h2 className="section-heading">Two directions. One product mindset.</h2></div><p className="section-copy">Exploring the physical and digital worlds — with engineering at the core of both.</p></div><FocusCards /></div></section>
  <Process /><Principles />
  <section className="next-band"><div className="container-site next-inner"><div><Eyebrow><span className="status-dot" /> THE JOURNEY IS JUST BEGINNING</Eyebrow><h2>Building the foundations for what’s next.</h2><p className="section-copy mt-3">We’re shaping our product direction and preparing for future launches.</p></div><Button asChild variant="outline" size="lg"><Link to="/about">Follow Our Journey <ArrowRight /></Link></Button></div></section>
  <ContactCTA />
 </main>;
}
