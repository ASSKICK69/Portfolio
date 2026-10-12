import { useCallback, useEffect, useRef, useState } from 'react'
import { REEL } from '../data/reel.js'

const pad = (n) => String(n).padStart(2, '0')

// 3D walkthrough video reel
export default function Interiors() {
  const vidRef = useRef(null)
  const wipeRef = useRef(null)
  const rsRef = useRef(null)
  const pgRef = useRef(null)
  const fpRefs = useRef([])
  const st = useRef({
    ri: -1,
    play: !matchMedia('(prefers-reduced-motion:reduce)').matches,
    vis: false,
    rt: null,
    to: null,
  }).current
  const [ri, setRi] = useState(0)
  const [icon, setIcon] = useState(() => (st.play ? '❚❚' : '▶'))

  const tryPlay = useCallback(() => {
    const vid = vidRef.current
    if (!vid || !(st.play && st.vis)) return
    vid.muted = true
    const q = vid.play()
    if (q && q.catch) q.catch(() => setIcon('▶'))
  }, [st])

  const show = useCallback((i, first) => {
    const n = REEL.length
    const k = ((i % n) + n) % n
    const r = REEL[k]
    const w = wipeRef.current
    const vid = vidRef.current
    st.ri = k
    clearTimeout(st.rt)
    if (!first) {
      w.classList.remove('go')
      void w.offsetWidth
      w.classList.add('go')
    }
    setRi(k)
    fpRefs.current.forEach((f) => { if (f) f.style.width = '0' })
    clearTimeout(st.to)
    st.to = setTimeout(() => {
      vid.poster = r.p
      vid.src = r.v
      vid.load()
      tryPlay()
    }, first ? 0 : 420)
  }, [st, tryPlay])

  useEffect(() => {
    const vid = vidRef.current
    vid.muted = true
    vid.defaultMuted = true
    vid.setAttribute('playsinline', '')
    vid.setAttribute('webkit-playsinline', '')

    const onPlay = () => setIcon('❚❚')
    const onCanPlay = () => { if (vid.paused) tryPlay() }
    const onClick = () => {
      if (vid.paused) { st.play = true; vid.play().catch(() => {}) }
      else { st.play = false; vid.pause(); setIcon('▶') }
    }
    const onPointer = () => { if (st.play && st.vis && vid.paused) tryPlay() }
    const onEnded = () => show(st.ri + 1)
    const onError = () => { if (st.play) st.rt = setTimeout(() => show(st.ri + 1), 4000) }
    const onTime = () => {
      if (!vid.duration) return
      const p = (vid.currentTime / vid.duration) * 100 + '%'
      pgRef.current.style.width = p
      const f = fpRefs.current[st.ri]
      if (f) f.style.width = p
    }

    vid.addEventListener('play', onPlay)
    vid.addEventListener('canplay', onCanPlay)
    vid.addEventListener('click', onClick)
    vid.addEventListener('ended', onEnded)
    vid.addEventListener('error', onError)
    vid.addEventListener('timeupdate', onTime)
    window.addEventListener('pointerdown', onPointer, { passive: true })

    const io = new IntersectionObserver(
      (es) => {
        st.vis = es[0].isIntersecting
        if (st.vis && st.play) tryPlay()
        else vid.pause()
      },
      { threshold: 0.35 }
    )
    io.observe(rsRef.current)

    show(0, true)

    return () => {
      vid.removeEventListener('play', onPlay)
      vid.removeEventListener('canplay', onCanPlay)
      vid.removeEventListener('click', onClick)
      vid.removeEventListener('ended', onEnded)
      vid.removeEventListener('error', onError)
      vid.removeEventListener('timeupdate', onTime)
      window.removeEventListener('pointerdown', onPointer)
      io.disconnect()
      clearTimeout(st.rt)
      clearTimeout(st.to)
    }
  }, [show, tryPlay, st])

  const r = REEL[ri]

  const toggle = () => {
    const vid = vidRef.current
    st.play = vid.paused
    setIcon(st.play ? '❚❚' : '▶')
    if (st.play) vid.play().catch(() => {})
    else vid.pause()
  }
  const fullscreen = () => {
    const el = rsRef.current
    try { (el.requestFullscreen || el.webkitRequestFullscreen).call(el) } catch (x) { /* ignore */ }
  }
  const pick = (k) => {
    st.play = true
    setIcon('❚❚')
    show(k)
  }

  return (
    <section className="sec" id="work" style={{ paddingTop: 20 }}>
      <div className="w">
        <div className="sh rv">
          <div><small>02 — Best work</small><h2>Interior <em>design</em></h2></div>
          <p>3D walkthroughs of spaces designed from concept to detail — restaurants, a café, an office and a retail store.</p>
        </div>
        <div className="reel rv">
          <div className="rs" id="rs" ref={rsRef}>
            <video id="vid" ref={vidRef} muted playsInline preload="auto" aria-label="Interior walkthrough video"></video>
            <div className="wipe" id="wipe" ref={wipeRef}></div>
            <i className="cm k1"></i><i className="cm k2"></i><i className="cm k3"></i><i className="cm k4"></i>
            <div className="rtop">
              <span className="rec"><i></i>3D Walkthrough</span>
              <span id="rsh">Sheet {pad(ri + 1)} / {pad(REEL.length)}</span>
            </div>
            <div className="ctl">
              <button id="rpp" onClick={toggle} aria-label="Pause video">{icon}</button>
              <button id="rfs" onClick={fullscreen} aria-label="Fullscreen">⛶</button>
            </div>
            <div className="tb">
              <div><small>Project</small><b id="rpn">{r.n}</b></div>
              <div><small>Type</small><b id="rpt">{r.t}</b></div>
              <div><small>Scope</small><b>Concept · 3D · Walkthrough</b></div>
              <div><small>Sheet</small><b id="rsn">{pad(ri + 1)}</b></div>
            </div>
            <div className="pg"><i id="rpg" ref={pgRef}></i></div>
          </div>
          <div className="dim"><span id="rdim">Drawing sheet · 3D render · 16:9</span></div>
          <div className="film" id="film">
            {REEL.map((x, i) => (
              <button
                key={x.n}
                className={'fm' + (i === ri ? ' on' : '')}
                data-cur="Play"
                onClick={() => pick(i)}
              >
                <img src={x.p} alt={x.n} />
                <span className="fp" ref={(el) => (fpRefs.current[i] = el)}></span>
                <div className="ft"><b>{pad(i + 1)}</b><span>{x.n}</span></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
