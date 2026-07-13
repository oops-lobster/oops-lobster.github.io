(() => {
  const carousel = document.querySelector("[data-hero-carousel]");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll("[data-hero-slide]")];
  const dots = [...carousel.querySelectorAll("[data-slide-to]")];
  const previous = carousel.querySelector("[data-slide-prev]");
  const next = carousel.querySelector("[data-slide-next]");
  const pause = carousel.querySelector("[data-slide-pause]");
  const pauseLabel = carousel.querySelector("[data-pause-label]");
  const currentLabel = carousel.querySelector("[data-slide-current]");
  const localizedCopy = [...document.querySelectorAll("[data-home-lang]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const interval = 6500;

  let current = 0;
  let timer;
  let paused = reducedMotion.matches;
  let focusWithin = false;

  carousel.classList.add("is-ready");

  const stopTimer = () => window.clearTimeout(timer);

  const schedule = () => {
    stopTimer();
    if (paused || focusWithin || document.hidden) return;
    timer = window.setTimeout(() => show(current + 1), interval);
  };

  const updatePauseButton = () => {
    pause.setAttribute("aria-pressed", String(paused));
    pause.setAttribute("aria-label", paused ? "자동 전환 재생" : "자동 전환 일시정지");
    pauseLabel.textContent = paused ? "Play" : "Pause";
  };

  const show = (requested) => {
    const target = (requested + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const active = index === target;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      if (active) slide.removeAttribute("inert");
      else slide.setAttribute("inert", "");
    });

    dots.forEach((dot, index) => {
      const active = index === target;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-pressed", String(active));
    });

    current = target;
    const language = slides[target].lang === "en" ? "en" : "ko";
    document.documentElement.lang = language === "en" ? "en" : "ko-KR";
    localizedCopy.forEach((element) => {
      element.hidden = element.dataset.homeLang !== language;
    });
    currentLabel.textContent = String(current + 1).padStart(2, "0");
    schedule();
  };

  previous.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.slideTo))));

  pause.addEventListener("click", () => {
    paused = !paused;
    updatePauseButton();
    schedule();
  });

  carousel.addEventListener("focusin", () => {
    focusWithin = true;
    stopTimer();
  });
  carousel.addEventListener("focusout", (event) => {
    if (carousel.contains(event.relatedTarget)) return;
    focusWithin = false;
    schedule();
  });
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", (event) => {
    paused = event.matches;
    updatePauseButton();
    schedule();
  });

  updatePauseButton();
  schedule();
})();
