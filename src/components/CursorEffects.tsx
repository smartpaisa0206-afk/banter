import { useEffect } from 'react';

export function CursorEffects() {
  useEffect(() => {
    const progress = document.getElementById('scrollProgress');
    const ring = document.getElementById('cursorRing');

    const onScroll = () => {
      if (!progress) return;
      const h = document.documentElement;
      const pct = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100;
      progress.style.setProperty('--scroll-width', `${pct}%`);
    };

    const onMove = (e: MouseEvent) => {
      if (!ring) return;
      ring.classList.add('show');
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
    };

    const onLeave = () => ring?.classList.remove('show');
    const big = () => ring?.classList.add('big');
    const small = () => ring?.classList.remove('big');

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const addHoverListeners = () => {
      const hoverables = Array.from(document.querySelectorAll('a, button, .premium-card, .card-hover'));
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', big);
        el.addEventListener('mouseleave', small);
      });
      return hoverables;
    };

    let hoverables = addHoverListeners();
    const interval = setInterval(() => {
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', big);
        el.removeEventListener('mouseleave', small);
      });
      hoverables = addHoverListeners();
    }, 2000);

    onScroll();

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', big);
        el.removeEventListener('mouseleave', small);
      });
    };
  }, []);

  return (
    <>
      <div id="scrollProgress" className="scroll-progress" />
      <div id="cursorRing" className="cursor-ring" />
    </>
  );
}
