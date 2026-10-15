const PAGES = [
  { name: 'Study in Bengaluru', handle: '@studyinbengaluru.com_', tag: 'Main page', label: 'Study in Bengaluru on Instagram', href: 'https://www.instagram.com/studyinbengaluru.com_?dlrf=MXV2c3IxYmF1czU4Yw==' },
  { name: 'Incubenation', handle: '@incubenation', tag: 'Main page', label: 'Incubenation on Instagram', href: 'https://www.instagram.com/incubenation?dlrf=MXV2c3IxYmF1czU4Yw==' },
{ name: 'Startup Park', handle: '@startuppark', tag: 'Main page', label: 'Startup Park on Instagram', href: 'https://www.instagram.com/thestartuppark/' },
] 

function InstaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
    </svg>
  )
}

export default function Marketing() {
  return (
    <section className="sec" id="marketing">
      <div className="w">
        <div className="sh rv">
          <div><small>03 — Marketing</small><h2>Social media <em>pages</em></h2></div>
          <p>The Instagram network behind Study in Bengaluru  content, creatives and growth across states.</p>
        </div>
        <div className="mkg rv">
          {PAGES.map((p, i) => (
            <a className="mc" key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" aria-label={p.label}>
              <div className="mt">
                <span className="ic"><InstaIcon /></span>
                <em>{String(i + 1).padStart(2, '0')}</em>
              </div>
              <b>{p.name}</b>
              <span className="h">{p.handle}</span>
              <div className="mb"><span className="tg">{p.tag}</span><span className="ar">Follow ↗</span></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
