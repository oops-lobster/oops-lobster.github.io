(function(){
  const kicker=document.getElementById("todayKicker"),title=document.getElementById("todayTitle"),sub=document.getElementById("todaySub"),clock=document.getElementById("todayClock"),scheduleBtn=document.getElementById("todayScheduleBtn"),mapBtn=document.getElementById("todayMapBtn"),rule=document.getElementById("todayRule"),bar=document.getElementById("todayProgress");
  if(!title)return;

  let nextLine=document.getElementById("todayNextLine");
  if(!nextLine){
    nextLine=document.createElement("div");
    nextLine.id="todayNextLine";
    nextLine.className="today-nextline";
    nextLine.innerHTML='<small>NEXT</small><b id="todayNextTitle">첫 고정 일정 확인</b><span id="todayNextMeta"></span>';
    document.querySelector(".today-line")?.after(nextLine);
  }
  let altBtn=document.getElementById("todayAltBtn");
  if(!altBtn){
    altBtn=document.createElement("button");
    altBtn.id="todayAltBtn";
    altBtn.textContent="대안 보기";
    altBtn.hidden=true;
    mapBtn?.after(altBtn);
  }
  const nextTitle=document.getElementById("todayNextTitle"),nextMeta=document.getElementById("todayNextMeta");

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
    {s:540,e:600,title:"아침 · 장모님집",sub:"실제 식당 · 10:00에는 요양원으로 출발",sel:"#s-jangmo",place:"jangmo",alt:"#restaurants",nextAt:600},
    {s:600,e:644,title:"부추꽃요양원으로 이동",sub:"10:44 면회 시작 · 시간 여유 확보",sel:"#s-care-move",place:"care",nextAt:644},
    {s:644,e:690,title:"외할머니 면회",sub:"10:44–11:30 · 2일차 절대 고정",sel:"#s-care",place:"care",fixed:true,nextAt:690},
    {s:690,e:730,title:"집으로 복귀",sub:"11:30–12:10",sel:"#s-home",place:null,nextAt:730},
    {s:730,e:1440,title:"여행 마무리",sub:"고정 일정 완료",sel:"#s-home",place:null,nextAt:null}
  ];
  let current={sel:"#day1",place:null,alt:null};

  function seoulParts(){const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());const x={};parts.forEach(p=>x[p.type]=p.value);return {date:`${x.year}-${x.month}-${x.day}`,h:+x.hour,m:+x.minute};}
  function fmtMins(mins){if(mins==null)return "";const h=Math.floor(mins/60),m=mins%60;return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;}
  function untilText(diff){if(diff<=0)return "곧 시작";if(diff<60)return `${diff}분 후`;const h=Math.floor(diff/60),m=diff%60;return m?`${h}시간 ${m}분 후`:`${h}시간 후`;}
  function nextEntry(arr,idx){return idx>=0&&idx<arr.length-1?arr[idx+1]:null;}
  function set(entry,k,progress,clockText,next,mins){
    kicker.textContent=k;title.textContent=entry.title;sub.textContent=entry.sub;clock.textContent=clockText||"";current=entry;scheduleBtn.textContent="일정에서 보기";mapBtn.hidden=!entry.place;altBtn.hidden=!entry.alt;bar.style.width=Math.max(0,Math.min(100,progress))+"%";rule.textContent=entry.fixed?"고정 일정":"기본 일정 기준 · 낮잠 이후 시간은 유동";
    if(next){nextTitle.textContent=next.title;const at=entry.nextAt!=null?entry.nextAt:next.s;nextMeta.textContent=`${fmtMins(at)} · ${untilText(at-mins)}`;}else{nextTitle.textContent="오늘 일정 마무리";nextMeta.textContent="";}
  }
  function update(){
    const n=seoulParts(),mins=n.h*60+n.m;clock.textContent=`${String(n.h).padStart(2,"0")}:${String(n.m).padStart(2,"0")}`;
    if(n.date<"2026-09-26"){
      const trip=new Date("2026-09-26T09:20:00+09:00"),d=Math.ceil((trip-new Date())/86400000);const e={title:`여행까지 D-${Math.max(0,d)}`,sub:"첫날 09:20 출발 · 10:30–10:50 민성이 면회가 첫 고정 일정입니다.",sel:"#day1",place:null,alt:"#backup"};set(e,"TRIP BRIEF",0,"",{title:"민성이 면회",s:630},0);nextMeta.textContent="9/26 10:30 · FIXED";scheduleBtn.textContent="DAY 1 보기";rule.textContent="여행 당일에는 현재·다음 일정으로 자동 전환됩니다.";return;
    }
    if(n.date==="2026-09-26"){const idx=day1.findIndex(x=>mins>=x.s&&mins<x.e),i=idx<0?day1.length-1:idx,e=day1[i];set(e,e.fixed?"NOW · FIXED":"TODAY · DAY 1",(mins-560)/(1200-560)*100,undefined,nextEntry(day1,i),mins);return;}
    if(n.date==="2026-09-27"){const idx=day2.findIndex(x=>mins>=x.s&&mins<x.e),i=idx<0?day2.length-1:idx,e=day2[i];set(e,e.fixed?"NOW · FIXED":"TODAY · DAY 2",(mins-540)/(730-540)*100,undefined,nextEntry(day2,i),mins);return;}
    set({title:"여행 완료",sub:"인천–영종도 1박 2일 일정이 끝났습니다.",sel:"#day2",place:null,alt:null},"TRIP COMPLETE",100,"",null,mins);rule.textContent="";
  }
  scheduleBtn.addEventListener("click",()=>document.querySelector(current.sel)?.scrollIntoView({behavior:"smooth",block:"start"}));
  mapBtn.addEventListener("click",()=>{if(current.place&&typeof focusStop==="function")focusStop(current.place,false)});
  altBtn.addEventListener("click",()=>{if(current.alt)document.querySelector(current.alt)?.scrollIntoView({behavior:"smooth",block:"start"})});
  update();setInterval(update,30000);

  const restaurant=document.getElementById("restaurants");
  if(restaurant){
    const head=restaurant.querySelector(".subsection-head");
    if(head&&!document.getElementById("restaurantQuick")){
      const quick=document.createElement("div");quick.id="restaurantQuick";quick.className="restaurant-quick";quick.innerHTML='<div><small>시간 우선</small><b>미미진</b><span>10:30 오픈 · 연경 대기 길 때</span></div><div><small>맛 우선</small><b>신승반점</b><span>유니짜장 · 웨이팅 감수</span></div><div><small>중식 말고</small><b>경인면옥</b><span>11:00 오픈 · 냉면</span></div><div><small>BBQ 취소</small><b>우이며녹</b><span>가족식 · 10:00–21:30</span></div><div><small>고기 저녁</small><b>바른찜갈비</b><span>17시 저녁과 시간대 잘 맞음</span></div><div><small>2일차 아침</small><b>보경</b><span>장모님집 대안 · 나윤이 메뉴 별도 확인</span></div>';
      head.after(quick);
      const filters=document.createElement("div");filters.className="restaurant-filter";filters.innerHTML='<button class="active" data-rzone="all">전체</button><button data-rzone="china">차이나타운</button><button data-rzone="sinpo">신포</button><button data-rzone="yeongjong">영종도</button><button data-rzone="morning">아침</button>';quick.after(filters);
    }
    const cards=[...restaurant.querySelectorAll(".restaurant-card")];
    cards.forEach(card=>{const code=(card.querySelector(".code")?.textContent||"").trim();if(code.includes("차이나타운"))card.dataset.zone="china";else if(code.includes("신포"))card.dataset.zone="sinpo";else if(code.includes("영종도"))card.dataset.zone="yeongjong";else if(code.includes("2일차"))card.dataset.zone="morning";});
    document.querySelectorAll(".restaurant-filter button").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".restaurant-filter button").forEach(b=>b.classList.toggle("active",b===btn));const z=btn.dataset.rzone;cards.forEach(card=>card.hidden=z!=="all"&&card.dataset.zone!==z);}));
  }

  document.querySelectorAll(".backup-filter button").forEach(btn=>{btn.addEventListener("click",()=>{const f=btn.dataset.filter;document.querySelectorAll(".backup-card:not(.restaurant-card)").forEach(card=>{const tags=(card.dataset.tags||"").split(/\s+/);card.hidden=f!=="all"&&!tags.includes(f);card.classList.remove("dim");});if(restaurant){restaurant.hidden=!(f==="all"||f==="food"||f==="yeongjong"||f==="rain"||f==="short");if(f==="yeongjong")document.querySelector('.restaurant-filter [data-rzone="yeongjong"]')?.click();else if(f==="food")document.querySelector('.restaurant-filter [data-rzone="all"]')?.click();}},true);});
})();
