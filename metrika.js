(() => {
  if (!["atrokhina.online", "www.atrokhina.online"].includes(location.hostname)) return;

  const counterId = 114351549;
  const storageKey = "atrokhina.analytics-consent.v1";
  const footer = document.querySelector("footer");
  const english = window.PORTFOLIO_LANG === "en";
  const copy = english ? {
    settings: "Cookie settings",
    title: "Analytics cookies",
    message: "With your permission, Yandex Metrica uses cookies and collects information about visits, clicks and your browser so I can understand how the portfolio is used. You can change your choice in the footer.",
    privacy: "Yandex privacy policy",
    accept: "Allow analytics",
    decline: "Decline analytics"
  } : {
    settings: "Настройки cookies",
    title: "Файлы cookie для аналитики",
    message: "С вашего согласия Яндекс Метрика использует файлы cookie и собирает сведения о посещениях, кликах и браузере. Это помогает мне понять, как пользуются портфолио. Выбор можно изменить внизу страницы.",
    privacy: "Политика конфиденциальности Яндекса",
    accept: "Разрешить аналитику",
    decline: "Отклонить аналитику"
  };

  let analyticsStarted = false;
  function startAnalytics() {
    if (analyticsStarted) return;
    analyticsStarted = true;
    window.ym = window.ym || function () {
      (window.ym.a ||= []).push(arguments);
    };
    window.ym.l = Date.now();
    window.ym(counterId, "init", {
      url: location.origin + location.pathname,
      clickmap: true,
      webvisor: false,
      accurateTrackBounce: true
    });
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://mc.yandex.ru/metrika/tag.js?id=" + counterId;
    document.head.append(tag);
  }

  let consent;
  try {
    consent = localStorage.getItem(storageKey);
  } catch {
    // При недоступном хранилище выбор действует на открытой странице.
  }

  const settings = document.createElement("button");
  settings.type = "button";
  settings.className = "cookie-settings";
  settings.textContent = copy.settings;
  settings.setAttribute("aria-controls", "analytics-consent");
  footer.append(settings);

  const panel = document.createElement("section");
  panel.id = "analytics-consent";
  panel.className = "cookie-panel";
  panel.setAttribute("aria-labelledby", "analytics-consent-title");
  panel.innerHTML = '<h2 id="analytics-consent-title">' + copy.title + '</h2><p>' + copy.message +
    '</p><a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer">' +
    copy.privacy + '</a><div class="cookie-actions"><button type="button">' + copy.decline +
    '</button><button type="button">' + copy.accept + '</button></div>';
  document.body.append(panel);
  const [decline, accept] = panel.querySelectorAll("button");

  function showPanel(open) {
    panel.hidden = !open;
    settings.setAttribute("aria-expanded", String(open));
  }

  function choose(value) {
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      // Перезагрузка остановит счётчик, даже если выбор не удалось сохранить.
    }
    showPanel(false);
    settings.focus({preventScroll: true});
    if (value === "allow") startAnalytics();
    else if (analyticsStarted) location.reload();
  }

  settings.addEventListener("click", () => {
    showPanel(panel.hidden);
    if (!panel.hidden) decline.focus({preventScroll: true});
  });
  decline.addEventListener("click", () => choose("deny"));
  accept.addEventListener("click", () => choose("allow"));
  window.addEventListener("storage", event => {
    if ((event.key === storageKey || event.key === null) && analyticsStarted && event.newValue !== "allow") {
      location.reload();
    }
  });
  showPanel(consent !== "allow" && consent !== "deny");
  if (consent === "allow") startAnalytics();
})();
