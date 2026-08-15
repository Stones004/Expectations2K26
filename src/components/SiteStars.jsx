import { useEffect, useRef } from 'react';

export default function SiteStars() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 1.25);
    let width, height, frame, scrollY = 0, lastDraw = 0;
    let visible = !document.hidden;
    const mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };
    const stars = Array.from({ length: 56 }, (_, index) => ({
      x: Math.random(), y: Math.random(), radius: .5 + Math.random() * 1.35,
      phase: Math.random() * 7, twinkle: index % 8 === 0
    }));

    const resize = () => {
      width = canvas.width = innerWidth * dpr;
      height = canvas.height = innerHeight * dpr;
    };
    const move = (event) => {
      mouse.targetX = event.clientX * dpr;
      mouse.targetY = event.clientY * dpr;
    };
    const onScroll = () => { scrollY = window.scrollY; };
    const visibilityChange = () => { visible = !document.hidden; };

    resize();
    addEventListener('resize', resize);
    addEventListener('mousemove', move, { passive: true });
    addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', visibilityChange);

    let time = 0;
    const draw = (now) => {
      frame = requestAnimationFrame(draw);
      if (!visible || now - lastDraw < 33) return;
      lastDraw = now;
      time += .033;
      mouse.x += (mouse.targetX - mouse.x) * .1;
      mouse.y += (mouse.targetY - mouse.y) * .1;
      context.clearRect(0, 0, width, height);
      const nearby = [];

      for (const star of stars) {
        const x = star.x * width + Math.sin(time * .3 + star.phase) * 5 * dpr;
        const y = (star.y * height - scrollY * .018 * dpr + height) % height;
        const proximity = Math.max(0, 1 - Math.hypot(mouse.x - x, mouse.y - y) / (190 * dpr));
        const pulse = star.twinkle ? .48 + .52 * Math.max(0, Math.sin(time * 1.9 + star.phase)) : .68;
        nearby.push({ x, y, proximity });
        context.fillStyle = `rgba(235,225,196,${Math.min(.13 + pulse * .28 + proximity * .45, .95)})`;
        context.beginPath();
        context.arc(x, y, star.radius * (1 + proximity * 1.45) * dpr, 0, Math.PI * 2);
        context.fill();
      }
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('resize', resize);
      removeEventListener('mousemove', move);
      removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', visibilityChange);
    };
  }, []);

  return <canvas ref={ref} className="site-stars" aria-hidden />;
}
