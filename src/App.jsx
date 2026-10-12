import { useCallback, useState } from 'react'
import useReveal from './hooks/useReveal.js'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Marquee from './components/Marquee.jsx'
import Disciplines from './components/Disciplines.jsx'
import Interiors from './components/Interiors.jsx'
import Marketing from './components/Marketing.jsx'
import Graphics from './components/Graphics.jsx'
import Experience from './components/Experience.jsx'
import Contact from './components/Contact.jsx'
import Lightbox from './components/Lightbox.jsx'

export default function App() {
  const [lightbox, setLightbox] = useState(null)

  useReveal()

  const openLightbox = useCallback((item) => {
    setLightbox(item)
    const c = document.getElementById('cur')
    if (c) { c.classList.remove('big'); c.textContent = '' }
  }, [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <>
      <Cursor />
      <Nav />
      <Hero />
      <About />
      <Marquee id="mq1" items={['Digital Marketing', 'Interior Design', 'Graphic Design', 'UI / UX']} repeat={4} />
      <Disciplines />
      <Interiors />
      <Marquee id="mq2" items={['Spaces', 'Brands', 'Campaigns', 'Interfaces']} repeat={5} />
      <Marketing />
      <Graphics openLightbox={openLightbox} />
      <Experience />
      <Contact />
      <Lightbox item={lightbox} onClose={closeLightbox} />
    </>
  )
}
