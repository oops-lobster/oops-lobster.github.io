const PLACES={
 hospital:{name:"인천힐병원",lat:37.4171991,lng:126.676533,kind:"fixed",naver:"https://map.naver.com/p/search/%EC%9D%B8%EC%B2%9C%ED%9E%90%EB%B3%91%EC%9B%90",time:"10:30–10:50 · 면회",desc:"1일차 절대 고정 일정"},
 lunch:{name:"연경 차이나타운본점",lat:37.4756379,lng:126.619844,kind:"meal",naver:"https://naver.me/5K5Go1Ld",time:"11시대 · 점심",desc:"낮잠이 시작되면 식사 시간을 늦춤"},
 sinpo:{name:"원조신포닭강정",lat:37.4716236,lng:126.628167,kind:"food",naver:"https://map.naver.com/p/search/%EC%8B%A0%ED%8F%AC%EB%8B%AD%EA%B0%95%EC%A0%95%20%EB%B3%B8%EC%A0%90%20%EC%9D%B8%EC%B2%9C",time:"12시 전후 · 포장",desc:"대기는 30분 컷"},
 pororo:{name:"뽀로로앤타요테마파크 월미도점",lat:37.4762534,lng:126.5992179,kind:"activity",naver:"https://naver.me/FBJIio81",time:"13:20–15:30 전후",desc:"나윤이 중심 메인 활동"},
 hanaro:{name:"중구농협 하나로마트 용유점",lat:37.443902,lng:126.402434,kind:"shop",naver:"https://map.naver.com/p/search/%EC%A4%91%EA%B5%AC%EB%86%8D%ED%98%91%20%ED%95%98%EB%82%98%EB%A1%9C%EB%A7%88%ED%8A%B8%20%EC%9A%A9%EC%9C%A0%EC%A0%90",time:"16:10–16:30 · 장보기",desc:"BBQ 재료 · 술 · 간식"},
 stay:{name:"아빛스테이",lat:37.43285,lng:126.4172,kind:"stay",naver:"https://naver.me/GDa6kEs1",time:"16:30 · 체크인",desc:"숙박 340,000원 · BBQ / 자쿠지"},
 masian:{name:"마시안해변",lat:37.4326627,lng:126.4175815,kind:"activity",naver:"https://map.naver.com/p/search/%EB%A7%88%EC%8B%9C%EC%95%88%ED%95%B4%EB%B3%80",time:"18:00 전후 · 선택",desc:"컨디션 좋을 때만 일몰 산책"},
 jangmo:{name:"장모님집",lat:37.424025006519,lng:126.42286476159,kind:"meal",naver:"https://map.naver.com/p/search/%EC%9E%A5%EB%AA%A8%EB%8B%98%EC%A7%91%20%EC%98%81%EC%A2%85%EB%8F%84%20%EB%A7%88%EC%8B%9C%EB%9E%80%EB%A1%9C%207",time:"09:00–10:00 · 아침",desc:"실제 식당명 · 마시란로 7"},
 care:{name:"부추꽃요양원",lat:37.6828861,lng:126.7908935,kind:"fixed",naver:"https://map.naver.com/p/search/%EB%B6%80%EC%B6%94%EA%BD%83%EC%9A%94%EC%96%91%EC%9B%90%20%EA%B3%A0%EC%96%91",time:"10:44–11:30 · 면회",desc:"2일차 절대 고정 일정"},
 museum:{name:"국립인천해양박물관",lat:37.4702399,lng:126.5960041,kind:"backup",naver:"https://map.naver.com/p/search/%EA%B5%AD%EB%A6%BD%EC%9D%B8%EC%B2%9C%ED%95%B4%EC%96%91%EB%B0%95%EB%AC%BC%EA%B4%80",time:"우천 대안 · 40분 회차",desc:"어린이박물관. 36개월 미만도 예약인원 포함"},
 wolmi_park:{name:"월미공원",lat:37.4765192,lng:126.6038633,kind:"backup",naver:"https://map.naver.com/p/search/%EC%9B%94%EB%AF%B8%EA%B3%B5%EC%9B%90",time:"가벼운 대안 · 45–90분",desc:"산책 + 물범카. 우천 시 물범카 중단 가능"},
 sea_train:{name:"월미바다열차 월미바다역",lat:37.4766472,lng:126.6171037,kind:"backup",naver:"https://map.naver.com/p/search/%EC%9B%94%EB%AF%B8%EB%B0%94%EB%8B%A4%EC%97%B4%EC%B0%A8%20%EC%9B%94%EB%AF%B8%EB%B0%94%EB%8B%A4%EC%97%AD",time:"탈것 대안 · 약 42분",desc:"뽀로로 대신 메인으로 선택"},
 fairytale:{name:"송월동 동화마을",lat:37.4783442274,lng:126.6197312122,kind:"backup",naver:"https://map.naver.com/p/search/%EC%86%A1%EC%9B%94%EB%8F%99%20%EB%8F%99%ED%99%94%EB%A7%88%EC%9D%84",time:"짧은 산책 · 20–40분",desc:"차이나타운 바로 옆. 무료 · 상시 개방"},
 jjajang:{name:"짜장면박물관",lat:37.4748446068,lng:126.6181814505,kind:"backup",naver:"https://map.naver.com/p/search/%EC%A7%9C%EC%9E%A5%EB%A9%B4%EB%B0%95%EB%AC%BC%EA%B4%80",time:"짧은 실내 · 20–30분",desc:"차이나타운 안의 짧은 실내 카드"},
 bogyung:{name:"보경",lat:37.4442,lng:126.4042,kind:"meal",naver:"https://map.naver.com/p/search/%EB%B3%B4%EA%B2%BD%20%EC%98%81%EC%A2%85%EB%8F%84%20%EB%82%A8%EB%B6%81%EB%A1%9C%2024",time:"2일차 아침 대안",desc:"장모님집 대안"}
};
const DAY1=["hospital","lunch","sinpo","pororo","hanaro","stay","masian"];
const DAY2=["jangmo","care"];
const BACKUP=["museum","wolmi_park","sea_train","fairytale","jjajang"];
let currentLayer="day1",map,routeLine=null;
const markers={},backupMarkers={};
const selectedStops = {};
let hasOpenedMap = false;
function seoulDate() {
  return new Intl.DateTimeFormat("en-CA", {timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
}
function daysToTrip() {
  return Math.round((Date.parse("2026-09-26T00:00:00Z") - Date.parse(seoulDate()+"T00:00:00Z"))/86400000);
}
const tripDate = seoulDate(), dd = daysToTrip();
document.getElementById("dDay").textContent = tripDate === "2026-09-26" ? "DAY 1" : tripDate === "2026-09-27" ? "DAY 2" : dd > 0 ? `D-${dd}` : "여행 완료";
const stopLabels = {hospital:"1·2",lunch:"3",sinpo:"4",pororo:"5",hanaro:"6",stay:"7·8",masian:"9",jangmo:"1",care:"2·3"};
function iconHtml(label,kind) {
  const multi = label.includes("·");
  return L.divIcon({className:"",html:`<div class="num-marker ${multi?"multi":""} ${kind==="fixed"?"fixed":kind==="backup"?"backup":""}">${label}</div>`,iconSize:[multi?42:36,36],iconAnchor:[multi?21:18,18],popupAnchor:[0,-18]});
}
function popup(pid) {
  const p = PLACES[pid];
  return `<div class="popup-title">${p.name}</div>${p.time?`<div class="popup-time">${p.time}</div>`:""}<div class="popup-sub">${p.desc||""}</div><div class="popup-links"><button class="popup-link" onclick="showSchedule('${pid}')">일정에서 보기</button><a class="popup-link" href="${p.naver}" target="_blank" rel="noopener noreferrer">네이버 지도 ↗</a></div>`;
}
function initMap() {
  if (map) return;
  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML = '<div class="map-fallback"><h2>지도를 불러오지 못했어요</h2><p>아래 장소를 누르면 네이버 지도가 열려요. 일정과 준비물은 계속 볼 수 있어요.</p>' + [...DAY1,...DAY2].map(pid => `<a href="${PLACES[pid].naver}" target="_blank" rel="noopener noreferrer">${PLACES[pid].name} ↗</a>`).join("") + '</div>';
    return;
  }
  map = L.map("map",{zoomControl:true,attributionControl:true}).setView([37.47,126.60],11);
  const base = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',updateWhenIdle:true,keepBuffer:3}).addTo(map);
  let errs=0, used=false;
  base.on("tileerror",()=>{
    if (++errs>=5 && !used) {
      used=true; map.removeLayer(base);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
    }
  });
  [...DAY1,...DAY2].forEach(pid=>{
    const p=PLACES[pid];
    const marker=L.marker([p.lat,p.lng],{icon:iconHtml(stopLabels[pid],p.kind),title:p.name,alt:p.name}).bindPopup(popup(pid));
    marker.on("click",()=>focusStop(pid,true)); markers[pid]=marker;
  });
  const labels=["M","P","T","F","J"];
  BACKUP.forEach((pid,i)=>{
    const p=PLACES[pid];
    const marker=L.marker([p.lat,p.lng],{icon:iconHtml(labels[i],"backup"),title:p.name,alt:p.name}).bindPopup(popup(pid));
    marker.on("click",()=>focusStop(pid,true));backupMarkers[pid]=marker;
  });
  showLayer(currentLayer); drawRoadRoute();
}
function fitCurrentLayer() {
  if (!map) return;
  const keys=currentLayer === "day2" ? DAY2 : currentLayer === "backup" ? [...DAY1,...BACKUP] : DAY1;
  map.fitBounds(keys.map(k=>[PLACES[k].lat,PLACES[k].lng]),{paddingTopLeft:[44,90],paddingBottomRight:[44,145]});
}
function showLayer(layer) {
  currentLayer=layer;
  document.querySelectorAll("[data-layer]").forEach(b=>{
    const on=b.dataset.layer===layer;b.classList.toggle("active",on);b.setAttribute("aria-pressed",on);
  });
  if (!map) return;
  Object.values(markers).forEach(m=>map.removeLayer(m));
  Object.values(backupMarkers).forEach(m=>map.removeLayer(m));
  if (routeLine) map.removeLayer(routeLine);
  const keys=layer === "day2" ? DAY2 : DAY1;
  keys.forEach(k=>markers[k].addTo(map));
  if (layer === "backup") Object.values(backupMarkers).forEach(m=>m.addTo(map));
  if (routeLine && layer !== "day2") routeLine.addTo(map);
  document.getElementById("mapNote").textContent=layer === "day2" ? "DAY 2 · 1 장모님집 → 2·3 부추꽃요양원" : layer === "backup" ? "M 해양박물관 · P 월미공원 · T 바다열차 · F 동화마을 · J 짜장면박물관" : "일정과 같은 번호 · 핀을 눌러 장소 정보를 확인하세요.";
  fitCurrentLayer();
}
document.querySelectorAll("[data-layer]").forEach(b=>b.addEventListener("click",()=>showLayer(b.dataset.layer)));
document.getElementById("fitRoute").addEventListener("click",fitCurrentLayer);
function markMobileTab(id) {
  document.querySelectorAll(".mobile-tabs button").forEach(b=>{
    const on=b.id===id;b.classList.toggle("active",on);b.setAttribute("aria-pressed",on);
  });
}
function openMobileMap() {
  if (window.innerWidth>980) return;
  document.body.classList.add("map-open");markMobileTab("tabMap");
  if (map) {
    map.invalidateSize();
    if (!hasOpenedMap) {fitCurrentLayer();hasOpenedMap=true;}
    [40,180,500].forEach(ms=>setTimeout(()=>map.invalidateSize({pan:false}),ms));
  }
}
function closeMobileMap() {
  document.body.classList.remove("map-open");markMobileTab("tabSchedule");
}
function showSchedule(pid) {
  closeMobileMap();
  window.revealBackupCard?.(pid);
  const el=(selectedStops[pid] && document.querySelector(selectedStops[pid])) || document.querySelector(`.stop[data-place="${pid}"]`) || document.querySelector(`[data-backup-place="${pid}"]`);
  setTimeout(()=>el?.scrollIntoView({behavior:"smooth",block:"start"}),70);
}
window.showSchedule=showSchedule;
document.getElementById("tabMap").addEventListener("click",openMobileMap);
document.getElementById("tabSchedule").addEventListener("click",closeMobileMap);
function focusStop(pid,fromMap=false,selector=null) {
  if (!PLACES[pid]) return;
  if (selector) selectedStops[pid]=selector;
  if (window.innerWidth<=980 && !fromMap) openMobileMap();
  if (!map) return;
  const layer=BACKUP.includes(pid)?"backup":DAY2.includes(pid)?"day2":"day1";
  if (currentLayer!==layer) showLayer(layer);
  const marker=backupMarkers[pid]||markers[pid];
  if (!marker) return;
  if (!fromMap) map.setView(marker.getLatLng(),pid==="care"?14:15);
  marker.openPopup();
  document.querySelectorAll(".stop").forEach(s=>s.classList.toggle("active",s.dataset.place===pid));
}
document.querySelectorAll(".focus-map").forEach(btn=>btn.addEventListener("click",()=>{
  const stop=btn.closest(".stop");
  const pid=btn.dataset.target||stop?.dataset.place||btn.closest("[data-backup-place]")?.dataset.backupPlace;
  if (pid) focusStop(pid,false,stop?.id?`#${stop.id}`:null);
}));
async function drawRoadRoute() {
  if (!map) return;
  const coords=DAY1.map(k=>`${PLACES[k].lng},${PLACES[k].lat}`).join(";");
  try {
    const r=await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
    if (!r.ok) throw new Error("Route unavailable");
    const j=await r.json();if (!j.routes?.[0]) throw new Error("No route");
    routeLine=L.geoJSON(j.routes[0].geometry,{style:{color:"#244f56",weight:3,opacity:.68}});
  } catch(e) {
    routeLine=L.polyline(DAY1.map(k=>[PLACES[k].lat,PLACES[k].lng]),{color:"#244f56",weight:2,opacity:.55,dashArray:"5 7"});
  }
  // A delayed DAY 1 route must not appear over DAY 2.
  if (currentLayer!=="day2") routeLine.addTo(map);
}
const napText={sleep:"차에서 바로 잠들면 점심 때문에 깨우지 않고 가능하면 1시간 전후 재운 뒤 이동.",awake:"안 잠들면 11:15 전후 점심 → 신포시장 짧게 → 12시대 차 이동을 낮잠 구간으로 사용. 뽀로로 입장은 늦춰도 됨.",short:"15–20분만 자면 가장 애매합니다. 뽀로로 입장을 늦추더라도 추가 수면을 먼저 시도."};document.querySelectorAll("#napSwitch button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#napSwitch button").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById("napAdvice").textContent=napText[b.dataset.nap];document.querySelectorAll("#napSwitch button").forEach(x=>x.setAttribute("aria-pressed",x===b))}));
const PACK=["기저귀 넉넉히 + 여분 2–3개","물티슈 · 휴대티슈 · 기저귀갈이 매트","기저귀 크림 · 기저귀 봉투/비닐","여벌옷 2세트 이상 · 잠옷 · 양말","뽀로로파크용 양말","턱받이 · 아기 수저/포크 · 빨대컵","물 · 이동용 간식 · 과일/퓨레","아기 식사 백업 — 즉석밥·김·평소 먹는 반찬","유모차 · 레인커버","아기띠(필요 시) · 얇은 담요","수면 애착템 · 취침 루틴 용품","체온계 · 평소 쓰는 상비약","선크림 · 모자","수영복 · 방수기저귀 · 아쿠아슈즈","부모 여벌옷 · 세면도구","충전기 · 보조배터리 · 차량 충전선","우산/우비 · 얇은 겉옷","신분증/지갑 · 면회 관련 필요물품","숙소 예약정보/체크인 연락처 캡처"];
const BBQ=["고기 — 삼겹/목살/소고기 등","나윤이용 간하지 않은 고기/식사 별도","상추 · 깻잎 · 마늘 · 고추","버섯 · 양파 등 구울 채소","쌈장 · 소금 · 후추","김치/반찬","밥 또는 즉석밥","나윤이용 김/밥/과일 등 저녁 백업","술 · 탄산/음료 · 생수","얼음","야식용 회를 살 경우 회 · 초장 · 간장 · 와사비","LPG 가스그릴 이용 여부 확정","기상 상황에 따라 BBQ 가능 여부 당일 확인","키친타월 · 호일 · 랩 · 지퍼백 필요 여부","쓰레기 분리배출 방식 확인"];
function renderChecks(id,prefix,items){const host=document.getElementById(id);if(!host)return;host.innerHTML='<div class="check-group">'+items.map((t,i)=>`<label class="check" for="${prefix}-${i}"><input id="${prefix}-${i}" type="checkbox" data-check="${prefix}"><span class="box"></span><span>${t}</span></label>`).join("")+'</div>'}renderChecks("packList","pack",PACK);renderChecks("bbqList","bbq",BBQ);
const checkboxes=[...document.querySelectorAll("input[data-check]")];checkboxes.forEach(c=>{try{c.checked=localStorage.getItem("incheon-v5:"+c.id)==="1"}catch(e){}c.addEventListener("change",()=>{try{localStorage.setItem("incheon-v5:"+c.id,c.checked?"1":"0")}catch(e){};updateProgress(c.dataset.check)})});function updateProgress(g){const a=checkboxes.filter(x=>x.dataset.check===g),n=a.filter(x=>x.checked).length;const bar=document.querySelector(`[data-progress="${g}"]`);if(bar)bar.style.width=(a.length?n/a.length*100:0)+"%"}["pack","bbq"].forEach(updateProgress);document.querySelectorAll("[data-reset]").forEach(b=>b.addEventListener("click",()=>{const g=b.dataset.reset;checkboxes.filter(x=>x.dataset.check===g).forEach(c=>{c.checked=false;try{localStorage.removeItem("incheon-v5:"+c.id)}catch(e){}});updateProgress(g)}));
const weatherModal=document.getElementById("weatherModal");
const weatherButton=document.getElementById("weatherInline"), closeWeather=document.getElementById("closeWeather");
function hideWeather(){weatherModal.classList.remove("open");weatherButton.focus()}
weatherButton.addEventListener("click",()=>{weatherModal.classList.add("open");closeWeather.focus()});
closeWeather.addEventListener("click",hideWeather);
weatherModal.addEventListener("click",e=>{if(e.target===weatherModal)hideWeather()});
weatherModal.addEventListener("keydown",e=>{
  if(e.key==="Escape")hideWeather();
  if(e.key==="Tab"){
    const items=[...weatherModal.querySelectorAll("button,a[href]")],first=items[0],last=items[items.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
});
const WMO={0:"맑음",1:"대체로 맑음",2:"구름 조금",3:"흐림",45:"안개",48:"안개",51:"약한 이슬비",53:"이슬비",55:"강한 이슬비",61:"약한 비",63:"비",65:"강한 비",80:"소나기",81:"소나기",82:"강한 소나기",95:"뇌우",96:"뇌우",99:"강한 뇌우"};
async function loadWeather(){
  const status=document.getElementById("weatherStatus"),grid=document.getElementById("weatherGrid"),today=seoulDate(),d=daysToTrip();
  grid.replaceChildren();
  if(d>15){status.textContent=`여행일까지 D-${d}. 9월 11일부터 예보 범위에 들어오는 날짜를 차례로 보여줘요.`;weatherButton.textContent="날씨 · 예보 대기";return}
  if(today>"2026-09-27"){status.textContent="여행이 끝나 실시간 예보 조회를 마쳤어요.";weatherButton.textContent="여행 날씨";return}
  const horizon=new Date(Date.parse(today+"T00:00:00Z")+15*86400000).toISOString().slice(0,10);
  const start=today>"2026-09-26"?today:"2026-09-26",end=horizon<"2026-09-27"?horizon:"2026-09-27";
  status.textContent="예보를 불러오는 중이에요.";
  const locations=[{name:"인천 구도심",lat:37.474,lng:126.616},{name:"영종도",lat:37.433,lng:126.418}];
  const results=await Promise.allSettled(locations.map(async loc=>{
    const u=`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,sunset&timezone=Asia%2FSeoul&forecast_days=16&start_date=${start}&end_date=${end}`;
    const r=await fetch(u);if(!r.ok)throw new Error("Weather unavailable");
    const j=await r.json();if(!j.daily?.time?.length)throw new Error("No weather");
    return {loc,daily:j.daily};
  }));
  results.forEach(result=>{
    if(result.status!=="fulfilled")return;
    const {loc,daily}=result.value;
    daily.time.forEach((date,i)=>{
      if(date<start||date>end)return;
      const e=document.createElement("div");e.className="wx";
      const sunset=(daily.sunset?.[i]||"").split("T")[1]||"—";
      e.innerHTML=`<b>${loc.name} · ${date.slice(5)}</b><strong>${WMO[daily.weather_code?.[i]]||"날씨"} · ${daily.temperature_2m_min?.[i]??"—"}–${daily.temperature_2m_max?.[i]??"—"}℃</strong><span>강수 ${daily.precipitation_probability_max?.[i]??"—"}% · ${daily.precipitation_sum?.[i]??"—"}mm · 바람 ${daily.wind_speed_10m_max?.[i]??"—"}km/h · 일몰 ${sunset}</span>`;
      grid.appendChild(e);
    });
  });
  const count=results.filter(r=>r.status==="fulfilled").length;
  status.textContent=count===0?"예보를 불러오지 못했어요. 아래 기상청에서 확인해 주세요.":count<2?"한 지역의 예보를 불러오지 못했어요. 표시된 지역부터 확인해 주세요.":end<"2026-09-27"?"9/26 예보부터 표시해요. 9/27 예보는 범위에 들어오면 함께 보여줘요.":"최신 예보예요. 여행이 가까워지면 다시 확인해 주세요.";
  weatherButton.textContent=count?"날씨 · 예보 보기":"날씨 · 연결 확인";
}
loadWeather();
if(window.innerWidth>980&&"IntersectionObserver" in window){const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&e.target.dataset.place&&DAY1.includes(e.target.dataset.place)&&map&&currentLayer==="day1"&&markers[e.target.dataset.place])map.panTo(markers[e.target.dataset.place].getLatLng(),{animate:true,duration:.3})}),{threshold:.62});document.querySelectorAll(".stop[data-place]").forEach(s=>ob.observe(s))}
if(document.readyState === "complete") initMap(); else window.addEventListener("load",initMap);