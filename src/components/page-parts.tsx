import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Box, Code2, Compass, Lightbulb, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import physical from "@/assets/physical-concepts.jpg";
import digital from "@/assets/digital-concepts.jpg";

export function Eyebrow({children}: {children:ReactNode}) { return <div className="eyebrow">{children}</div>; }
export function PageHero({eyebrow,title,children}: {eyebrow:string;title:string;children:ReactNode}) { return <section className="page-hero"><div className="container-site reveal"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{children}</p></div></section>; }
export function ContactCTA({title="Have an idea worth building?", description="Let’s talk about ideas, possibilities and what we could create together.", label="Start a Conversation"}: {title?:string;description?:string;label?:string}) { return <section className="contact-band"><div className="container-site next-inner"><div><h2>{title}</h2><p className="section-copy">{description}</p></div><Button asChild size="lg"><Link to="/contact">{label}<ArrowRight /></Link></Button></div></section>; }
export function FocusCards() { return <><div className="focus-grid">
  <article className="focus-card"><img src={physical} className="focus-image" width={1200} height={800} loading="lazy" alt="Conceptual 3D-printed gear, geometric model, blue toy and engineering bracket" /><div className="focus-body"><div className="focus-title-row"><Box /><h3>Physical Products & 3D Printing</h3></div><p>Bringing ideas into the physical world through thoughtful design, prototyping and additive manufacturing.</p><div className="tag-list">{["3D Printing","Prototyping","Engineering Parts","Creative Products"].map(t=><span key={t} className="pill">{t}</span>)}</div><Link to="/3d-printing" className="text-link">Explore 3D Printing <ArrowRight /></Link></div></article>
  <article className="focus-card"><img src={digital} className="focus-image" width={1200} height={800} loading="lazy" alt="Conceptual glass software panels with blue charts above a silver device" /><div className="focus-body"><div className="focus-title-row"><Code2 /><h3>Software & Digital Products</h3></div><p>Exploring proprietary software that makes everyday experiences simpler, smarter and more meaningful.</p><div className="tag-list">{["Mobile Apps","SaaS Platforms","AI-Powered Products"].map(t=><span key={t} className="pill">{t}</span>)}<span className="pill text-primary">In Development</span></div><Link to="/software" className="text-link">Explore Software Products <ArrowRight /></Link></div></article>
 </div><p className="image-note">Concept visuals — not photographs of KRYZALON products or facilities.</p></>; }
export function Process() {return <section className="section process-section"><div className="container-site"><Eyebrow>FROM CONCEPT TO PRODUCT</Eyebrow><h2 className="section-heading">Every product starts with a possibility.</h2><div className="process-grid">{[
 ["01","Imagine","Find a real need. Ask better questions. Explore the possibilities beyond the obvious."],
 ["02","Engineer","Connect thoughtful design with technical thinking. Test ideas and refine the details."],
 ["03","Create","Turn a considered concept into something useful — physical, digital or a little of both."],
 ].map(([n,title,copy])=><div key={n} className="process-item"><span className="step-number">{n} /</span><h3>{title}</h3><p className="section-copy">{copy}</p></div>)}</div></div></section>;}
export function Principles() {return <section className="section"><div className="container-site"><Eyebrow>OUR APPROACH</Eyebrow><h2 className="section-heading">Thoughtful by design. Driven by purpose.</h2><div className="principles-grid">{[
 {Icon:Lightbulb,title:"Purposeful Innovation",copy:"Not technology for its own sake. We look for ideas with the potential to make a meaningful difference."},
 {Icon:Layers3,title:"Engineering-Led Thinking",copy:"Curiosity, practical reasoning and attention to detail form the foundation of how we aim to build."},
 {Icon:Compass,title:"Products Built for Real Needs",copy:"Useful products begin with people. We focus on genuine problems and considered experiences."},
 ].map(({Icon,title,copy})=><div key={title}><Icon className="principle-icon"/><h3>{title}</h3><p className="section-copy">{copy}</p></div>)}</div></div></section>;}