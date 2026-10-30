import { copy } from "./data";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/anton/400.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource-variable/inter";
import "./style.css";
import "./lib/qa";
import { profile, ui } from "./data";
import { BG } from "./lib/frames";
import { loadFrames } from "./lib/images";
import { gsap, ScrollTrigger, lenis, reduced, go } from "./lib/animation";
import Character from "./Character";
import ContactForm from "./ContactForm";
import {
  About,
  Numbers,
  Marquee,
  Work,
  Skills,
  Journey,
  Certifications,
} from "./Sections";
document.documentElement.style.setProperty("--bg", BG);
// PRELOADER: loading screen ka layout, counter, progress bar aur exit timing yahan hai.
// Greetings/name ka text data.js mein; colours aur sizes style.css ke Loading section mein badlo.
function Preloader({ onReady }) {
  const root = useRef(),
    counter = useRef(),
    bar = useRef(),
    [greeting, setGreeting] = useState(0),
    [error, setError] = useState("");
  useEffect(() => {
    let live = true,
      finished = false;
    const display = { v: 0 };
    let start = performance.now();
    const timer = setInterval(
      () => setGreeting((v) => (v + 1) % ui.greetings.length),
      260,
    );
    function progress(p) {
      gsap.to(display, {
        v: p * 100,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => {
          if (counter.current)
            counter.current.textContent = String(
              Math.floor(display.v),
            ).padStart(3, "0");
          if (bar.current)
            bar.current.style.transform = `scaleX(${display.v / 100})`;
        },
      });
    }
    loadFrames(progress)
      .then(async () => {
        await document.fonts.ready;
        if (!live) return;
        const delay = Math.max(400, 1600 - (performance.now() - start));
        setTimeout(() => {
          if (!live) return;
          clearInterval(timer);
          counter.current.textContent = "100";
          bar.current.style.transform = "scaleX(1)";
          gsap
            .timeline({
              onComplete: () => {
                root.current.style.display = "none";
                lenis.start();
                onReady();
                ScrollTrigger.refresh();
              },
            })
            .to(".preload-item", {
              y: -24,
              opacity: 0,
              duration: 0.45,
              stagger: 0.06,
            })
            .to(
              root.current,
              {
                clipPath: "inset(0 0 100% 0)",
                duration: reduced ? 0.01 : 1.1,
                ease: "expo.inOut",
              },
              "-=.1",
            );
        }, delay);
      })
      .catch((e) => {
        setError(e.message);
        clearInterval(timer);
      });
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, []);
  return (
    <div className="preloader" ref={root} role="status" aria-label={copy.t018}>
      <div className="preload-top preload-item mono">
        <span>{profile.fullName}</span>
        <span>Portfolio {ui.year}</span>
      </div>
      <div className="preload-center">
        <span className="greeting preload-item">{ui.greetings[greeting]}</span>
        <div ref={counter} className="load-counter preload-item">
          {copy.t000}
        </div>
        {error && (
          <p className="load-error">
            {error}{" "}
            <button onClick={() => location.reload()}>{copy.t001}</button>
          </p>
        )}
      </div>
      <div className="preload-bottom preload-item">
        <span className="mono">{copy.t002}</span>
        <span className="mono">{copy.t003}</span>
        <div className="load-track">
          <i ref={bar} />
        </div>
      </div>
    </div>
  );
}
// CUSTOM CURSOR: mouse dot/ring ka follow speed aur OPEN/DRAG behavior yahan badlo.
// Dot/ring size, colour aur touch visibility style.css mein hain.
function Cursor() {
  const dot = useRef(),
    ring = useRef();
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches || reduced) return;
    const xd = gsap.quickTo(dot.current, "x", { duration: 0.03 }),
      yd = gsap.quickTo(dot.current, "y", { duration: 0.03 }),
      xr = gsap.quickTo(ring.current, "x", {
        duration: 0.45,
        ease: "power3.out",
      }),
      yr = gsap.quickTo(ring.current, "y", {
        duration: 0.45,
        ease: "power3.out",
      });
    const move = (e) => {
      xd(e.clientX);
      yd(e.clientY);
      xr(e.clientX);
      yr(e.clientY);
      dot.current.style.opacity = 1;
      ring.current.style.opacity = 1;
    };
    const over = (e) => {
      const data = e.target.closest("[data-cursor]"),
        link = e.target.closest("a,button");
      ring.current.classList.toggle("cursor-disc", !!data);
      ring.current.classList.toggle("cursor-link", !!link && !data);
      ring.current.textContent = data?.dataset.cursor || "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}
// NAVIGATION: logo, links, Open to work pill aur mobile burger menu ka layout yahan badlo.
// Link names data.js > ui.nav aur email data.js > profile.email se aate hain.
function Nav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) lenis.stop();
    else if (document.body.classList.contains("loaded")) lenis.start();
    const esc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  function click(e, id) {
    e.preventDefault();
    setOpen(false);
    lenis.start();
    go("#" + id.toLowerCase());
  }
  return (
    <>
      <nav className="nav">
        <a
          className="logo"
          href="#home"
          onClick={(e) => click(e, "home")}
          aria-label={copy.t019}
        >
          {profile.initials}
          <sup>{copy.t004}</sup>
        </a>
        <div className="nav-links">
          {ui.nav.map((n) => (
            <a
              key={n}
              href={"#" + n.toLowerCase()}
              onClick={(e) => click(e, n)}
            >
              <span>{n}</span>
              <span aria-hidden="true">{n}</span>
            </a>
          ))}
        </div>
        <a className="availability" href={"mailto:" + profile.email}>
          <i />
          {copy.t005}
          <span>↗</span>
        </a>
        <button
          className={"burger " + (open ? "is-open" : "")}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </nav>
      <div
        className={"mobile-menu " + (open ? "is-open" : "")}
        inert={open ? undefined : ""}
        aria-hidden={!open}
      >
        <span className="mono">{copy.t006}</span>
        {ui.nav.map((n, i) => (
          <a key={n} href={"#" + n.toLowerCase()} onClick={(e) => click(e, n)}>
            <small>{String(i + 1).padStart(2, "0")}</small>
            {n}
            <span>↗</span>
          </a>
        ))}
        <a className="mobile-mail mono" href={"mailto:" + profile.email}>
          {profile.email}
        </a>
      </div>
    </>
  );
}
// HERO / FIRST SCREEN: background name, side notes, character position, intro aur CTA layout yahan badlo.
// Naam, role, summary data.js mein; spacing, floor line aur font sizes style.css > Hero mein hain.
function Hero({ ready }) {
  const root = useRef();
  useEffect(() => {
    if (!ready) return;
    document.body.classList.add("loaded");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-name span",
        { y: 150, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 1.5,
          stagger: 0.07,
          ease: "expo.out",
        },
      );
      gsap.fromTo(
        ".hero .character",
        { opacity: 0, filter: "blur(20px)", y: 30 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: reduced ? 0 : 1.4,
          ease: "expo.out",
        },
      );
      gsap.from(".floor-line", { scaleX: 0, duration: 1.4, ease: "expo.out" });
      gsap.from(".hero-bottom > *, .side-note", {
        y: 16,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        delay: 0.3,
      });
    }, root);
    return () => ctx.revert();
  }, [ready]);
  return (
    <section id="home" className="hero light" ref={root}>
      <Nav />
      <div className="blob blob-one" />
      <div className="blob blob-two" />
      <div className="hero-name" aria-hidden="true">
        {profile.firstName.split("").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <div className="side-note left-note">
        <span className="mono">PORTFOLIO — {ui.year}</span>
        <span>{profile.shortRole}</span>
        <em>{ui.heroAccent}</em>
      </div>
      <div className="side-note right-note">
        <span className="mono">{copy.t007}</span>
        <span>{profile.degree}</span>
        <em>{profile.college}</em>
      </div>
      <Character ready={ready} />
      <div className="floor-line" />
      <div className="hero-bottom">
        <h1>
          {profile.firstName} <em>{profile.lastName}</em>
        </h1>
        <p>{profile.oneSentence}</p>
        <div className="hero-actions">
          <a
            className="button dark-button"
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              go("#work");
            }}
          >
            {copy.t008}
            <span>↗</span>
          </a>
          <a className="button outline-button" href={"mailto:" + profile.email}>
            {copy.t009}
            <span>↗</span>
          </a>
        </div>
      </div>
      <div className="scroll-hint mono">
        <i />
        {copy.t010}
      </div>
    </section>
  );
}
// SOCIAL ICONS: GitHub, LinkedIn aur email ke SVG shapes yahan hain.
// Actual profile links badalne ke liye data.js kholo; SVG path edit karna zaroori nahi hai.
function SocialIcon({ type }) {
  if (type === "linkedin")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.5 9h3V21h-3ZM9 9h3v1.6c.8-1.2 1.9-1.9 3.5-1.9 3 0 4.5 1.8 4.5 5.2V21h-3v-6.6c0-1.9-.7-2.8-2.1-2.8-1.7 0-2.9 1.2-2.9 3.3V21H9Z" />
      </svg>
    );
  if (type === "github")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .2-1.5-.5-2 4-.5 6.5-2 6.5-6 0-1.6-.5-3-1.5-4 .2-1 .2-2-.2-3-1.4-.1-3 .7-4 1-2-.5-4-.5-6 0-1-.5-2.7-1.3-4-1-.5 1-.5 2-.2 3C4.5 7 4 8.5 4 10c0 4 2.5 5.5 6.5 6-.7.5-.5 1.5-.5 2v4" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
