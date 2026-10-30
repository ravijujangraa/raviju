import { SEQ } from "./frames";
export const images = { run: [], wave: [], rot: [], rotc: [] };
export const quality = "lite";
export async function loadFrames(progress) {
  const jobs = Object.entries(SEQ).flatMap(([seq, n]) =>
    Array.from({ length: n }, (_, i) => ({ seq, i })),
  );
  let done = 0;
  let failed = [];
  // Bounded concurrency keeps decode memory and the network queue predictable.
  async function worker() {
    while (jobs.length) {
      const { seq, i } = jobs.shift();
      let loaded = false;
      for (let attempt = 0; attempt < 2 && !loaded; attempt++) {
        try {
          const img = new Image();
          const tier = attempt === 0 ? quality : "sd";
          const url = `${import.meta.env.BASE_URL}frames/${tier}/${seq}_${String(i).padStart(3, "0")}.webp`;
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => { img.src = ""; reject(new Error("Frame timeout")); }, 8000);
            img.onload = () => { clearTimeout(timeout); resolve(); };
            img.onerror = () => { clearTimeout(timeout); reject(new Error("Frame missing")); };
            img.src = url;
          });
          images[seq][i] = img;
          loaded = true;
        } catch (e) {
          if (attempt === 1) failed.push(`${seq}_${i}`);
        }
      }
      progress(++done / Object.values(SEQ).reduce((a, b) => a + b, 0));
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  if (failed.length) {
    console.warn(`${failed.length} animation frames unavailable; using nearby frames.`);
    const fallback = Object.values(images).flat().find(Boolean);
    for (const [seq, count] of Object.entries(SEQ)) {
      for (let i = 0; i < count; i++) {
        if (!images[seq][i]) images[seq][i] = images[seq][i - 1] || images[seq].find(Boolean) || fallback;
      }
    }
  }
}
export function paint(ctx, img, w, h, alpha = 1, flip = false) {
  if (!img) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (flip) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(img, 0, 0, w, h);
  ctx.restore();
}
export function sizeCanvas(canvas) {
  const r = canvas.getBoundingClientRect(),
    d = Math.min(devicePixelRatio, 2);
  canvas.width = Math.round(r.width * d);
  canvas.height = Math.round(r.height * d);
  const ctx = canvas.getContext("2d");
  ctx.scale(d, d);
  return { ctx, w: r.width, h: r.height };
}
