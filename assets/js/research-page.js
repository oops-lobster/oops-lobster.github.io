(() => {
  const page = document.querySelector("[data-research-page]");
  if (!page) return;

  const controls = [...page.querySelectorAll("[data-research-language]")];
  const localizedCopy = [...page.querySelectorAll("[data-research-lang]")];
  const navigationLink = document.querySelector('[data-research-nav]');

  const showLanguage = (language) => {
    const activeLanguage = language === "en" ? "en" : "ko";

    localizedCopy.forEach((element) => {
      element.hidden = element.dataset.researchLang !== activeLanguage;
    });

    controls.forEach((control) => {
      const active = control.dataset.researchLanguage === activeLanguage;
      control.classList.toggle("is-active", active);
      control.setAttribute("aria-pressed", String(active));
    });

    if (navigationLink) {
      navigationLink.textContent = activeLanguage === "ko" ? "연구" : "Research";
    }

    document.documentElement.lang = activeLanguage === "ko" ? "ko-KR" : "en";
  };

  controls.forEach((control) => {
    control.addEventListener("click", () => showLanguage(control.dataset.researchLanguage));
  });

  showLanguage("ko");
})();
