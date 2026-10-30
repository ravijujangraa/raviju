import { copy } from "./data";
import React, { useRef, useEffect } from "react";
import { images, paint, sizeCanvas } from "./lib/images";
import { SEQ, RUN, ROT } from "./lib/frames";
import { gsap, reduced } from "./lib/animation";
import { ui } from "./data";
// ANIMATED CHARACTER: Hero ka walking/running/turning/waving behavior aur Contact ki wave yahan hai.
// Movement speed, stop distance, turn duration aur idle-wave interval isi component mein hain.
// Speech bubble text data.js > ui.bubbles; canvas height/position aur bubble style style.css mein badlo.
// Naye videos se frames banane ke liye build_frames.py use karo; frame metadata manually mat badlo.
export default function Character({ ready, contact = false }) {
  const canvas = useRef(),
    wrap = useRef(),
    bubble = useRef(),
    dust = useRef();
  useEffect(() => {
    if (!ready) return;
    const el = canvas.current,
      box = wrap.current,
      parent = box.parentElement;
    let surface = sizeCanvas(el),
      visible = true,
      clock = 0,
      last = 0,
      idle = 0,
      index = 0,
      bubbleIndex = 0;
    let x = contact ? 0 : parent.clientWidth / 2,
      target = x,
      velocity = 0,
      dir = 1,
      state = contact ? "wave" : "intro",
      elapsed = 0,
      previous = null,
      previousFlip = false,
      transition = 1,
      current = null,
      currentFlip = false,
      turnOrigin = 0,
      turnDestination = 0,
      dustTime = 0,
      flipAt = 0;
    const setX = gsap.quickSetter(box, "x", "px"),
      setLean = gsap.quickSetter(el, "rotation", "deg");
    const obs = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        last = 0;
      },
      { threshold: 0 },
    );
    obs.observe(parent);
    function say() {
      if (!bubble.current) return;
      bubble.current.textContent = contact
        ? "Bye for now!"
        : ui.bubbles[bubbleIndex++ % ui.bubbles.length];
      gsap.fromTo(
        bubble.current,
        { opacity: 0, y: 14, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: reduced ? 0 : 0.6 },
      );
    }
    function change(s) {
      previous = current;
      previousFlip = currentFlip;
      transition = 0;
      state = s;
      elapsed = 0;
      if (s === "wave") say();
      else if (bubble.current)
        gsap.to(bubble.current, { opacity: 0, y: 6, duration: 0.2 });
    }
    function turn(toFront = false) {
      turnOrigin = toFront ? (dir === 1 ? ROT.right : ROT.left) : 0;
      turnDestination = toFront ? 0 : dir === 1 ? ROT.right : ROT.left;
      change(toFront ? "front" : "turn");
    }
    function rotFrame(t, from, to) {
      // A second-half profile is reached by playing backwards from the end.
      if (from === 0 && to > ROT.end / 2) from = ROT.end;
      if (to === 0 && from > ROT.end / 2) to = ROT.end;
      return Math.max(0, Math.min(ROT.end, Math.round(from + (to - from) * t)));
    }
    function pointer(e) {
      if (contact || reduced) return;
      const r = parent.getBoundingClientRect();
      target = Math.max(
        surface.w * 0.3 + 12,
        Math.min(r.width - surface.w * 0.3 - 12, e.clientX - r.left),
      );
    }
    function resize() {
      surface = sizeCanvas(el);
      if (!contact) {
        x = Math.max(80, Math.min(parent.clientWidth - 80, x));
        target = x;
      }
    }
    parent.addEventListener("pointermove", pointer);
    window.addEventListener("resize", resize);
    if (contact || reduced) {
      state = "wave";
      say();
    }
    function tick(_, delta) {
      if (!visible) return;
      let dt = Math.min((delta || 16.67) / 1000, 0.05);
      clock += dt;
      elapsed += dt;
      transition = Math.min(1, transition + dt / 0.14);
      let seq = "wave",
        frame = 0,
        mirror = false;
      if (contact) {
        frame = reduced ? 20 : Math.floor(clock * 26) % SEQ.wave;
      } else if (reduced) {
        frame = 20;
        setX(parent.clientWidth / 2);
      } else {
        const dist = target - x,
          desiredDir = dist >= 0 ? 1 : -1;
        if (state === "intro" && elapsed > 0.3) change("wave");
        if (["wave", "intro", "stand"].includes(state) && Math.abs(dist) > 50) {
          dir = desiredDir;
          turn();
        }
        if (state === "turn") {
          seq = "rot";
          frame = rotFrame(
            Math.min(1, elapsed / 0.26),
            turnOrigin,
            turnDestination,
          );
          if (elapsed >= 0.26) change("start");
        } else if (state === "start") {
          seq = "run";
          mirror = dir < 0;
          frame = Math.round(
            RUN.startFrom +
              Math.min(1, elapsed / 0.3) * (RUN.startTo - RUN.startFrom),
          );
          if (elapsed >= 0.3) change("run");
        } else if (state === "run") {
          if (desiredDir !== dir && Math.abs(dist) > 20) {
            dir = desiredDir;
            flipAt = clock;
            gsap.fromTo(
              el,
              { scaleX: 0.78, scaleY: 1.07 },
              { scaleX: 1, scaleY: 1, duration: 0.2 },
            );
          }
          const max = Math.max(420, Math.min(980, parent.clientWidth * 0.62));
          const speed = Math.min(max, Math.abs(dist) * 3.4);
          velocity += (dir * speed - velocity) * (1 - Math.exp(-dt * 9));
          x += velocity * dt;
          seq = "run";
          mirror = dir < 0;
          index +=
            dt * 24 * Math.max(0.75, Math.min(1.55, Math.abs(velocity) / 400));
          frame =
            RUN.loopFrom + (Math.floor(index + RUN.loopEntry) % RUN.loopLen);
          setLean(Math.max(-2.2, Math.min(2.2, velocity / 300)));
          dustTime += dt;
          if (dustTime > 0.12 && Math.abs(velocity) > 100) {
            dustTime = 0;
            const p = document.createElement("i");
            dust.current.appendChild(p);
            gsap.fromTo(
              p,
              { x: 0, y: 0, scale: 0.3, opacity: 0.28 },
              {
                x: -dir * (20 + Math.random() * 25),
                y: -8 - Math.random() * 18,
                scale: 2,
                opacity: 0,
                duration: 0.65,
                onComplete: () => p.remove(),
              },
            );
          }
          if (Math.abs(dist) < 14) {
            velocity = 0;
            change("stop");
          }
        } else if (state === "stop") {
          seq = "run";
          mirror = dir < 0;
          frame = Math.round(
            RUN.startTo -
              Math.min(1, elapsed / 0.3) * (RUN.startTo - RUN.startFrom),
          );
          setLean(0);
          if (elapsed >= 0.3) turn(true);
        } else if (state === "front") {
          seq = "rot";
          frame = rotFrame(
            Math.min(1, elapsed / 0.28),
            turnOrigin,
            turnDestination,
          );
          if (elapsed >= 0.28) {
            change("wave");
            idle = clock;
          }
        } else if (state === "wave") {
          seq = "wave";
          frame = Math.min(SEQ.wave - 1, Math.floor(elapsed * 26));
          if (elapsed > SEQ.wave / 26) {
            change("stand");
            idle = clock;
          }
        } else {
          frame = 0;
          if (clock - idle > 6.5) change("wave");
        }
        setX(x);
        const name = parent.querySelector(".hero-name");
        if (name) gsap.set(name, { x: -(x - parent.clientWidth / 2) * 0.025 });
        parent.querySelectorAll(".side-note").forEach((n) => {
          const r = n.getBoundingClientRect(),
            pr = parent.getBoundingClientRect();
          const close = x > r.left - pr.left - 90 && x < r.right - pr.left + 90;
          if (n.dataset.near !== String(close)) {
            n.dataset.near = String(close);
            gsap.to(n, {
              opacity: close ? 0.08 : 1,
              duration: 0.4,
              overwrite: true,
            });
          }
        });
        if (bubble.current) {
          const right = x > parent.clientWidth * 0.64;
          bubble.current.classList.toggle("on-left", right);
        }
      }
      box.dataset.state = state;
      box.dataset.facing = String(dir);
      box.dataset.x = String(Math.round(x));
      current =
        images[seq][Math.max(0, Math.min(images[seq].length - 1, frame))];
      currentFlip = mirror;
      surface.ctx.clearRect(0, 0, surface.w, surface.h);
      if (previous && transition < 1)
        paint(
          surface.ctx,
          previous,
          surface.w,
          surface.h,
          1 - transition,
          previousFlip,
        );
      paint(
        surface.ctx,
        current,
        surface.w,
        surface.h,
        previous ? transition : 1,
        mirror,
      );
    }
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      obs.disconnect();
      parent.removeEventListener("pointermove", pointer);
      window.removeEventListener("resize", resize);
    };
  }, [ready, contact]);
  return (
    <div
      ref={wrap}
      className={`character ${contact ? "contact-character" : ""}`}
      aria-label={copy.t068}
    >
      <div className="contact-shadow" />
      <canvas ref={canvas} />
      <div ref={dust} className="dust" />
      <span ref={bubble} className={`speech ${contact ? "glass" : ""}`} />
    </div>
  );
}
