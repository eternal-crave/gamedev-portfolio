// Game screenshots lean a little toward the mouse as it comes near them.
// The float loop is a CSS animation on `transform`; this script only sets the separate
// `translate` property, so the two add up. Touch input and reduced motion get no pull.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const REACH = 280; // px from an image's edge where the pull starts
  const PULL = 14;   // px, the furthest an image moves
  const EASE = 0.12; // share of the remaining distance covered per 60 Hz frame

  const shots = [...document.querySelectorAll('.shot')].map((el) => ({ el, x: 0, y: 0, tx: 0, ty: 0 }));
  if (!shots.length) return;

  let px = null;
  let py = null;
  let raf = 0;
  let last = 0;

  // Layout box in viewport coordinates. offsetLeft/offsetTop ignore transforms, so the
  // float and the pull itself don't feed back into the measurement.
  function box(el) {
    let x = 0;
    let y = 0;
    for (let n = el; n; n = n.offsetParent) {
      x += n.offsetLeft;
      y += n.offsetTop;
    }
    return { x: x - scrollX, y: y - scrollY, w: el.offsetWidth, h: el.offsetHeight };
  }

  function aim(s) {
    s.tx = 0;
    s.ty = 0;
    if (px === null) return;
    const b = box(s.el);
    if (!b.w || b.y > innerHeight + REACH || b.y + b.h < -REACH) return;
    const dx = px - (b.x + b.w / 2);
    const dy = py - (b.y + b.h / 2);
    const edge = Math.hypot(Math.max(Math.abs(dx) - b.w / 2, 0), Math.max(Math.abs(dy) - b.h / 2, 0));
    if (edge >= REACH) return;
    let f = 1 - edge / REACH;
    f = f * f * (3 - 2 * f); // smoothstep: soft start, full pull at the edge
    const len = Math.hypot(dx, dy) || 1;
    const calm = Math.min(len / (Math.min(b.w, b.h) / 2), 1); // settles when the mouse is over the middle
    s.tx = (dx / len) * PULL * f * calm;
    s.ty = (dy / len) * PULL * f * calm;
  }

  function frame(now) {
    const k = 1 - Math.pow(1 - EASE, Math.min(now - last, 64) / 16.7);
    last = now;
    let moving = false;
    for (const s of shots) {
      aim(s);
      s.x += (s.tx - s.x) * k;
      s.y += (s.ty - s.y) * k;
      if (Math.abs(s.tx - s.x) < 0.05 && Math.abs(s.ty - s.y) < 0.05) {
        s.x = s.tx;
        s.y = s.ty;
      } else {
        moving = true;
      }
      s.el.style.translate = s.x || s.y ? `${s.x.toFixed(2)}px ${s.y.toFixed(2)}px` : '';
    }
    raf = moving ? requestAnimationFrame(frame) : 0;
  }

  function kick() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    px = e.clientX;
    py = e.clientY;
    kick();
  }, { passive: true });

  addEventListener('scroll', () => { if (px !== null) kick(); }, { passive: true });

  const away = () => { px = null; py = null; kick(); };
  addEventListener('mouseout', (e) => { if (!e.relatedTarget) away(); });
  addEventListener('blur', away);
})();
