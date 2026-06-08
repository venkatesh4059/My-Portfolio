'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './VideoIntro.module.css';

const CinematicLayer = dynamic(() => import('./CinematicLayer'), { ssr: false });
const VIDEO_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/video/hero.mp4`;

export default function VideoIntro() {
  const heroRef    = useRef(null);
  const mainVidRef = useRef(null);
  const bgVidRef   = useRef(null);

  const [muted,   setMuted]   = useState(true);
  const [playing, setPlaying] = useState(true);
  const [hint,    setHint]    = useState(true);

  useEffect(() => {
    if (bgVidRef.current) {
      bgVidRef.current.muted = true;
      bgVidRef.current.play().catch(() => {});
    }
    if (mainVidRef.current) {
      mainVidRef.current.muted  = true;
      mainVidRef.current.volume = 1;
      mainVidRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    let ctx;
    import('gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        const hero = heroRef.current;
        if (!hero) return;
        gsap.set(hero,            { opacity: 0 });
        gsap.set('[data-tag]',    { opacity: 0, y: 14 });
        gsap.set('[data-name]',   { opacity: 0, y: 60, skewY: 1.5 });
        gsap.set('[data-mca]',    { opacity: 0, y: 18 });
        gsap.set('[data-role]',   { opacity: 0, y: 22 });
        gsap.set('[data-scroll]', { opacity: 0 });
        gsap.set('[data-ctrls]',  { opacity: 0 });

        gsap.timeline({ delay: 0.3 })
          .to(hero,           { opacity:1, duration:2,   ease:'power2.inOut' })
          .to('[data-tag]',   { opacity:1, y:0, duration:0.9, ease:'power3.out' }, '-=1.4')
          .to('[data-name]',  { opacity:1, y:0, skewY:0, duration:1.2, ease:'expo.out' }, '-=0.7')
          .to('[data-mca]',   { opacity:1, y:0, duration:0.8, ease:'power3.out' }, '-=0.8')
          .to('[data-role]',  { opacity:1, y:0, duration:0.9, ease:'power3.out' }, '-=0.6')
          .to('[data-scroll]',{ opacity:1, duration:0.7 }, '-=0.3')
          .to('[data-ctrls]', { opacity:1, duration:0.7 }, '<');
      }, heroRef);
    });
    return () => ctx?.revert?.();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 5500);
    return () => clearTimeout(t);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    setHint(false);
    if (mainVidRef.current) { mainVidRef.current.muted = next; mainVidRef.current.volume = 1; }
    if (bgVidRef.current)   bgVidRef.current.muted = true;
  }, [muted]);

  const togglePlay = useCallback(() => {
    const next = !playing;
    setPlaying(next);
    [mainVidRef, bgVidRef].forEach(r => { if (r.current) next ? r.current.play() : r.current.pause(); });
  }, [playing]);

  const scrollDown = () =>
    document.getElementById('next-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section ref={heroRef} className={styles.hero}>

      <div className={styles.bgLayer}>
        <video ref={bgVidRef} src={VIDEO_SRC} autoPlay loop muted playsInline className={styles.bgVideo} />
      </div>

      <CinematicLayer />

      <div className={styles.gradLeft}   aria-hidden="true" />
      <div className={styles.gradTop}    aria-hidden="true" />
      <div className={styles.gradBottom} aria-hidden="true" />

      <div className={styles.videoWrap}>
        <video ref={mainVidRef} src={VIDEO_SRC} autoPlay loop muted={muted} playsInline className={styles.mainVideo} />
        <div className={styles.videoBlend} />
      </div>

      {/* ── VOICE SCRIPT / Hero content ── */}
      <div className={styles.content}>

        <div data-tag className={styles.tag}>
          <span className={styles.dot} />
          MCA Student&nbsp;&nbsp;·&nbsp;&nbsp;Anurag University&nbsp;&nbsp;·&nbsp;&nbsp;2026
        </div>

        <h1 data-name className={styles.name}>VENKATESH</h1>

        <p data-mca className={styles.mcaBadge}>
          <span className={styles.mcaLine} />
          D. Venkatesh&nbsp;&nbsp;—&nbsp;&nbsp;Dasari
          <span className={styles.mcaLine} />
        </p>

        <div data-role className={styles.roles}>
          {/* Line 1: core identity from resume objective */}
          <p className={styles.roleMain}>
            Python Developer&nbsp;&nbsp;·&nbsp;&nbsp;Cybersecurity Enthusiast
          </p>
          {/* Line 2: resume skills summary — what he actually does */}
          <p className={styles.roleSub}>
            ELK Stack&nbsp;&nbsp;·&nbsp;&nbsp;Docker&nbsp;&nbsp;·&nbsp;&nbsp;Kali Linux&nbsp;&nbsp;·&nbsp;&nbsp;Quick Learner&nbsp;&nbsp;·&nbsp;&nbsp;Problem Solver
          </p>
        </div>

      </div>

      <div data-ctrls className={styles.controls}>
        {hint && (
          <button className={styles.hint} onClick={toggleMute} aria-label="Unmute">
            <span className={styles.hintDot} />
            Tap for sound
          </button>
        )}
        <button className={styles.btn} onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className={styles.btn} onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? <MuteIcon /> : <SoundIcon />}
        </button>
      </div>

      <button data-scroll className={styles.scrollCue} onClick={scrollDown} aria-label="Scroll down">
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </button>

    </section>
  );
}

function PauseIcon() {
  return <svg width="13" height="14" viewBox="0 0 13 14" fill="currentColor"><rect x="0" y="0" width="4.5" height="14" rx="1.5"/><rect x="8.5" y="0" width="4.5" height="14" rx="1.5"/></svg>;
}
function PlayIcon() {
  return <svg width="13" height="14" viewBox="0 0 13 14" fill="currentColor"><polygon points="1,0 13,7 1,14"/></svg>;
}
function MuteIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>;
}
function SoundIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
}
