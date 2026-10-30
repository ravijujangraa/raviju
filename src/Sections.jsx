import { copy } from "./data";
import React, { useRef, useState, useEffect } from "react";
import Matter from "matter-js";
import { gsap, ScrollTrigger, reduced, go } from "./lib/animation";
import { images, sizeCanvas, paint } from "./lib/images";
import { SEQ } from "./lib/frames";
import {
  profile,
  chapters,
  projects,
  skills,
  milestones,
  education,
  numbers,
  ui,
} from "./data";
// SHARED SECTION LABEL: heading ke upar chhota label aur uski line ka common layout.
// Har label ka text data.js > copy mein; font, line aur spacing style.css > .section-label mein badlo.
export function Label({ children, aside }) {
  return (
    <div className="section-label">
      <span>{children}</span>
      {aside && <small>{aside}</small>}
    </div>
  );
}
// SHARED BIG HEADING: normal Anton text aur italic accent ka common structure.
// Common font size, line-height aur accent colour style.css > .section-heading mein badlo.
export function Heading({ children, accent }) {
  return (
    <h2 className="section-heading">
      {children} <em>{accent}</em>
    </h2>
  );
}
// ABOUT SECTION: sticky 360 canvas, chapter switching aur text entrance animation yahan hain.
// 4 chapters ka text data.js > chapters; 520vh height aur columns style.css > About mein badlo.
export function About({ ready }) {
  const root = useRef(),
    canvas = useRef(),
    copyRef = useRef();
  const [chapter, setChapter] = useState(0);
  useEffect(() => {
    if (!ready) return;
    let p = 0,
      target = 0,
      active = false;
    let s = sizeCanvas(canvas.current),
      last = -1;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        target = reduced ? 0 : Math.min(1, self.progress / 0.9);
        setChapter(Math.min(3, Math.floor(self.progress * 4)));
      },
      onToggle: (self) => (active = self.isActive),
    });
    const draw = () => {
      if (!active && last >= 0) return;
      p += (target - p) * 0.16;
      const f = Math.round(p * (SEQ.rotc - 1));
      if (f === last) return;
      last = f;
      s.ctx.clearRect(0, 0, s.w, s.h);
      paint(s.ctx, images.rotc[f], s.w, s.h);
      if (p > 0.97) paint(s.ctx, images.rotc[0], s.w, s.h, (p - 0.97) / 0.03);
    };
    draw();
    gsap.ticker.add(draw);
    const resize = () => {
      s = sizeCanvas(canvas.current);
      last = -1;
    };
    window.addEventListener("resize", resize);
    return () => {
      st.kill();
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", resize);
    };
  }, [ready]);
  useEffect(() => {
    function fitChapter() {
      if (!copyRef.current) return;
      const heading = copyRef.current.querySelector("h2");
      const accent = heading.querySelector("em");
      heading.style.fontSize = "";
      const available = heading.clientWidth - 6;
      if (accent.scrollWidth > available) {
        heading.style.fontSize =
          (parseFloat(getComputedStyle(heading).fontSize) * available) /
            accent.scrollWidth +
          "px";
      }
    }
    fitChapter();
    document.fonts.ready.then(fitChapter);
    window.addEventListener("resize", fitChapter);
    return () => window.removeEventListener("resize", fitChapter);
  }, [chapter]);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".chapter-line",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: "expo.out" },
      );
      gsap.fromTo(
        ".chapter-words span",
        { opacity: 0, filter: "blur(7px)" },
        { opacity: 1, filter: "blur(0px)", stagger: 0.035, duration: 0.65 },
      );
    }, copyRef);
    return () => ctx.revert();
  }, [chapter]);
  const c = chapters[chapter];
  return (
    <section id="about" ref={root} className="about light">
      <div className="about-sticky">
        <div className="about-overline mono">{copy.t025}</div>
        <div className="about-grid" ref={copyRef}>
          <div className="chapter-left">
            <div className="mono chapter-line">{c.label}</div>
            <h2>
              <span className="chapter-line">{c.line}</span>
              <em className="chapter-line">{c.accent}</em>
            </h2>
            <span className="outline-pill chapter-line">{c.pill}</span>
          </div>
          <div className="rotation">
            <canvas ref={canvas} aria-label={copy.t060} />
          </div>
          <div className="chapter-right">
            <p className="chapter-words">
              {c.sentence.split(" ").map((w, i) => (
                <span key={chapter + "-" + i}>{w} </span>
              ))}
            </p>
            <div className="dashes">
              {chapters.map((_, i) => (
                <i key={i} className={chapter === i ? "active" : ""} />
              ))}
            </div>
          </div>
        </div>
        <div className="about-bottom mono">
          <span>{copy.t026}</span>
          <span>360° / {String(chapter + 1).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
// NUMBERS SECTION: paragraph reveal aur number counting animation yahan badlo.
// Paragraph, values aur labels data.js > numbers; text/chip sizes style.css > Numbers mein hain.
export function Numbers() {
  const root = useRef();
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".read-word", {
        color: "#efebe4",
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 55%",
          end: "bottom 80%",
          scrub: true,
        },
      });
      root.current.querySelectorAll(".number-chip").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 22, opacity: 0.2, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
        const n = el.querySelector("b"),
          obj = { v: 0 },
          target = Number(el.dataset.value);
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          roundProps: "v",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () =>
            (n.textContent = target === 6 ? "4–" + obj.v : String(obj.v)),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="numbers" ref={root} className="numbers dark padded">
      <Label aside={copy.t061}>{copy.t027}</Label>
      <p className="numbers-paragraph">
        {numbers.map((n, i) =>
          n.value ? (
            <span key={i} className="number-chip" data-value={n.value}>
              <b>{n.display}</b>
              <small>{n.label}</small>
            </span>
          ) : (
            n.text.split(" ").map((w, j) => (
              <span className="read-word" key={i + "-" + j}>
                {w}{" "}
              </span>
            ))
          ),
        )}
      </p>
    </section>
  );
}
// MOVING MARQUEE: continuous movement, scroll speed aur skew yahan badlo.
// Repeating words data.js > ui.marquee; band height/fonts style.css > .marquee mein hain.
export function Marquee() {
  const root = useRef(),
    track = useRef();
  useEffect(() => {
    if (reduced) return;
    let speed = 1,
      phase = 0,
      visible = true;
    const obs = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    obs.observe(root.current);
    const st = ScrollTrigger.create({
      onUpdate: (s) =>
        (speed = 1 + Math.min(6, Math.abs(s.getVelocity()) / 700)),
    });
    const tick = (_, d) => {
      if (!visible) return;
      phase -= (d / 1000) * 38 * speed;
      speed += (1 - speed) * 0.045;
      const w = track.current.scrollWidth / 2;
      if (-phase > w) phase += w;
      gsap.set(track.current, {
        x: phase,
        skewX: Math.min(6, (speed - 1) * 1.1),
      });
    };
    gsap.ticker.add(tick);
    return () => {
      obs.disconnect();
      st.kill();
      gsap.ticker.remove(tick);
    };
  }, []);
  return (
    <div className="marquee" ref={root}>
      <div ref={track}>
        {[0, 1].map((r) => (
          <div className="marquee-set" key={r}>
            {ui.marquee.map((s, i) => (
              <React.Fragment key={i}>
                <span className={i % 2 ? "serif" : "stroke"}>{s}</span>
                <b>✦</b>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
// PROJECT VISUAL 1: scanning document, highlighted lines aur mini bars ka design yahan badlo.
// Yeh concept animation hai; actual project results data.js se add karo.
function ScanVisual() {
  return (
    <div className="scan-visual">
      <div className="visual-top mono">
        <span>{copy.t029}</span>
        <i />
      </div>
      <div className="visual-document">
        <div className="doc-header">
          <span />
          <span />
        </div>
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={"doc-line " + (i === 2 || i === 5 ? "highlight" : "")}
            style={{ width: 60 + ((i * 13) % 35) + "%" }}
          />
        ))}
        <div className="scanner" />
      </div>
      <div className="score">
        <span className="mono">{copy.t030}</span>
        <strong>
          {copy.t031}
          <em>↗</em>
        </strong>
        <div className="mini-bars">
          {Array.from({ length: 16 }, (_, i) => (
            <i
              key={i}
              style={{
                height: 20 + ((i * 17) % 70) + "%",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="visual-bottom mono">
        {copy.t032}
        <span>{copy.t033}</span>
      </div>
    </div>
  );
}
// PROJECT VISUAL 2: heatmap ke cells, hover labels aur grid pattern yahan badlo.
// Colours, cell sizes aur animation style.css > .heatmap mein hain.
function Heatmap() {
  return (
    <div className="heatmap">
      {Array.from({ length: 80 }, (_, i) => (
        <span
          key={i}
          tabIndex={0}
          title={`Engagement cell ${i + 1}`}
          style={{
            "--shade": 0.1 + ((i * 7) % 10) / 12,
            "--delay": `${i * 0.04}s`,
          }}
        />
      ))}
      <b className="mono">{copy.t034}</b>
    </div>
  );
}
// PROJECT VISUAL 3: core aur orbiting pill labels yahan badlo.
// Rings, rotation speed aur core appearance style.css > .orbits / .orbit mein hain.
function Orbits() {
  return (
    <div className="orbits">
      <div className="core">TC</div>
      {[0, 1, 2].map((v) => (
        <div key={v} className={"orbit orbit-" + v}>
          <span>{["SEO", "CONTENT", "META ADS"][v]}</span>
        </div>
      ))}
    </div>
  );
}
// WORK / PROJECTS: browser window, tabs, 8-second autoplay, pause aur keyboard switching yahan hai.
// Project title, description, tech stack aur repo URL data.js > projects mein badlo.
// Browser window sizing/layout style.css > Work mein hai.
export function Work() {
  const root = useRef(),
    windowRef = useRef(),
    [active, setActive] = useState(0),
    [paused, setPaused] = useState(reduced),
    [visual, setVisual] = useState(0);
  const progress = useRef();
  useEffect(() => {
    if (reduced) return;
    const anim = gsap.fromTo(
      windowRef.current,
      { rotateX: 8, y: 90, opacity: 0.3 },
      {
        rotateX: 0,
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: windowRef.current,
          start: "top 95%",
          end: "top 35%",
          scrub: 1,
        },
      },
    );
    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);
  useEffect(() => {
    let elapsed = 0;
    let visible = false;
    const observer = new IntersectionObserver(
      ([e]) => (visible = e.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(root.current);
    const tick = (_, d) => {
      if (paused || !visible) return;
      elapsed += d / 1000;
      if (progress.current)
        progress.current.style.transform = `scaleX(${Math.min(1, elapsed / 8)})`;
      if (elapsed >= 8) {
        elapsed = 0;
        setActive((a) => (a + 1) % projects.length);
        setVisual((a) => (a + 1) % 3);
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      observer.disconnect();
    };
  }, [paused, active]);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".project-copy > *",
        { opacity: 0, y: 16, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.06, duration: 0.6 },
      );
      gsap.fromTo(
        ".project-screen",
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.7 },
      );
    }, root);
    return () => ctx.revert();
  }, [active]);
  const p = projects[active];
  function manual(a) {
    setActive((a + projects.length) % projects.length);
    setVisual((v) => (v + 1) % 3);
  }
  return (
    <section id="work" className="work light padded" ref={root}>
      <Label>{copy.t035}</Label>
      <Heading accent={copy.t062}>{copy.t036}</Heading>
      <div
        className="browser-window"
        ref={windowRef}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            manual(active + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            manual(active - 1);
          }
        }}
      >
        <div className="browser-tabs">
          <div className="traffic">
            <i />
            <i />
            <i />
          </div>
          {projects.map((p, i) => (
            <button
              key={p.title}
              className={i === active ? "selected" : ""}
              onClick={() => manual(i)}
            >
              {String(i + 1).padStart(2, "0")} — {p.title}
              <span ref={i === active ? progress : null} />
            </button>
          ))}
          <span className="mono project-count">{projects.length} PROJECT</span>
        </div>
        <div className="address-row">
          <span aria-hidden="true">← &nbsp; → &nbsp; ↻</span>
          <div className="address mono">
            <span>♧</span>{" "}
            {p.repo || "Topper Campus / SEO · Social Media · Ads"}
          </div>
          <button
            className="outline-pill"
            onClick={() => setPaused(!paused)}
            aria-label={
              paused ? "Play project rotation" : "Pause project rotation"
            }
          >
            {paused ? "▶ Play" : "Ⅱ Pause"}
          </button>
        </div>
        <div className="project-body">
          <aside>
            <span className="mono">{copy.t037}</span>
            {p.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
            <small className="mono">{p.dates}</small>
          </aside>
          <div className="project-copy">
            <div className="mono">{p.category}</div>
            <h3>
              {p.title.split(" ")[0]}{" "}
              <em>{p.title.split(" ").slice(1).join(" ")}</em>
            </h3>
            <p>{p.description}</p>
            {p.repo ? (
              <a
                className="button dark-button"
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                data-cursor="OPEN"
              >
                {copy.t038}
              </a>
            ) : (
              <span className="outline-pill unavailable" title={copy.t063}>
                {copy.t040}
              </span>
            )}
            <span className="mono page-counter">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
          <div
            className={"project-screen " + (paused ? "paused" : "")}
            data-cursor="OPEN"
            onClick={() => setVisual((v) => (v + 1) % 3)}
            role="button"
            tabIndex={0}
            aria-label={copy.t064}
            onKeyDown={(e) => {
              if (e.key === "Enter") setVisual((v) => (v + 1) % 3);
            }}
          >
            {visual === 0 ? (
              <ScanVisual />
            ) : visual === 1 ? (
              <Heatmap />
            ) : (
              <Orbits />
            )}
            <span className="visual-caption mono">{copy.t043}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
// SKILLS / PHYSICS: pills ka fall, drag/throw, filters aur Shake all ka behavior yahan hai.
// Skill names data.js > skills; gravity/restitution yahan; pill design/pit height style.css > Physics mein badlo.
export function Skills() {
  const root = useRef(),
    pit = useRef(),
    engineRef = useRef(),
    bodiesRef = useRef([]),
    els = useRef([]);
  const [filter, setFilter] = useState("All Skills");
  const flat = Object.entries(skills).flatMap(([group, list]) =>
    list.map((name) => ({ group, name })),
  );
  useEffect(() => {
    const { Engine, Bodies, Composite, Body, Constraint } = Matter;
    const engine = Engine.create({ gravity: { y: 1.1 } });
    engineRef.current = engine;
    let w = pit.current.clientWidth,
      h = pit.current.clientHeight,
      started = false,
      visible = false,
      drag = null;
    const walls = [
      Bodies.rectangle(w / 2, h + 30, w + 100, 60, { isStatic: true }),
      Bodies.rectangle(-30, h / 2, 60, h * 4, { isStatic: true }),
      Bodies.rectangle(w + 30, h / 2, 60, h * 4, { isStatic: true }),
    ];
    Composite.add(engine.world, walls);
    const bodies = flat.map((item, i) => {
      const el = els.current[i],
        r = el.getBoundingClientRect();
      const b = Bodies.rectangle(
        45 + Math.random() * (w - 90),
        -60 - i * 45,
        Math.min(r.width, w - 20),
        r.height,
        {
          restitution: 0.45,
          friction: 0.5,
          frictionAir: 0.018,
          chamfer: { radius: 22 },
          angle: (Math.random() - 0.5) * 0.5,
        },
      );
      b.plugin = { group: item.group, el, width: r.width, height: r.height };
      return b;
    });
    bodiesRef.current = bodies;
    const obs = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !started) {
          started = true;
          Composite.add(engine.world, bodies);
          if (reduced)
            bodies.forEach((b, i) =>
              Body.setPosition(b, {
                x: 55 + ((i % 4) * (w - 100)) / 4,
                y: h - 40 - Math.floor(i / 4) * 40,
              }),
            );
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(pit.current);
    let acc = 0;
    const tick = (_, d) => {
      if (!visible || !started) return;
      acc += Math.min(d, 50);
      while (acc >= 1000 / 60) {
        if (!reduced) Engine.update(engine, 1000 / 60);
        acc -= 1000 / 60;
      }
      bodies.forEach((b) => {
        const { el, width, height } = b.plugin;
        el.style.transform = `translate3d(${b.position.x - width / 2}px,${b.position.y - height / 2}px,0) rotate(${b.angle}rad)`;
      });
    };
    gsap.ticker.add(tick);
    const pos = (e) => {
      const r = pit.current.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e) => {
      const p = pos(e),
        hit = Matter.Query.point(bodies, p)[0];
      if (!hit) return;
      pit.current.setPointerCapture(e.pointerId);
      drag = Constraint.create({
        bodyB: hit,
        pointB: { x: p.x - hit.position.x, y: p.y - hit.position.y },
        pointA: p,
        stiffness: 0.18,
        damping: 0.12,
        length: 0,
      });
      Composite.add(engine.world, drag);
    };
    const move = (e) => {
      if (drag) drag.pointA = pos(e);
    };
    const up = () => {
      if (drag) {
        Composite.remove(engine.world, drag);
        drag = null;
      }
    };
    pit.current.addEventListener("pointerdown", down);
    pit.current.addEventListener("pointermove", move);
    pit.current.addEventListener("pointerup", up);
    pit.current.addEventListener("pointercancel", up);
    const resize = () => {
      w = pit.current.clientWidth;
      h = pit.current.clientHeight;
      Body.setPosition(walls[0], { x: w / 2, y: h + 30 });
      Body.setPosition(walls[2], { x: w + 30, y: h / 2 });
      bodies.forEach((b) => {
        if (b.position.x > w - 40)
          Body.setPosition(b, { x: w - 60, y: Math.min(h - 50, b.position.y) });
      });
    };
    window.addEventListener("resize", resize);
    return () => {
      obs.disconnect();
      gsap.ticker.remove(tick);
      Engine.clear(engine);
      window.removeEventListener("resize", resize);
    };
  }, []);
  function choose(group) {
    setFilter(group);
    bodiesRef.current.forEach((b) => {
      const match =
        group === "All Skills" || group === "Shake all" || b.plugin.group === group;
      b.plugin.el.style.opacity = match ? 1 : 0.18;
      b.plugin.el.classList.toggle("matched", group !== "All Skills" && match);
      if (match && !reduced) {
        Matter.Body.setVelocity(b, {
          x: (Math.random() - 0.5) * 12,
          y: -8 - Math.random() * 9,
        });
        Matter.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.2);
      }
    });
  }
  return (
    <section id="skills" ref={root} className="skills dark padded">
      <Label>{copy.t044}</Label>
      <Heading accent={copy.t065}>{copy.t045}</Heading>
      <div className="filters">
        {["All Skills", ...Object.keys(skills), "Shake all"].map((group) => (
          <button
            key={group}
            className={filter === group ? "active" : ""}
            onClick={() => choose(group)}
            aria-pressed={filter === group}
          >
            {group}
            {group === "Shake all" ? " ↗" : ""}
          </button>
        ))}
      </div>
      <div ref={pit} className="skill-pit" data-cursor="DRAG">
        <span className="pit-word">{copy.t046}</span>
        <div className="pit-help mono">{copy.t047}</div>
        {flat.map((s, i) => (
          <button
            key={s.name}
            ref={(el) => (els.current[i] = el)}
            className={"skill-body style-" + (i % 3)}
            title={s.group + " — press Enter to toss"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const b = bodiesRef.current[i];
                Matter.Body.setVelocity(b, { x: 3, y: -14 });
              }
            }}
          >
            {s.name}
          </button>
        ))}
        {filter !== "All Skills" &&
          filter !== "Shake all" &&
          skills[filter]?.length === 0 && (
            <span className="empty-filter mono">
              No {filter.toLowerCase()} skills listed in the resume.
            </span>
          )}
      </div>
    </section>
  );
}
// JOURNEY: scroll-based curved carousel, active card aur stop counter yahan hai.
// Card details data.js > education/experience; order data.js > milestones mein badlo.
// Card size, colours aur carousel radius style.css > Journey mein hain.
export function Journey() {
  const root = useRef(),
    ring = useRef();
  const [active, setActive] = useState(0);
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const v = self.progress * (milestones.length - 1);
        if (!reduced) gsap.set(ring.current, { rotationY: -v * 30 });
        setActive(Math.round(v));
      },
    });
    return () => st.kill();
  }, []);
  return (
    <section
      id="journey"
      className="journey dark"
      ref={root}
      style={{ height: `${100 + milestones.length * 60}vh` }}
    >
      <div className="journey-sticky padded">
        <Label>{copy.t048}</Label>
        <Heading accent={copy.t066}>{copy.t049}</Heading>
        <div className="carousel">
          <div className="journey-ring" ref={ring}>
            {milestones.map((m, i) => (
              <article
                key={i}
                className={
                  "milestone " + (reduced || i === active ? "active" : "")
                }
                style={{ "--angle": `${i * 30}deg` }}
                aria-hidden={!reduced && i !== active}
              >
                <span className="milestone-year">{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.place}</p>
                <span className="outline-pill">{m.meta}</span>
                <small className="mono">{m.dates}</small>
              </article>
            ))}
          </div>
        </div>
        <div className="journey-caption mono">
          STOP {String(active + 1).padStart(2, "0")} OF{" "}
          {String(milestones.length).padStart(2, "0")}
          <span>{copy.t050}</span>
        </div>
      </div>
    </section>
  );
}
// CERTIFICATIONS / PAPER TRAIL: certificate cards, diploma fallback aur pile-to-grid animation yahan hai.
// Actual certificates data.js > profile.certifications mein { name, issuer, category } objects ke roop mein add karo.
// Diploma data.js > education[1]; cards ke colours/sizes style.css > Credentials mein badlo.
export function Certifications() {
  const root = useRef(),
    grid = useRef();
  const cards = profile.certifications;
  useEffect(() => {
    if (reduced) return;
    const els = cards.length
      ? grid.current.children
      : [root.current.querySelector(".credential-card")];
    const ctx = gsap.context(() => {
      gsap.from(els, {
        x: (i) =>
          cards.length
            ? grid.current.clientWidth / 2 -
              els[i].offsetLeft -
              els[i].offsetWidth / 2
            : innerWidth * 0.2,
        y: (i) =>
          cards.length
            ? grid.current.clientHeight / 2 -
              els[i].offsetTop -
              els[i].offsetHeight / 2
            : 90,
        rotation: (i) => (i % 2 ? 1 : -1) * (14 + i * 4),
        scale: 0.62,
        stagger: 0.06,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    if (reduced) return;
    const fade = gsap.to(root.current.querySelector(".certificate-count"), {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=35%",
        scrub: true,
      },
    });
    return () => {
      fade.scrollTrigger?.kill();
      fade.kill();
    };
  }, []);
  return (
    <section
      id="certifications"
      ref={root}
      className="certifications light padded"
    >
      <Label>{copy.t051}</Label>
      <Heading accent={copy.t067}>{copy.t052}</Heading>
      <div className="certificate-count" aria-hidden="true">
        {String(cards.length || 1).padStart(2, "0")}
      </div>
      {cards.length ? (
        <div className="cert-grid" ref={grid}>
          {cards.map((c, i) => (
            <article className={"cert-card style-" + (i % 4)} key={i}>
              <span className="mono">{c.category}</span>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <div className="issuer-monogram">
                {c.issuer
                  .split(" ")
                  .map((s) => s[0])
                  .join("")}
              </div>
              <h3>{c.name}</h3>
              <p>{c.issuer}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="credential-grid">
          <article className="credential-card">
            <span className="mono">{copy.t054}</span>
            <span className="credential-number">{copy.t055}</span>
            <div className="issuer-monogram">{copy.t056}</div>
            <h3>{education[1].title}</h3>
            <p>{education[1].place}</p>
            <span className="mono">{copy.t057}</span>
          </article>
          <div className="credential-note">
            <span className="mono">{copy.t058}</span>
            <p>{ui.certificateNote}</p>
            <a
              href="/resume.pdf"
              target="_blank"
              className="outline-pill"
              rel="noreferrer"
            >
              {copy.t059}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
