import { useEffect } from 'react'

// Fade/slide-in on scroll for every .rv element
export default function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.rv').forEach((x) => io.observe(x))
    return () => io.disconnect()
  }, [])
}
