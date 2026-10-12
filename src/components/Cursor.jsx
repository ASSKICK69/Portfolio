import { useEffect, useRef } from 'react'

// Scroll progress bar + custom cursor (glow, ring, dot, sparkles, ripples, 3D tilt)
export default function Cursor() {
  const prog = useRef(null)
  const glow = useRef(null)
  const cur = useRef(null)
  const dot = useRef(null)

  useEffect(() => {
    const cleanups = []
    const onScroll = () => {
      const h = document.documentElement
      prog.current.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    cleanups.push(() => window.removeEventListener('scroll', onScroll))

    if (matchMedia('(pointer:fine)').matches) {
      const calm = matchMedia('(prefers-reduced-motion:reduce)').matches
      const ring = cur.current, g = glow.current, d = dot.current
      let tx = innerWidth / 2, ty = innerHeight / 2, rx = tx, ry = ty, gx = tx, gy = ty, lt = 0
      let raf, alive = true

      const onMove = (e) => {
        tx = e.clientX; ty = e.clientY
        document.body.classList.add('m')
        d.style.transform = `translate(${tx}px,${ty}px)`
        if (!calm && e.timeStamp - lt > 45) {
          lt = e.timeStamp
          const p = document.createElement('i')
          p.className = 'sp'
          p.style.cssText = `left:${tx}px;top:${ty}px;--dx:${(Math.random() - 0.5) * 50}px;--dy:${Math.random() * 40 + 10}px`
          document.body.appendChild(p)
          setTimeout(() => p.remove(), 800)
        }
      }
      const onLeave = () => document.body.classList.remove('m')
      const onDown = (e) => {
        const r = document.createElement('i')
        r.className = 'rip'
        r.style.cssText = `left:${e.clientX}px;top:${e.clientY}px`
        document.body.appendChild(r)
        setTimeout(() => r.remove(), 600)
      }
      const onOver = (e) => {
        const t = e.target.closest('[data-cur]')
        const l = e.target.closest('a,button,.dr')
        ring.classList.toggle('big', !!t)
        ring.classList.toggle('link', !t && !!l)
        ring.textContent = t ? t.dataset.cur : ''
        d.style.opacity = t ? 0 : ''
        g.classList.toggle('hot', !!(t || l))
      }
      const onTilt = (e) => {
        const f = e.target.closest('.pj .fr')
        if (!f) return
        const r = f.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        f.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`
      }
      const onOut = (e) => {
        const f = e.target.closest && e.target.closest('.pj .fr')
        if (f) f.style.transform = ''
      }

      window.addEventListener('mousemove', onMove)
      document.documentElement.addEventListener('mouseleave', onLeave)
      document.addEventListener('mousedown', onDown)
      document.addEventListener('mouseover', onOver)
      document.addEventListener('mousemove', onTilt)
      document.addEventListener('mouseout', onOut)

      const loop = () => {
        if (!alive) return
        rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2
        gx += (tx - gx) * 0.07; gy += (ty - gy) * 0.07
        ring.style.transform = `translate(${rx}px,${ry}px)`
        g.style.transform = `translate(${gx}px,${gy}px)`
        raf = requestAnimationFrame(loop)
      }
      loop()

      cleanups.push(() => {
        alive = false
        cancelAnimationFrame(raf)
        window.removeEventListener('mousemove', onMove)
        document.documentElement.removeEventListener('mouseleave', onLeave)
        document.removeEventListener('mousedown', onDown)
        document.removeEventListener('mouseover', onOver)
        document.removeEventListener('mousemove', onTilt)
        document.removeEventListener('mouseout', onOut)
      })
    }
    return () => cleanups.forEach((f) => f())
  }, [])

  return (
    <>
      <div className="prog" ref={prog}></div>
      <div className="glow" ref={glow} aria-hidden="true"><i></i></div>
      <div className="ring" id="cur" ref={cur} aria-hidden="true"></div>
      <div className="dot" ref={dot} aria-hidden="true"></div>
    </>
  )
}
