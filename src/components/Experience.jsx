import { EXP } from '../data/content.js'
import { LOGOS } from '../data/logos.js'

// Pick the right company logo for each role
function Logo({ org }) {
  const n = org.toLowerCase()
  let k = null
  if (n.startsWith('ique')) k = ['ique', 'dk', 'iQue Ventures']
  else if (n.startsWith('vra')) k = ['vra', '', 'VRA Solutions']
  else if (n.startsWith('tikanga')) k = ['tik', '', 'Tikanga Academy']
  else if (n.startsWith('ienergizer')) k = ['ien', 'dk', 'iEnergizer']
  else if (n.startsWith('my beautiful')) k = ['mbh', '', 'My Beautiful Home']

  if (k) {
    return (
      <div className={`lg ${k[1]}`}>
        <img src={LOGOS[k[0]]} alt={`${k[2]} logo`} loading="lazy" />
      </div>
    )
  }
  return (
    <div className="lg dk sib">
      <img src={LOGOS.sib} alt="Study in Bengaluru logo" loading="lazy" />
    </div>
  )
}

export default function Experience() {
  return (
    <section className="sec" id="experience">
      <div className="w">
        <div className="sh rv">
          <div><small>05 — Career</small><h2>Work <em>experience</em></h2></div>
          <p>3+ years across digital marketing, brand strategy, content creation and art direction.</p>
        </div>
        <div id="xp">
          {EXP.map((x) => (
            <div className="xr rv" key={x.d}>
              <div><div className="xd">{x.d}</div><Logo org={x.o} /></div>
              <div>
                <h3>{x.t}</h3>
                <div className="xo">{x.o}</div>
                <ul>{x.b.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
