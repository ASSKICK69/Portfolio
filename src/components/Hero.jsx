import { useEffect, useState } from 'react'
import { WORDS } from '../data/content.js'
import portrait from '../assets/hero-portrait.webp'
import analytics from '../assets/hero-analytics.webp'
import social from '../assets/hero-social.webp'
import brand from '../assets/hero-brand.webp'

export default function Hero() {
  const [wi, setWi] = useState(0)

  // Rotating headline word
  useEffect(() => {
    const t = setInterval(() => {
      setWi((i) => (i + 1) % WORDS.length)
    }, 2400)

    return () => clearInterval(t)
  }, [])

  // Hero parallax
  const onMove = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()

    el.style.setProperty(
      '--mx',
      ((e.clientX - r.left) / r.width - 0.5).toFixed(3)
    )

    el.style.setProperty(
      '--my',
      ((e.clientY - r.top) / r.height - 0.5).toFixed(3)
    )
  }

  return (
    <header
      className="hero"
      id="top"
      aria-label="Introduction"
      onMouseMove={onMove}
    >
      <div className="sh1"></div>
      <div className="sh2"></div>
      <div className="sh3"></div>

      <div className="w hg">
        {/* Hero introduction */}
        <div>
          <div className="chip">
            <i></i>
            Open to new projects
          </div>

          <div className="hi">Hello, I'm Ashique</div>

          <h1>
            I design
            <span
              className="rot"
              id="rot"
              aria-live="polite"
            >
              <span key={wi}>{WORDS[wi]}</span>
            </span>
            <span className="o">&amp; more.</span>
          </h1>

          <div className="who">
            Mohammed Ashique — Digital Marketing · Brand &amp; Content
            Strategy · Creative Direction
          </div>

          <p className="sub">
            I’m a multidisciplinary creative professional passionate about
            transforming ideas into meaningful experiences. With expertise in
            interior design, graphic design, and digital marketing, I combine
            visual creativity with strategic thinking to design impactful
            spaces, build memorable brands, and drive growth. Currently
            working as a <b className="hl">Marketing Lead</b>, bringing
            creativity and strategy together.
          </p>

          {/* Call-to-action buttons */}
          <div className="bt">
            <a className="btn p" href="#work">
              See my interiors <span aria-hidden="true">↗</span>
            </a>

            <a className="btn g" href="#marketing">
              Marketing &amp; graphics{' '}
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          {/* Current position */}
          <div className="now">
            <span className="av">SIB</span>

            <div>
              <small>Currently</small>
              <b>Marketing Lead · Study in Bengaluru</b>
            </div>
          </div>

          {/* Professional statistics */}
          <div className="stats">
            <div>
              <b>3+</b>
              <span>Years experience</span>
            </div>

            <div>
              <b>4</b>
              <span>Design disciplines</span>
            </div>

            <div>
              <b>6</b>
              <span>Social pages run</span>
            </div>
          </div>
        </div>

        {/* Hero visual composition */}
        <div className="pt">
          <div
            className="cg"
            id="cg"
            aria-label="Design and marketing visuals"
          >
            {/* Main portrait */}
            {/* Main portrait */}
<figure className="cc pf">
  <img
    src={portrait}
    alt="Portrait of Mohammed Ashique"
    width="960"
    height="1264"
    decoding="async"
    loading="eager"
    fetchPriority="high"
  />
</figure>

            {/* Analytics visual */}
            <figure className="cc c1">
              <img
                src={analytics}
                alt="Analytics dashboards on a tablet and monitors"
                width="640"
                height="1140"
                decoding="async"
                loading="lazy"
              />
              <figcaption>Analytics</figcaption>
            </figure>

            {/* Social media visual */}
            <figure className="cc c2">
              <img
                src={social}
                alt="Social media marketing icons floating above a laptop"
                width="640"
                height="960"
                decoding="async"
                loading="lazy"
              />
              <figcaption>Social media</figcaption>
            </figure>

            {/* Brand design visual */}
            <figure className="cc c3">
              <img
                src={brand}
                alt="Brand identity design on a curved monitor and laptop"
                width="640"
                height="800"
                decoding="async"
                loading="lazy"
              />
              <figcaption>Brand design</figcaption>
            </figure>
          </div>

          {/* Circular design badge */}
          <svg
            className="badge"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            <defs>
              <path
                id="cp"
                d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
              />
            </defs>

            <text>
              <textPath href="#cp">
                Interior · Graphic · Marketing · UI/UX ·
              </textPath>
            </text>
          </svg>

          <span className="stk">Marketing Lead ✦</span>
        </div>
      </div>
    </header>
  )
}
