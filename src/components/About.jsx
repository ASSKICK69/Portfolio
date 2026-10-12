import { EDU, LANG, SKILLS, PROC } from '../data/content.js'

export default function About() {
  return (
    <section id="about" className="ab">
      <div>
        <h2>Education &amp; Skills</h2>
        <p className="lb2">Education</p>
        <div id="edu">
          {EDU.map((e) => (
            <div className="ed" key={e[0]}>
              <div><b>{e[0]}</b><small>{e[1]}</small></div>
              <span>{e[2]}</span>
            </div>
          ))}
        </div>
        <p className="lb2" style={{ marginTop: 12 }}>Languages</p>
        <div className="chips" id="lang">
          {LANG.map((l) => <span key={l}>{l} — Fluent</span>)}
        </div>
        <p className="lb2" style={{ marginTop: 12 }}>Skills &amp; Tools</p>
        <div className="chips" id="chips">
          {SKILLS.map((s) => <span key={s}>{s}</span>)}
        </div>
      </div>

      <div>
        <h2>Work Process</h2>
        <div id="proc">
          {PROC.map((p, i) => (
            <div className="st" key={p[1]}>
              <b>0{i + 1}</b><i>{p[0]}</i>
              <div><h4>{p[1]}</h4><p>{p[2]}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="rc">
        <div className="qt">
          <div>
            <div className="q">“</div>
            <span className="kk">Design philosophy</span>
            <p>Good design is not just <em>how it looks</em>, but how it works.</p>
            <div className="ds">
              Whether I’m shaping a brand identity, a living space, a campaign, or a digital interface, I approach each project the same way: start with the people it’s for, and make every choice serve them. A logo has to communicate at a glance, a room has to feel right the moment you walk in, a campaign has to speak to the audience it’s trying to reach, and an interface has to guide someone without making them think. Working across graphic design, interior design, marketing, and UI/UX has taught me that these disciplines share the same foundations: clarity, rhythm, hierarchy, and intention. Moving between physical and digital, visual and strategic, helps me see problems from more angles and build experiences that feel cohesive wherever someone encounters them. My goal is always the same: design that looks considered, works effortlessly, and leaves a lasting impression.
            </div>
          </div>
          <div className="by">
            <div className="sg">Ashique</div>
            <small>Let's create something great together.</small>
          </div>
        </div>
      </div>
    </section>
  )
}
