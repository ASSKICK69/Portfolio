const MAIL = 'https://mail.google.com/mail/?view=cm&fs=1&to=mohammedashiq772@gmail.com&su=Hello%20Ashique'

export default function Contact() {
  return (
    <section id="contact">
      <div className="w">
        <a className="say" href={MAIL} target="_blank" rel="noopener noreferrer" aria-label="Email Ashique via Gmail">
          <small>Got a project in mind?</small>
          <h2>Say <span>hello</span> →</h2>
        </a>
        <div className="cl">
          <a href={MAIL} target="_blank" rel="noopener noreferrer">mohammedashiq772@gmail.com</a>
          <a href="tel:+918296437464">+91 8296437464</a>
          <span>Bangalore, India</span>
        </div>
        <p className="note">© <span id="yr">{new Date().getFullYear()}</span> Mohammed Ashique · Designed to keep growing</p>
      </div>
    </section>
  )
}
