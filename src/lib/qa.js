// Opt-in runtime evidence for the local viewport harness; no visible product UI.
if (new URLSearchParams(location.search).has("qa")) {
  const sample = [];
  let previous = 0;
  const tick = (t) => {
    if (previous && document.body.classList.contains("loaded"))
      {sample.push(t - previous);document.documentElement.dataset.qaSamples=String(sample.length);}
    previous = t;
    if (sample.length === 60) {
      const sorted = [...sample].sort((a, b) => a - b);
      document.documentElement.dataset.qaFps = (
        1000 /
        (sample.reduce((a, b) => a + b, 0) / sample.length)
      ).toFixed(1);
      document.documentElement.dataset.qaP95 =
        sorted[Math.floor(sorted.length * 0.95)].toFixed(1);
    }
    if (sample.length < 60) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
