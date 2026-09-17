import Hero             from "@/components/sections/Hero"
import TerminalSection  from "@/components/sections/TerminalSection"
import FeaturedVideo    from "@/components/sections/FeaturedVideo"
import Philosophy     from "@/components/sections/Philosophy"
import Services       from "@/components/sections/Services"
import About          from "@/components/sections/About"
import Experience     from "@/components/sections/Experience"
import Projects       from "@/components/sections/Projects"
import Research       from "@/components/sections/Research"
import Contact        from "@/components/sections/Contact"
import SectionDivider from "@/components/ui/SectionDivider"

export default function Home() {
  return (
    <main className="relative z-10">

      {/* ── Hero — video + particle galaxy + typewriter ── */}
      <Hero />

      {/* ── Terminal showcase strip ── */}
      <TerminalSection />

      {/* ─────────────────────── divider ─────────────────────── */}
      <SectionDivider colorRgb="135,251,137" label="Featured Work" />

      {/* ── Featured work ── */}
      <div className="section-glow-green">
        <FeaturedVideo />
      </div>

      {/* ─────────────────────── divider ─────────────────────── */}
      <SectionDivider colorRgb="0,212,255" label="Philosophy" />

      {/* ── Philosophy ── */}
      <div className="section-glow-cyan">
        <Philosophy />
      </div>

      {/* ─────────────────────── divider ─────────────────────── */}
      <SectionDivider colorRgb="167,139,250" label="Services" />

      {/* ── What I Build ── */}
      <div className="section-glow-violet">
        <Services />
      </div>

      {/* ─────────────────────── divider ─────────────────────── */}
      <SectionDivider colorRgb="0,212,255" label="About" />

      {/* ── About + skills bento grid ── */}
      <div className="section-glow-cyan">
        <About />
      </div>

      {/* ─────────────────────── divider ─────────────────────── */}
      <SectionDivider colorRgb="56,189,248" label="Experience" />

      {/* ── Experience timeline ── */}
      <div className="section-glow-blue">
        <Experience />
      </div>

      {/* ─────────────────────── divider ─────────────────────── */}
      <SectionDivider colorRgb="0,212,255" label="Projects" />

      {/* ── Projects grid ── */}
      <div className="section-glow-cyan">
        <Projects />
      </div>

      {/* ─────────────────────── divider ─────────────────────── */}
      <SectionDivider colorRgb="240,171,252" label="Research" />

      {/* ── Research / publications ── */}
      <div className="section-glow-violet">
        <Research />
      </div>

      {/* ─────────────────────── divider ─────────────────────── */}
      <SectionDivider colorRgb="135,251,137" label="Contact" />

      {/* ── Contact ── */}
      <div className="section-glow-green">
        <Contact />
      </div>

    </main>
  )
}
