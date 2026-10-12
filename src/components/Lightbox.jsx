import { useEffect, useRef } from 'react'
import Pic from './Pic.jsx'

export default function Lightbox({ item, onClose }) {
  const btn = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => { if (item) btn.current?.focus() }, [item])

  return (
    <div
      className={'lb' + (item ? ' on' : '')}
      id="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Project viewer"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <button ref={btn} onClick={onClose}>Close ✕</button>
      <figure>
        <div className="box">
          {item && <Pic key={item.img} src={item.img} alt={item.title} label={item.title.split(' — ')[0]} sub={item.cat} />}
        </div>
        <small>{item?.cat}</small>
        <h3>{item?.title}</h3>
        <p>{item?.desc}</p>
      </figure>
    </div>
  )
}
