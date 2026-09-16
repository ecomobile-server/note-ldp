const track = document.querySelector(".screenshot-track");
const slides = [...track.children];
const prev = document.querySelector("#screenshot-prev");
const next = document.querySelector("#screenshot-next");
const status = document.querySelector("#screenshot-status");
const dotsContainer = document.querySelector(".carousel-dots");
let stops = [],
  current = 0;
const position = (i) => slides[i].offsetLeft - slides[0].offsetLeft;
function update() {
  current = stops.reduce(
    (best, x, i) =>
      Math.abs(x - track.scrollLeft) < Math.abs(stops[best] - track.scrollLeft)
        ? i
        : best,
    0,
  );
  [...dotsContainer.children].forEach((dot, i) => {
    if (i === current) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  status.textContent = `${current + 1} / ${stops.length}`;
}
function move(i) {
  const target = (i + stops.length) % stops.length;
  track.scrollTo({
    left: stops[target],
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
}
function layout() {
  const max = Math.max(0, track.scrollWidth - track.clientWidth);
  stops = [...new Set(slides.map((s, i) => Math.min(position(i), max)))];
  dotsContainer.replaceChildren(
    ...stops.map((x, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carousel-dot";
      b.setAttribute("aria-label", `Go to screenshot group ${i + 1}`);
      b.setAttribute("aria-controls", "screenshot-track");
      b.addEventListener("click", () => move(i));
      return b;
    }),
  );
  track.scrollTo({
    left: stops[Math.min(current, stops.length - 1)],
    behavior: "instant",
  });
  update();
}
prev.addEventListener("click", () => move(current - 1));
next.addEventListener("click", () => move(current + 1));
track.addEventListener("scroll", update, { passive: true });
track.addEventListener("keydown", (e) => {
  if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
    e.preventDefault();
    move(current + (e.key === "ArrowRight" ? 1 : -1));
  }
});
new ResizeObserver(layout).observe(track);
layout();
