import { DISC } from '../data/content.js'

export default function Disciplines() {
  return (
    <section className="sec" id="disc">
      <div className="w">
        <div className="sh rv">
          <div><small>01 — What I do</small><h2>Four ways <em>to create</em></h2></div>
          <p>One designer, four disciplines — all driven by a problem-solving mindset.</p>
        </div>
        <div className="dw rv" id="dw">
          {DISC.map((d) => (
            <a className="dr" href={d[3]} key={d[0]}>
              <b>{d[0]}</b><h3>{d[1]}</h3><p>{d[2]}</p><i>↗</i>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
