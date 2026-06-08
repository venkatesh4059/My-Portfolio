'use client';

import { useEffect, useRef } from 'react';
import styles from './NextSection.module.css';

const PROJECTS = [
  {
    num: '01',
    title: 'ELK Threat Detection System',
    tags: ['Elasticsearch', 'Logstash', 'Kibana', 'Docker', 'Kali Linux', 'KQL'],
    desc: 'Centralized log monitoring lab ingesting Windows & Linux endpoint activity. Configured Filebeat/Winlogbeat, KQL dashboards, and alert rules for failed-login and suspicious-activity detection.',
    link: 'https://github.com/venkatesh4059/Centralized-Log-Monitoring-and-Threat-Detection-System-using-ELK-Stack',
  },
  {
    num: '02',
    title: 'E-Commerce Alert Platform',
    tags: ['Java', 'HTML', 'CSS', 'MySQL'],
    desc: 'Web-based notification platform to improve user engagement via timed app alerts. Built personalised delivery logic, UI mapping, and safe database interaction patterns.',
    link: 'https://github.com/venkatesh4059/OPTIMIZING-APP-ALERTS-FOR-A-SUPERIOR-E-COMMERCE-EXPERIENCE',
  },
];

const SKILLS = [
  { label: 'Python',              level: 'Intermediate', pct: 72 },
  { label: 'C',                   level: 'Intermediate', pct: 60 },
  { label: 'HTML & CSS',          level: 'Intermediate', pct: 68 },
  { label: 'MySQL',               level: 'Intermediate', pct: 58 },
  { label: 'ELK Stack',           level: 'Intermediate', pct: 62 },
  { label: 'Docker',              level: 'Intermediate', pct: 52 },
  { label: 'Java',                level: 'Beginner',     pct: 28 },
  { label: 'UI/UX Design',        level: 'Beginner',     pct: 25 },
  { label: 'Systems Engineering', level: 'Beginner',     pct: 22 },
];

// Only Unlox cert — TCS removed
const CERTS = [
  {
    id: 'cert-01',
    title: 'Unlox Edge Certification — First Contact in Cyber Security',
    issuer: 'UNLOX · Job Bridge Initiative',
    date: '01 June 2026',
    certId: 'UNXCS-INT-6880',
    desc: 'Completed Internship & Project-based Learning Program in Cyber Security. Issued in collaboration with DPIIT, Skill India, and NSDC.',
    link: 'https://drive.google.com/file/d/157x5oE-do-Wxpr_fRpO42FhCZKgh0iZO/view?usp=sharing',
  },
];

export default function NextSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const st = (trigger) => ({ scrollTrigger: { trigger, start: 'top 85%' } });

      gsap.fromTo('[data-hdr]',  { opacity:0, y:28 }, { opacity:1, y:0, duration:1,   ease:'power3.out', stagger:0.12, ...st('[data-hdr]') });
      gsap.fromTo('[data-card]', { opacity:0, y:50 }, { opacity:1, y:0, duration:0.9, ease:'power3.out', stagger:0.13, ...st('[data-card]') });
      gsap.fromTo('[data-skill]',{ opacity:0, x:-18 },{ opacity:1, x:0, duration:0.7, ease:'power3.out', stagger:0.07, ...st('[data-skill]') });
      gsap.fromTo('[data-bar]',  { scaleX:0 },        { scaleX:1, duration:1.1, ease:'power3.out', stagger:0.07, transformOrigin:'left center', ...st('[data-bar]') });
      gsap.fromTo('[data-cert]', { opacity:0, y:32 }, { opacity:1, y:0, duration:0.8, ease:'power3.out', stagger:0.12, ...st('[data-cert]') });
    };
    init();
  }, []);

  return (
    <section id="next-section" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>

        {/* ── Projects ── */}
        <div>
          <div data-hdr className={styles.header}>
            <span className={styles.label}>Selected Work</span>
            <h2 className={styles.heading}>Projects</h2>
            <p className={styles.sub}>
              Academic projects spanning cybersecurity, full-stack development, and systems design.
            </p>
          </div>

          <div className={styles.grid}>
            {PROJECTS.map(p => (
              <article key={p.num} data-card className={styles.card}
                onClick={() => window.open(p.link, '_blank', 'noopener')}>
                <span className={styles.cardNum}>{p.num}</span>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.cardDesc}>{p.desc}</p>
                  <div className={styles.tags}>
                    {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  </div>
                </div>
                <a href={p.link} target="_blank" rel="noopener noreferrer"
                  className={styles.cardArrow}
                  aria-label={`Open ${p.title} on GitHub`}
                  onClick={e => e.stopPropagation()}>↗</a>
              </article>
            ))}
          </div>
        </div>

        {/* ── Skills ── */}
        <div>
          <div data-hdr className={styles.header}>
            <span className={styles.label}>Capabilities</span>
            <h2 className={styles.heading}>Skills</h2>
          </div>
          <div className={styles.skillsList}>
            {SKILLS.map(s => (
              <div key={s.label} data-skill className={styles.skillRow}>
                <div className={styles.skillMeta}>
                  <span className={styles.skillName}>{s.label}</span>
                  <span className={`${styles.skillLevel} ${styles['level' + s.level.replace(' ', '')]}`}>
                    {s.level}
                  </span>
                </div>
                <div className={styles.skillTrack}>
                  <div data-bar className={styles.skillBar}
                    style={{
                      '--pct': `${s.pct}%`,
                      '--col': s.level === 'Beginner'
                        ? 'rgba(255,148,66,0.30)'
                        : 'rgba(255,148,66,0.72)',
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Certifications ── */}
        <div>
          <div data-hdr className={styles.header}>
            <span className={styles.label}>Credentials</span>
            <h2 className={styles.heading}>Certifications</h2>
          </div>
          <div className={styles.certGrid}>
            {CERTS.map(c => (
              <div key={c.id} data-cert className={styles.certCard}>
                <div className={styles.certTop}>
                  <span className={styles.certIssuer}>{c.issuer}</span>
                  <span className={styles.certDate}>{c.date}</span>
                </div>
                <h3 className={styles.certTitle}>{c.title}</h3>
                <p className={styles.certDesc}>{c.desc}</p>
                {c.certId && <span className={styles.certId}>ID: {c.certId}</span>}
                {c.link && (
                  <a href={c.link} target="_blank" rel="noopener noreferrer"
                    className={styles.certLink}>
                    View Certificate ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── About — voice script summary ── */}
        <div className={styles.about}>
          <span className={styles.label}>About Me</span>
          <p className={styles.aboutText}>
            Hi, I'm <strong>D. Venkatesh</strong> — an MCA first-year student at Anurag University
            with a BCA background. I'm interested in Python development, cybersecurity foundations,
            and building software that is usable, reliable, and secure. I have hands-on experience
            building a centralized ELK Stack threat detection lab and an e-commerce alert platform.
            I'm a quick learner with strong problem-solving habits, and I work well independently
            and in collaborative, fast-paced teams. Certified in Cyber Security (Unlox Edge —
            UNXCS-INT-6880). Fluent in English, Hindi, and Telugu.
          </p>
          <div className={styles.contacts}>
            <a href="mailto:venkateshmudhiraj16@gmail.com" className={styles.contactLink}>
              venkateshmudhiraj16@gmail.com
            </a>
            <a href="https://github.com/venkatesh4059" target="_blank" rel="noopener" className={styles.contactLink}>
              github.com/venkatesh4059
            </a>
            <a href="https://linkedin.com/in/dasari-venkatesh235" target="_blank" rel="noopener" className={styles.contactLink}>
              LinkedIn
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
