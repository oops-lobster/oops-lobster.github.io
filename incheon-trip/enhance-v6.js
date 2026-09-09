/* Today status and alternative filters share one state per control group. */
(function(){
  "use strict";
  const day1=[
    {s:0,e:560,title:"출발 전",sub:"09:20 집 출발 · 10:30 민성이 면회가 첫 고정 일정",sel:"#day1",place:null,nextAt:560},
    {s:560,e:630,title:"인천힐병원으로 이동",sub:"10:30–10:50 면회는 절대 고정",sel:"#s-hospital",place:"hospital",nextAt:630},
    {s:630,e:650,title:"민성이 면회",sub:"10:30–10:50 · 고정 일정",sel:"#s-visit",place:"hospital",fixed:true,nextAt:650},
    {s:650,e:675,title:"낮잠 여부 확인",sub:"차에서 잠들면 점심보다 낮잠 우선",sel:"#s-nap",place:null,alt:"#restaurants",nextAt:675},
    {s:675,e:720,title:"점심 · 연경",sub:"기본안 기준 · 나윤이가 자면 뒤로 미룸",sel:"#s-lunch",place:"lunch",alt:"#restaurants",nextAt:720},
    {s:720,e:800,title:"신포시장 / 낮잠 유동",sub:"닭강정 대기 30분 컷 · 낮잠이 더 중요",sel:"#s-sinpo",place:"sinpo",alt:"#backup",nextAt:800},
    {s:800,e:930,title:"월미도 · 뽀로로",sub:"13:20–15:30 전후 · 낮잠에 따라 입장 유동",sel:"#s-pororo",place:"pororo",alt:"#backup",nextAt:930},
    {s:930,e:990,title:"영종도로 이동",sub:"16:10–16:30 하나로마트 장보기",sel:"#s-hanaro",place:"hanaro",nextAt:990},
    {s:990,e:1020,title:"아빛스테이 체크인",sub:"짐 정리 · 나윤이 잠깐 휴식",sel:"#s-stay",place:"stay",nextAt:1020},
    {s:1020,e:1080,title:"저녁 · 펜션 BBQ",sub:"날씨가 나쁘면 식당 대안으로 전환",sel:"#s-bbq",place:"stay",alt:"#restaurants",nextAt:1080},
    {s:1080,e:1110,title:"마시안해변 일몰",sub:"선택 일정 · 피곤하면 바로 숙소",sel:"#s-masian",place:"masian",alt:"#backup",nextAt:1110},
    {s:1110,e:1200,title:"나윤이 취침 루틴",sub:"씻기 → 취침 준비 → 20시 전후 육퇴",sel:"#s-night",place:null,nextAt:1200},
    {s:1200,e:1440,title:"육퇴",sub:"닭강정 · 회 등 야식",sel:"#s-night",place:null,nextAt:null}
  ];
  const day2=[
    {s:0,e:540,title:"2일차 아침",sub:"09:00 장모님집에서 아침",sel:"#day2",place:null,nextAt:540},
    {s:540,e:600,title:"아침 · 장모님집",sub:"10:00에는 요양원으로 출발",sel:"#s-jangmo",place:"jangmo",alt:"#restaurants",nextAt:600},
    {s:600,e:644,title:"부추꽃요양원으로 이동",sub:"10:44 면회 시작 · 시간 여유 확보",sel:"#s-care-move",place:"care",nextAt:644},
    {s:644,e:690,title:"외할머니 면회",sub:"10:44–11:30 · 2일차 절대 고정",sel:"#s-care",place:"care",fixed:true,nextAt:690},
    {s:690,e:730,title:"집으로 복귀",sub:"11:30–12:10",sel:"#s-home",place:null,nextAt:730},
    {s:730,e:1440,title:"여행 마무리",sub:"고정 일정 완료",sel:"#s-home",place:null,nextAt:null}
  ];
  const $ = id => document.getElementById(id);
  const today = $("today");
  const preview = $("todayPreview"), stepSelect = $("todayStep");
  const nextLine = document.createElement("div");
  nextLine.className = "today-nextline";
  nextLine.innerHTML = '<small>다음</small><b id="todayNextTitle"></b><span id="todayNextMeta"></span>';
  today.querySelector(".today-line").after(nextLine);
  const altButton = document.createElement("button");
  altButton.id = "todayAltBtn";
  altButton.textContent = "대안 보기";
  $("todayMapBtn").after(altButton);
  let mode = "auto", previewIndex = 1;
  let current = {sel: "#day1", place: null};

  function seoulParts() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const p = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return {date: `${p.year}-${p.month}-${p.day}`, mins: +p.hour * 60 + +p.minute};
  }
  function fmt(mins) {
    return `${String(Math.floor(mins / 60)).padStart(2,"0")}:${String(mins % 60).padStart(2,"0")}`;
  }
  function until(diff) {
    if (diff <= 0) return "곧 시작";
    if (diff < 60) return `${diff}분 후`;
    const h = Math.floor(diff / 60), m = diff % 60;
    return m ? `${h}시간 ${m}분 후` : `${h}시간 후`;
  }
  function paint(entry, kicker, next, nextMeta, progress, rule) {
    current = entry;
    $("todayKicker").textContent = kicker;
    $("todayTitle").textContent = entry.title;
    $("todaySub").textContent = entry.sub;
    $("todayNextTitle").textContent = next || "오늘 일정 마무리";
    $("todayNextMeta").textContent = nextMeta || "";
    $("todayScheduleBtn").textContent = "일정에서 보기";
    $("todayMapBtn").hidden = !entry.place;
    altButton.hidden = !entry.alt;
    $("todayRule").textContent = rule;
    const value = Math.round(Math.max(0, Math.min(100, progress)));
    $("todayProgress").style.width = value + "%";
    $("todayProgress").parentElement.setAttribute("aria-valuenow", value);
    document.querySelectorAll(".stop.is-current, .flex-block.is-current").forEach(el => {
      el.classList.remove("is-current"); el.removeAttribute("aria-current");
    });
    const target = document.querySelector(entry.sel);
    if (target && (mode !== "auto" || kicker.includes("현재"))) {
      target.classList.add("is-current"); target.setAttribute("aria-current", "step");
    }
  }
  function updateToday() {
    const n = seoulParts();
    $("todayClock").textContent = mode === "auto" ? fmt(n.mins) : "미리보기";
    $("todayClock").setAttribute("aria-label", mode === "auto" ? "한국 현재 시각" : "일정 미리보기");
    preview.hidden = mode === "auto";
    if (mode === "auto" && n.date < "2026-09-26") {
      const d = Math.round((Date.parse("2026-09-26T00:00:00Z") - Date.parse(n.date + "T00:00:00Z")) / 86400000);
      paint({title: `여행까지 D-${d}`, sub: "첫날 09:20 출발 · 면회 후에는 나윤이 낮잠을 먼저 살펴요.", sel:"#day1", alt:"#backup"},
        "9월 26–27일 · 여행 준비", "민성이 면회", "9/26 10:30–10:50 · 고정", 0,
        "여행 당일에는 한국 시각에 맞춰 현재·다음 일정을 보여줘요.");
      $("todayScheduleBtn").textContent = "DAY 1 보기";
      return;
    }
    if (mode === "auto" && n.date > "2026-09-27") {
      paint({title:"여행 완료",sub:"인천–영종도 1박 2일의 기록",sel:"#day2"}, "여행 마무리", "다녀온 일정 다시 보기", "DAY 1 · DAY 2에서 확인", 100, "");
      return;
    }
    const isDay2 = mode === "day2" || (mode === "auto" && n.date === "2026-09-27");
    const entries = isDay2 ? day2 : day1;
    const mins = mode === "auto" ? n.mins : entries[previewIndex].s;
    const index = mode === "auto" ? entries.findIndex(e => mins >= e.s && mins < e.e) : previewIndex;
    const entry = entries[index], next = entries[index + 1];
    const timing = next ? fmt(next.s) + (mode === "auto" ? ` · ${until(next.s - mins)}` : " · 기본안") : "";
    const start = isDay2 ? 540 : 560, end = isDay2 ? 730 : 1200;
    paint(entry, `${mode === "auto" ? "현재" : "미리보기"} · DAY ${isDay2 ? 2 : 1}${entry.fixed ? " · 고정" : ""}`,
      next?.title, timing, (mins-start)/(end-start)*100,
      entry.fixed ? "면회 시간은 고정이에요." : "기본 시간표 기준 · 낮잠 이후 일정은 유동적이에요.");
  }
  document.querySelectorAll("[data-today-mode]").forEach(button => button.addEventListener("click", () => {
    mode = button.dataset.todayMode;
    document.querySelectorAll("[data-today-mode]").forEach(b => {
      b.classList.toggle("active", b === button); b.setAttribute("aria-pressed", b === button);
    });
    if (mode !== "auto") {
      const entries = mode === "day2" ? day2 : day1;
      stepSelect.replaceChildren(...entries.map((e, i) => new Option(`${fmt(e.s)} · ${e.title}`, i)));
      previewIndex = 1; stepSelect.value = "1";
    }
    updateToday();
  }));
  stepSelect.addEventListener("change", () => { previewIndex = +stepSelect.value; updateToday(); });
  $("todayScheduleBtn").addEventListener("click", () => {
    closeMobileMap(); document.querySelector(current.sel)?.scrollIntoView({behavior:"smooth", block:"start"});
  });
  $("todayMapBtn").addEventListener("click", () => {
    if (current.place) focusStop(current.place, false, current.sel);
  });
  altButton.addEventListener("click", () => {
    const meal = current.sel === "#s-jangmo" ? "morning" : current.sel === "#s-bbq" ? "dinner" : "lunch";
    if (current.alt === "#restaurants") openRestaurants(meal);
    else { setSituation("all"); document.querySelector(current.alt)?.scrollIntoView({behavior:"smooth"}); }
  });
  updateToday();
  setInterval(updateToday, 30000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) updateToday(); });

  // A single filter render owns visibility. Regional and meal facets are independent.
  const restaurant = $("restaurants");
  const restaurants = [...restaurant.querySelectorAll(".restaurant-card")];
  const backups = [...document.querySelectorAll(".backup-list > .backup-card")];
  let situation = "all", region = "all", meal = "all";
  const summaries = [
    ["점심 대기 길 때", "미미진", "딤섬 · 중식", "r-mimijin"],
    ["유니짜장이 당길 때", "신승반점", "주말 대기는 감안", "r-sinseung"],
    ["가벼운 점심", "경인면옥", "신포 · 냉면", "r-gyeongin"],
    ["BBQ가 어려울 때", "우이며녹", "백합칼국수 · 영종도", "r-uimyeonok"],
    ["고기 저녁", "바른찜갈비", "토요일 저녁 후보", "r-galbi"],
    ["2일차 아침", "보경", "갈비탕 · 순대국", "r-bogyung"]
  ];
  const quick = document.createElement("div");
  quick.id = "restaurantQuick"; quick.className = "restaurant-quick";
  summaries.forEach(([label,name,note,id]) => {
    const b = document.createElement("button"); b.type = "button";
    b.innerHTML = `<small>${label}</small><b>${name}<span aria-hidden="true">↗</span></b><span>${note}</span>`;
    b.addEventListener("click", () => { situation = region = meal = "all"; applyFilters(); $(id).scrollIntoView({behavior:"smooth",block:"start"}); });
    quick.appendChild(b);
  });
  restaurant.querySelector(".subsection-head").after(quick);
  const controls = document.createElement("div"); controls.className = "restaurant-controls";
  controls.innerHTML = '<div class="filter-row"><span>지역</span><div class="restaurant-filter" aria-label="식당 지역">' +
    [["all","전체"],["china","차이나타운"],["sinpo","신포"],["yeongjong","영종도"]].map(([v,l]) => `<button data-rzone="${v}">${l}</button>`).join("") +
    '</div></div><div class="filter-row"><span>식사</span><div class="restaurant-filter" aria-label="식사 시간">' +
    [["all","전체"],["lunch","점심"],["dinner","저녁"],["morning","2일차 아침"]].map(([v,l]) => `<button data-rmeal="${v}">${l}</button>`).join("") +
    '</div></div><div class="filter-status"><p id="restaurantCount" role="status"></p><button id="resetFilters">필터 초기화</button></div><p id="restaurantEmpty" hidden>조건에 맞는 식당이 없어요. 지역이나 식사 시간을 바꿔보세요.</p>';
  quick.after(controls);
  const notes = {
    "r-mimijin": ["딤섬·유니짜장 후보. 대기 상황은 연경과 함께 확인해 주세요.", "https://www.diningcode.com/profile.php?rid=GQoEucOZ596f"],
    "r-uimyeonok": ["운영시간 안내가 달라 방문 전 매장 확인이 필요해요.", "https://app.catchtable.co.kr/ct/shop/uimyonok_baekapkalgukssu"],
    "r-galbi": ["일요일 휴무 안내 · 토요일 저녁 후보", "https://www.diningcode.com/profile.php?rid=mklFOCthnWnH"],
    "r-bogyung": ["갈비탕·순대국 메뉴 및 유아의자 안내 확인", "https://www.diningcode.com/profile.php?rid=vaJPwL8uMvn9"]
  };
  restaurants.forEach(card => {
    const action = document.createElement("div"); action.className = "backup-actions";
    const link = card.querySelector("h3 a").cloneNode(true); link.className = "small-action"; link.textContent = "네이버 지도 열기 ↗";
    action.appendChild(link);
    if (notes[card.id]) {
      const source = document.createElement("a"); source.href = notes[card.id][1]; source.target = "_blank"; source.rel = "noopener noreferrer";
      source.className = "official-link"; source.textContent = "메뉴·운영 안내 ↗"; action.appendChild(source);
    }
    card.lastElementChild.appendChild(action);
  });
  function pressed(selector, value, key) {
    document.querySelectorAll(selector).forEach(b => {
      const on = b.dataset[key] === value;
      b.classList.toggle("active", on); b.setAttribute("aria-pressed", on);
    });
  }
  function applyFilters() {
    const matchSituation = card => situation === "all" || situation === "food" && card.classList.contains("restaurant-card") || card.dataset.tags.split(/\s+/).includes(situation);
    backups.forEach(card => { card.hidden = !matchSituation(card); });
    restaurant.hidden = situation === "nap" || situation === "ride";
    restaurants.forEach(card => {
      card.hidden = !matchSituation(card) || region !== "all" && card.dataset.zone !== region || meal !== "all" && card.dataset.meal !== meal;
    });
    const count = restaurants.filter(card => !card.hidden).length;
    $("restaurantCount").textContent = `식당 ${count}곳`;
    $("restaurantEmpty").hidden = count !== 0;
    const places = backups.filter(card => !card.hidden).length;
    $("backupCount").textContent = `관광·동선 ${places}개${restaurant.hidden ? "" : ` · 식당 ${count}곳`}`;
    pressed("[data-filter]", situation, "filter");
    pressed("[data-rzone]", region, "rzone");
    pressed("[data-rmeal]", meal, "rmeal");
  }
  function setSituation(value) { situation = value; region = meal = "all"; applyFilters(); }
  function openRestaurants(value = "all") {
    closeMobileMap(); situation = "food"; region = "all"; meal = value; applyFilters();
    restaurant.scrollIntoView({behavior:"smooth",block:"start"});
  }
  window.revealBackupCard = function(pid) {
    if (document.querySelector(`[data-backup-place="${pid}"]`)) setSituation("all");
  };
  document.querySelectorAll(".backup-filter button").forEach(b => b.addEventListener("click", () => setSituation(b.dataset.filter)));
  controls.querySelectorAll("[data-rzone]").forEach(b => b.addEventListener("click", () => { region = b.dataset.rzone; applyFilters(); }));
  controls.querySelectorAll("[data-rmeal]").forEach(b => b.addEventListener("click", () => { meal = b.dataset.rmeal; applyFilters(); }));
  $("resetFilters").addEventListener("click", () => setSituation("all"));
  document.querySelectorAll('a[href="#restaurants"]').forEach(link => link.addEventListener("click", e => {
    e.preventDefault(); openRestaurants(link.dataset.meal || "all");
  }));
  document.querySelectorAll('a[href="#backup"]').forEach(link => link.addEventListener("click", () => { closeMobileMap(); setSituation("all"); }));
  $("tabBackup").addEventListener("click", () => { closeMobileMap(); setSituation("all"); $("backup").scrollIntoView({behavior:"smooth"}); markMobileTab("tabBackup"); });
  $("tabPacking").addEventListener("click", () => { closeMobileMap(); $("packing").scrollIntoView({behavior:"smooth"}); markMobileTab("tabPacking"); });
  applyFilters();
  let scrollPending = false;
  window.addEventListener("scroll", () => {
    if (scrollPending || document.body.classList.contains("map-open")) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      scrollPending = false;
      const threshold = window.innerHeight * .4;
      markMobileTab($("packing").getBoundingClientRect().top < threshold ? "tabPacking" : $("backup").getBoundingClientRect().top < threshold ? "tabBackup" : "tabSchedule");
    });
  }, {passive:true});
})();
