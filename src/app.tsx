import {
  ArrowUpRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
  Monitor,
  Phone,
  Smartphone,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"

import { ContactForm } from "@/components/contact-form"
import { SectionReveal } from "@/components/section-reveal"
import { assets, experience, navItems, notes, services, testimonials, works } from "@/portfolio-data"

const iconMap = {
  monitor: Monitor,
  smartphone: Smartphone,
  badge: BadgeCheck,
} as const

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const activeTestimonial = testimonials[testimonialIndex] ?? testimonials[0]

  function showPreviousTestimonial() {
    setTestimonialIndex(index => (index === 0 ? testimonials.length - 1 : index - 1))
  }

  function showNextTestimonial() {
    setTestimonialIndex(index => (index === testimonials.length - 1 ? 0 : index + 1))
  }

  return (
    <div className="page-frame">
      <div className="site-shell">
        <header className="site-header">
          <a className="brand" href="#top" aria-label="Binjan home">Binjan</a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item, index) => (
              <a key={item.href} className={index === 0 ? "active" : undefined} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-contact">
            <a href="tel:+001313345678">+001 (313) 345 678</a>
            <a className="icon-link" href="tel:+001313345678" aria-label="Call Binjan">
              <Phone aria-hidden="true" />
            </a>
          </div>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label="Open navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(open => !open)}
          >
            <Menu aria-hidden="true" />
          </button>
        </header>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {navItems.map(item => (
                <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        <main id="top">
          <section className="hero" data-testid="hero">
            <motion.div
              className="hero-copy"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1>
                Hey There,
                <span>I&apos;m Binjan</span>
              </h1>
              <a className="email-link" href="mailto:banjan10@gmail.com">
                banjan10@gmail.com
              </a>
            </motion.div>

            <motion.p
              className="hero-note"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              I design beautifully simple things, And I love what i do.
            </motion.p>

            <motion.div
              className="portrait-wrap"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="paint-stroke paint-stroke-one" aria-hidden="true" />
              <div className="paint-stroke paint-stroke-two" aria-hidden="true" />
              <img src={assets.heroPortrait} alt="Binjan portrait" />
            </motion.div>

            <motion.div
              className="experience-badge"
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28, duration: 0.65 }}
            >
              <strong>10</strong>
              <span>
                Years
                <br />
                Experience
              </span>
            </motion.div>

            <motion.div
              className="certification"
              initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.34, duration: 0.65 }}
            >
              <img src={assets.certifiedStamp} alt="IDF certified professional UI/UX designer" />
            </motion.div>
          </section>

          <SectionReveal id="services" className="section services-section">
            <div className="service-list">
              {services.map((service) => {
                const Icon = iconMap[service.icon]

                return (
                  <motion.article
                    className="service-card"
                    data-tone={service.tone}
                    key={service.title}
                    whileHover={prefersReducedMotion ? undefined : { y: -5, scale: 1.01 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                  >
                    <span className="service-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{service.title}</strong>
                      <small>{service.count}</small>
                    </span>
                  </motion.article>
                )
              })}
            </div>

            <div className="section-copy">
              <p className="eyebrow">Services</p>
              <h2>What do I help?</h2>
              <p>
                I will help you with finginga solution and solve your problems, We use process design to create digital products.Besids that also help their business.
              </p>
              <p>
                We use process design to create digital products. Besides that also help their business.
              </p>
              <div className="stats-grid">
                <span>
                  <strong>285+</strong>
                  <small>Project Completed</small>
                </span>
                <span>
                  <strong>190+</strong>
                  <small>Happy Clients</small>
                </span>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal id="experience" className="section experience-section">
            <div className="section-heading">
              <p className="eyebrow">Experience</p>
              <h2>My Work Experience</h2>
            </div>
            <div className="timeline">
              {experience.map(item => (
                <article className="timeline-row" key={`${item.company}-${item.role}`}>
                  <div className="timeline-company">
                    <h3>{item.company}</h3>
                    <p>{item.date}</p>
                  </div>
                  <span className="timeline-pin" data-color={item.color} aria-hidden="true" />
                  <div className="timeline-role">
                    <h3>{item.role}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal id="works" className="section works-section">
            <div className="section-heading row-heading">
              <div>
                <p className="eyebrow">Works</p>
                <h2>My Latest Works</h2>
                <p>Perfect solution for digital experience</p>
              </div>
              <a className="text-action" href="#">
                Explore More Works
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>

            <div className="works-grid">
              {works.map(work => (
                <motion.a
                  key={work.title}
                  className="work-card"
                  data-tone={work.tone}
                  href={work.href}
                  aria-label={`Open ${work.title} project`}
                  whileHover={prefersReducedMotion ? undefined : { y: -8, rotate: -0.6 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                >
                  <span className="work-copy">
                    <strong>{work.title}</strong>
                    <small>{work.subtitle}</small>
                  </span>
                  <img src={work.image} alt="" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal className="section testimonials-section">
            <div className="section-heading centered">
              <p className="eyebrow">Reviews</p>
              <h2>People talk about us</h2>
              <p>I got a job that was in accordance with the salary and field of work. The process of submitting an application was quite cosy</p>
            </div>

            <div className="testimonial-stage">
              <AnimatePresence mode="wait">
                <motion.article
                  className="testimonial-card"
                  key={activeTestimonial.name}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="avatar" data-color={activeTestimonial.color}>{activeTestimonial.avatar}</span>
                  <p>
                    &quot;
                    {activeTestimonial.quote}
                    &quot;
                  </p>
                  <strong>{activeTestimonial.name}</strong>
                  <small>{activeTestimonial.role}</small>
                </motion.article>
              </AnimatePresence>

              <div className="testimonial-controls">
                <button type="button" aria-label="Previous testimonial" onClick={showPreviousTestimonial}>
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button type="button" aria-label="Next testimonial" onClick={showNextTestimonial}>
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal id="notes" className="section notes-section">
            <div className="section-heading row-heading">
              <div>
                <p className="eyebrow">Notes</p>
                <h2>Design Notes</h2>
              </div>
              <a className="text-action" href="#">
                View all notes
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
            <div className="notes-list">
              {notes.map(note => (
                <a href="#" className="note-row" key={note.title} aria-label={`Read ${note.title}`}>
                  <span>{note.category}</span>
                  <strong>{note.title}</strong>
                  <small>{note.date}</small>
                </a>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal className="section contact-section">
            <div className="contact-copy">
              <h2>Let&apos;s make something amazing toghteher.</h2>
              <p>
                Start by
                {" "}
                <a href="mailto:banjan10@gmail.com">saying hi</a>
              </p>
            </div>
            <div className="contact-panel">
              <ContactForm />
            </div>
            <aside className="footer-info">
              <strong>Information</strong>
              <p>145 New York, FL 5467, USA</p>
              <a href="#services">Services</a>
              <a href="#works">Works</a>
              <a href="#notes">Notes</a>
              <a href="#experience">Experience</a>
            </aside>
          </SectionReveal>
        </main>

        <footer className="site-footer">
          <a className="brand" href="#top">Binjan</a>
          <span>© 2020. All Rights Reserved</span>
          <span>Design By Orix Creative Agency</span>
        </footer>
      </div>
    </div>
  )
}

export default App
