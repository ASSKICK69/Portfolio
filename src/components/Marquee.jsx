export default function Marquee({ id, items, repeat }) {
  const spans = []
  for (let r = 0; r < repeat; r++) {
    items.forEach((t, i) => {
      spans.push(<span key={`${r}-${i}-t`}>{t}</span>)
      spans.push(<span key={`${r}-${i}-s`}>✦</span>)
    })
  }
  return (
    <div className="mq" aria-hidden="true"><div id={id}>{spans}</div></div>
  )
}
