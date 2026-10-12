import { useState } from 'react'

// Image with the same gradient-placeholder fallback as the original portfolio
export default function Pic({ src, alt, label = '', sub = '', ...rest }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    const h = [352, 14, 28, 340, 8, 0][label.length % 6]
    return (
      <div
        className="ph"
        style={{ background: `linear-gradient(135deg,hsl(${h} 70% 28%),hsl(${h} 60% 9%))` }}
      >
        <b>{label}</b>
        {sub}
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} {...rest} />
}
