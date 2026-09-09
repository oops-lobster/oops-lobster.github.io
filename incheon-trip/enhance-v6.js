(function(){
  const kicker=document.getElementById("todayKicker"),title=document.getElementById("todayTitle"),sub=document.getElementById("todaySub"),clock=document.getElementById("todayClock"),scheduleBtn=document.getElementById("todayScheduleBtn"),mapBtn=document.getElementById("todayMapBtn"),rule=document.getElementById("todayRule"),bar=document.getElementById("todayProgress");
  if(!title)return;
  const day1=[
    {s:0,e:560,title:"출발 전",sub:"09:20 집 출발 · 10:30 민성이 면회가 첫 고정 일정",sel:"#day1",place:null},
    {s:560,e:630,title:"인천힐병원으로 이동",sub:"10:30–10:50 면회는 절대 고정",sel:"#s-hospital",place:"hospital"},
    {s:630,e:650,title:"민성이 면회",sub:"10:30–10:50 · 고정 일정",sel:"#s-visit",place:"hospital",fixed:true},
    {s:650,e:675,title:"낮잠 여부 확인",sub:"차에서 잠들면 점심보다 낮잠 우선",sel:"#s-nap",place:null},
    {s:675,e:720,title:"점심 · 연경",sub:"기본안 기준 · 나윤이가 자면 뒤로 미룸",sel:"#s-lunch",place:"lunch"},
    {s:720,e:800,title:"신포시장 / 낮잠 유동",sub:"닭강정 대기 30분 컷 · 낮잠이 더 중요",sel:"#s-sinpo",place:"sinpo"},
    {s:800,e:930,title:"월미도 · 뽀로로",sub:"13:20–15:30 전후 · 낮잠에 따라 입장 유동",sel:"#s-pororo",place:"pororo"},
    {s:930,e:990,title:"영종도로 이동",sub:"16:10–16:30 하나로마트 장보기",sel:"#s-hanaro",place:"hanaro"},
    {s:990,e:1020,title:"아빛스테이 체크인",sub:"짐 정리 · 나윤이 잠깐 휴식",sel:"#s-stay",place:"stay"},
    {s:1020,e:1080,title:"저녁 · 펜션 BBQ",sub:"날씨가 나쁘면 식당 대안으로 전환",sel:"#s-bbq",place:"stay"},
    {s:1080,e:1110,title:"마시안해변 일몰",sub:"선택 일정 · 피곤하면 바로 숙소",sel:"#s-masian",place:"masian"},
    {s:1110,e:1200,title:"나윤이 취침 루틴",sub:"씻기 → 취침 준비 → 20시 전후 육퇴",sel:"#s-night",place:null},
    {s:1200,e:1440,title:"육퇴",sub:"닭강정 · 회 등 야식",sel:"#s-night",place:null}
  ];
  const day2=[
    {s:0,e:540,title:"2일차 아침",sub:"09:00 장모님집에서 아침",sel:"#day2",place:null},
    {s:540,e:600,title:"아침 · 장모님집",sub:"실제 식당 · 10:00에는 요양원으로 출발",sel:"#s-jangmo",place:"jangmo"},
    {s:600,e:644,title:"부추꽃요양원으로 이동",sub:"10:44 면회 시작 · 시간 여유 확보",sel:"#s-care-move",place:"care"},
    {s:644,e:690,title:"외할머니 면회",sub:"10:44–11:30 · 2일차 절대 고정",sel:"#s-care",place:"care",fixed:true},
    {s:690,e:730,title:"집으로 복귀",sub:"11:30–12:10",sel:"#s-home",place:null},
    {s:730,e:1440,title:"여행 마무리",sub:"고정 일정 완료",sel:"#s-home",place:null}
  ];
  let current={sel:"#day1",place:null};
  function seoulParts(){const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());const x={};parts.forEach(p=>x[p.type]=p.value);return {date:`${x.year}-${x.month}-${x.day}`,h:+x.hour,m:+x.minute};}
  function set(entry,k,progress,clockText){kicker.textContent=k;title.textContent=entry.title;sub.textContent=entry.sub;clock.textContent=clockText||"";current=entry;scheduleBtn.textContent="일정에서 보기";mapBtn.hidden=!entry.place;bar.style.width=Math.max(0,Math.min(100,progress))+"%";rule.textContent=entry.fixed?"고정 일정":"기본 일정 기준 · 낮잠 이후 시간은 유동";}
  function update(){const n=seoulParts(),mins=n.h*60+n.m;clock.textContent=`${String(n.h).padStart(2,"0")}:${String(n.m).padStart(2,"0")}`;if(n.date<"2026-09-26"){const trip=new Date("2026-09-26T09:20:00+09:00"),d=Math.ceil((trip-new Date())/86400000);set({title:`여행까지 D-${Math.max(0,d)}`,sub:"9/26 10:30–10:50 민성이 면회가 첫 고정 일정입니다.",sel:"#day1",place:null},"TRIP BRIEF",0,"");scheduleBtn.textContent="DAY 1 보기";rule.textContent="여행 당일에는 현재·다음 일정으로 자동 전환됩니다.";return;}if(n.date==="2026-09-26"){const e=day1.find(x=>mins>=x.s&&mins<x.e)||day1[day1.length-1];set(e,e.fixed?"NOW · FIXED":"TODAY · DAY 1",(mins-560)/(1200-560)*100);return;}if(n.date==="2026-09-27"){const e=day2.find(x=>mins>=x.s&&mins<x.e)||day2[day2.length-1];set(e,e.fixed?"NOW · FIXED":"TODAY · DAY 2",(mins-540)/(730-540)*100);return;}set({title:"여행 완료",sub:"인천–영종도 1박 2일 일정이 끝났습니다.",sel:"#day2",place:null},"TRIP COMPLETE",100,"");rule.textContent="";}
  scheduleBtn.addEventListener("click",()=>document.querySelector(current.sel)?.scrollIntoView({behavior:"smooth",block:"start"}));
  mapBtn.addEventListener("click",()=>{if(current.place&&typeof focusStop==="function")focusStop(current.place,false)});
  update();setInterval(update,30000);

  document.querySelectorAll(".backup-filter button").forEach(btn=>{btn.addEventListener("click",()=>{const f=btn.dataset.filter;document.querySelectorAll(".backup-card").forEach(card=>{const tags=(card.dataset.tags||"").split(/\s+/);card.hidden=f!=="all"&&!tags.includes(f);card.classList.remove("dim");});const restaurant=document.getElementById("restaurants");if(restaurant)restaurant.hidden=f!=="all"&&f!=="food"&&f!=="yeongjong";},true);});
})();
