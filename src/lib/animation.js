import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
export const reduced =
  new URLSearchParams(location.search).get("motion") === "reduce" ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  smoothWheel: !reduced,
});
lenis.stop();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
export function go(id) {
  lenis.scrollTo(id, { duration: reduced ? 0 : 1.4 });
}

document.documentElement.dataset.reduced = String(reduced);