// CONTACT + FOOTER: 3-line heading, waving character, social buttons aur Back to top layout yahan hai.
// Social URLs data.js > profile mein; heading/button text data.js > copy mein badlo.
// profile.github mein valid URL aane par GitHub button automatically clickable ho jayega.
function Contact({ ready }) {
  const root = useRef(),
    text = useRef();
  useEffect(() => {
    function size() {
      if (!text.current) return;
      text.current.style.fontSize = "100px";
      const w = text.current.getBoundingClientRect().width;
      text.current.style.fontSize = `${((root.current.clientWidth * 0.96) / w) * 100}px`;
    }
    size();
    document.fonts.ready.then(size);
    window.addEventListener("resize", size);
    const ctx = gsap.context(() => {
      gsap.from(".contact-heading span", {
        y: 80,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    }, root);
    return () => {
      ctx.revert();
      window.removeEventListener("resize", size);
    };
  }, []);
  return (
    <section id="contact" ref={root} className="contact dark">
      <div className="talk-bg" ref={text}>
        {copy.t011}
      </div>
      {/* CONTACT LAYOUT: left = heading + social links, middle = form, right = waving character. */}
      <div className="contact-grid">
        <div className="contact-intro">
          <h2 className="contact-heading">
            <span>{copy.t012}</span>
            <span>{copy.t013}</span>
            <span>
              <em>{copy.t014}</em>
            </span>
          </h2>
          <div className="socials">
            <a
              aria-label={copy.t020}
              href={profile.github || "https://github.com/search?q=Raviju+Jangra&type=users"}
              target="_blank"
              rel="noreferrer"
              title={profile.github ? "GitHub" : "Search GitHub for Raviju Jangra"}
            >
              <SocialIcon type="github" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={copy.t023}
            >
              <SocialIcon type="linkedin" />
            </a>
            <a href={"mailto:" + profile.email} aria-label={copy.t024}>
              <SocialIcon type="mail" />
            </a>
          </div>
        </div>
        <ContactForm />
        <div className="contact-avatar">
          <Character ready={ready} contact />
        </div>
      </div>
      <footer className="mono">
        <span>
          © {ui.year} {profile.fullName}
        </span>
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            go("#home");
          }}
        >
          {copy.t016}
        </a>
      </footer>
    </section>
  );
}
// PAGE SECTION ORDER: neeche main ke andar components ka order poori website ka order decide karta hai.
// Har section ka detailed content data.js aur uska layout Sections.jsx/main.jsx mein hai.
function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) =>
      entries.forEach((e) =>
        e.target.classList.toggle("is-offscreen", !e.isIntersecting),
      ),
    );
    document
      .querySelectorAll("main > section")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return (
    <>
      <a className="skip-link" href="#work">
        {copy.t017}
      </a>
      <Preloader onReady={() => setReady(true)} />
      <Cursor />
      <div className="grain" />
      <main>
        <Hero ready={ready} />
        <About ready={ready} />
        <Numbers />
        <Marquee />
        <Work />
        <Skills />
        <Journey />
        <Certifications />
        <Contact ready={ready} />
      </main>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
