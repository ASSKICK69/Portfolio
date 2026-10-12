import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { GRAPHICS } from '../data/graphics.js'
import { UIUX } from '../data/content.js'
import Pic from './Pic.jsx'

const CATS = ['All', ...new Set(GRAPHICS.map((g) => g.cat))]
const pad = (n) => String(n).padStart(2, '0')

export default function Graphics({ openLightbox }) {
  const [cf, setCf] = useState('All')
  const [grid, setGrid] = useState(false)
  const [idx, setIdx] = useState(0)

  const L = useMemo(
    () => GRAPHICS.map((g, k) => ({ g, k })).filter((o) => cf === 'All' || o.g.cat === cf),
    [cf]
  )

  const trk = useRef(null)
  const stage = useRef(null)
  const thRef = useRef(null)
  const Lref = useRef(L)
  const gridRef = useRef(grid)
  Lref.current = L
  gridRef.current = grid

  // mutable carousel state (kept out of React state for 60fps animation)
  const s = useRef({
    pos: 0, tgt: null, drag: false, vis: true, hov: 0,
    sx: null, mv: 0, lx: 0, P: [], Tot: 1, ci: -1, sds: [], lastT: 0,
  }).current

  const measure = useCallback(() => {
    if (!s.sds.length) return
    const t = trk.current
    const W = t.clientWidth, H = t.clientHeight * 0.86, gap = Math.max(36, W * 0.05)
    let x = 0
    s.P = []
    s.sds.forEach((e, i) => {
      const r = Lref.current[i].g.r
      const w = Math.min(H * r, W * (W < 700 ? 0.76 : 0.6))
      e.style.width = w + 'px'
      e.style.height = w / r + 'px'
      s.P.push(x + w / 2)
      x += w + gap
    })
    s.Tot = x
  }, [s])

  const draw = useCallback(() => {
    const n = s.sds.length
    if (!n || !s.P.length) return
    const W = trk.current.clientWidth
    const a = ((s.pos % n) + n) % n
    const i0 = Math.floor(a), f = a - i0
    const nx = i0 + 1 < n ? s.P[i0 + 1] : s.P[0] + s.Tot
    const F = s.P[i0] + (nx - s.P[i0]) * f
    s.sds.forEach((e, i) => {
      let tx = s.P[i] - F
      if (tx > s.Tot / 2) tx -= s.Tot
      else if (tx < -s.Tot / 2) tx += s.Tot
      const u = tx / (W * 0.42), m = Math.min(Math.abs(u), 1.5), sg = Math.sign(u)
      e.style.transform = `translate(-50%,-50%) translateX(${tx}px) translateZ(${-m * 90}px) rotateY(${-sg * Math.min(Math.abs(u), 1) * 32}deg) scale(${1 - Math.min(m, 1.3) * 0.2})`
      e.style.opacity = Math.max(0, 1 - Math.max(0, m - 0.4) * 0.7)
      e.style.zIndex = 100 - Math.round(m * 10)
      e.style.pointerEvents = m > 1.4 ? 'none' : 'auto'
    })
    const k = Math.round(a) % n
    if (k !== s.ci) {
      s.ci = k
      s.sds.forEach((e, i) => e.classList.toggle('act', i === k))
      setIdx(k)
    }
  }, [s])

  // Rebuild carousel whenever the filter changes
  useLayoutEffect(() => {
    s.sds = [...trk.current.children]
    s.ci = -1
    s.pos = 0
    s.tgt = null
    measure()
    draw()
  }, [L, s, measure, draw])

  // Re-measure when switching back from grid view
  useLayoutEffect(() => {
    if (!grid) { measure(); draw() }
  }, [grid, measure, draw])

  // Animation loop, resize, pointer drag, visibility
  useEffect(() => {
    const calm = matchMedia('(prefers-reduced-motion:reduce)').matches
    let raf
    const frame = (t) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (t - s.lastT) / 1000 || 0)
      s.lastT = t
      if (!s.sds.length || gridRef.current || !s.vis || document.hidden) return
      if (s.tgt !== null) {
        s.pos += (s.tgt - s.pos) * Math.min(1, dt * 5)
        if (Math.abs(s.tgt - s.pos) < 0.004) { s.pos = s.tgt; s.tgt = null }
      } else if (!s.drag && !calm) s.pos += dt * (s.hov ? 0.05 : 0.16)
      draw()
    }
    raf = requestAnimationFrame(frame)

    const onResize = () => measure()
    const onMove = (e) => {
      if (s.sx == null) return
      const d = e.clientX - s.lx
      s.lx = e.clientX
      s.mv += Math.abs(d)
      s.pos -= d / Math.max(160, (s.Tot / Math.max(1, s.sds.length)) * 0.8)
    }
    const onUp = () => {
      if (s.sx == null) return
      s.sx = null
      s.drag = false
      setTimeout(() => (s.mv = 0), 0)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    const io = new IntersectionObserver((es) => (s.vis = es[0].isIntersecting))
    io.observe(stage.current)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      io.disconnect()
    }
  }, [s, draw, measure])

  // Keep active thumbnail centred
  useEffect(() => {
    const th = thRef.current
    const t = th?.children[idx]
    if (t) th.scrollTo({ left: t.offsetLeft - th.clientWidth / 2 + t.offsetWidth / 2, behavior: 'smooth' })
  }, [idx, L])

  const go = (d) => { if (L.length) s.tgt = Math.round(s.pos) + d }

  const onThumb = (e) => {
    const b = e.target.closest('[data-t]')
    if (!b) return
    const n = s.sds.length
    let d = (((+b.dataset.t - s.pos) % n) + n) % n
    if (d > n / 2) d -= n
    s.tgt = s.pos + d
  }
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  }
  const onDown = (e) => { s.sx = e.clientX; s.lx = e.clientX; s.mv = 0; s.drag = true; s.tgt = null }
  const onClickCapture = (e) => { if (s.mv > 8) { e.stopPropagation(); e.preventDefault() } }

  const cur = L[Math.min(idx, L.length - 1)] || L[0]
  const hide = grid ? { visibility: 'hidden' } : undefined

  return (
    <section className="sec" id="creatives" style={{ paddingTop: 20 }}>
      <div className="w">
        <div className="sh rv">
          <div><small>Best works · Graphics</small><h2>Graphic <em>design</em></h2></div>
          <div className="sctl">
            <span className="cnt" id="cnt" style={hide}>{pad(idx + 1)} / {pad(L.length)}</span>
            <button className="sb" id="prv" style={hide} onClick={() => go(-1)} aria-label="Previous work">←</button>
            <button className="sb" id="nxt" style={hide} onClick={() => go(1)} aria-label="Next work">→</button>
          </div>
        </div>

        <div className="bar rv">
          <div className="tabs" id="tabs">
            {CATS.map((c) => (
              <button key={c} className={'tab' + (cf === c ? ' on' : '')} onClick={() => setCf(c)}>{c}</button>
            ))}
          </div>
          <button className="tab" id="vt" onClick={() => setGrid((g) => !g)}>
            {grid ? 'Showcase view ⇄' : 'Grid view ▦'}
          </button>
        </div>

        <div
          className="show rv"
          id="sl"
          hidden={grid}
          onMouseEnter={() => (s.hov = 1)}
          onFocus={() => (s.hov = 1)}
          onMouseLeave={() => (s.hov = 0)}
          onBlur={() => (s.hov = 0)}
        >
          <div className="inf sw" id="inf" key={idx}>
            <div className="in" id="inum">{pad(idx + 1)}</div>
            <small id="icat">{cur?.g.cat}</small>
            <h3 id="ittl">{cur?.g.title}</h3>
            <p id="idsc">{cur?.g.desc}</p>
            <button className="btn p" id="iv" data-cur="View" onClick={() => cur && openLightbox(cur.g)}>View full size ↗</button>
          </div>
          <div>
            <div
              className="stage"
              id="stage"
              ref={stage}
              tabIndex={0}
              aria-label="Graphic works showcase"
              onKeyDown={onKey}
              onPointerDown={onDown}
              onClickCapture={onClickCapture}
            >
              <img className="amb" id="amb" src={cur?.g.img} alt="" />
              <div id="trk" ref={trk}>
                {L.map(({ g, k }) => (
                  <div className="sd" key={k} data-cur="View" onClick={() => openLightbox(g)}>
                    <Pic src={g.img} alt={g.title} label={g.title} sub={g.cat} />
                  </div>
                ))}
              </div>
            </div>
            <div className="th" id="th" ref={thRef} onClick={onThumb}>
              {L.map(({ g, k }, i) => (
                <button key={k} data-t={i} className={i === idx ? 'on' : ''} aria-label={g.title}>
                  <img src={g.img} alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mas" id="mas" hidden={!grid}>
          {L.map(({ g, k }) => (
            <button key={k} className="cr" data-cur="View" onClick={() => openLightbox(g)}>
              <div className="im" style={{ aspectRatio: g.r }}>
                <Pic src={g.img} alt={g.title} label={g.title} sub={g.cat} />
              </div>
              <div className="tx"><small>{g.cat}</small><h3>{g.title}</h3><p>{g.desc}</p></div>
            </button>
          ))}
        </div>

        <div className="sh rv" style={{ marginTop: 70 }}>
          <div><small>04 — Digital</small><h2>UI / UX <em>projects</em></h2></div>
          <p>Live websites designed with a focus on clear structure and trust. Click a card to open the site.</p>
        </div>
        <div className="ux rv" id="ux">
          {UIUX.map((u, i) => {
            const dm = u.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
            return (
              <a
                className="uw"
                key={u.n}
                href={u.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cur="Visit"
                style={{ '--a': u.a }}
                aria-label={`Visit ${u.n} website`}
              >
                <div className="bw">
                  <div className="bh"><i></i><i></i><i></i><span>{dm}</span></div>
                  <div className="bp">
                    <div className="bi">
                      <div className="nv"><b></b><s></s><s></s><s></s></div>
                      <div className="hr"><small>{u.n}</small><h4>{u.h}</h4><p></p><p></p><u></u></div>
                      <div className="cds"><s></s><s></s><s></s></div>
                      <div className="cds"><s></s><s></s><s></s></div>
                    </div>
                  </div>
                </div>
                <div className="ui">
                  <small>{String(i + 1).padStart(2, '0')} · UI/UX Design</small>
                  <h3>{u.n}</h3>
                  <p>{u.d}</p>
                  <div className="tgs">{u.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  <span className="vs">Visit live site ↗</span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
