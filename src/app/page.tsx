import Hero         from "@/components/sections/Hero"
import FeaturedVideo from "@/components/sections/FeaturedVideo"
import Philosophy    from "@/components/sections/Philosophy"
import Services      from "@/components/sections/Services"
import About         from "@/components/sections/About"
import Experience    from "@/components/sections/Experience"
import Projects      from "@/components/sections/Projects"
import Contact       from "@/components/sections/Contact"

/* Thin gradient separator — fades into the next section */
function Fade({ from = 'transparent', to = 'transparent', via = 'rgba(255,255,255,0.03)' }) {
  return (
    <div
      aria-hidden
      style={{
        height: 120,
        background: `linear-gradient(to bottom, ${from}, ${via} 50%, ${to})`,
        pointerEvents: 'none',
        position: 'relative',
        zIndex: 1,
      }}
    />
  )
}

export default function Home() {
  return (
    <main className="relative z-10">

      {/* ── Hero — video + Instrument Serif + typewriter ── */}
      <Hero />

      {/* ── Featured work ── */}
      <Fade via="rgba(0,212,255,0.03)" />
      <FeaturedVideo />

      {/* ── Philosophy ── */}
      <Fade via="rgba(135,251,137,0.025)" />
      <Philosophy />

      {/* ── What I Build ── */}
      <Fade via="rgba(167,139,250,0.03)" />
      <Services />

      {/* ── About + skills bento grid ── */}
      <Fade via="rgba(0,212,255,0.025)" />
      <About />

      {/* ── Experience timeline ── */}
      <Fade via="rgba(56,189,248,0.03)" />
      <Experience />

      {/* ── Projects grid ── */}
      <Fade via="rgba(0,212,255,0.03)" />
      <Projects />

      {/* ── Contact ── */}
      <Fade via="rgba(135,251,137,0.025)" />
      <Contact />

    </main>
  )
}
