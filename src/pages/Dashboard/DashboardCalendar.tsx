import React,{useState,useRef,useEffect}from"react"
import{ChevronLeft,ChevronRight,Filter,Calendar as CalIcon,Info,X}from"lucide-react"

type Event={id:number;title:"TBM"|"안전교육"|"점검"|"위험성평가";startDate:string;endDate?:string}
const events:Event[]=[{id:1,title:"TBM",startDate:"2025-08-01"},{id:2,title:"안전교육",startDate:"2025-08-02"},{id:3,title:"점검",startDate:"2025-08-03"},{id:4,title:"위험성평가",startDate:"2025-08-04"},{id:5,title:"TBM",startDate:"2025-08-05"},{id:6,title:"점검",startDate:"2025-08-06"},{id:7,title:"안전교육",startDate:"2025-08-07"},{id:8,title:"위험성평가",startDate:"2025-08-08"},{id:9,title:"TBM",startDate:"2025-08-10"},{id:10,title:"점검",startDate:"2025-08-12"},{id:11,title:"위험성평가",startDate:"2025-08-13"},{id:12,title:"안전교육",startDate:"2025-08-14"},{id:13,title:"TBM",startDate:"2025-08-16"},{id:14,title:"점검",startDate:"2025-08-18"},{id:15,title:"위험성평가",startDate:"2025-08-20"},{id:16,title:"안전교육",startDate:"2025-08-21"},{id:17,title:"TBM",startDate:"2025-08-22"},{id:18,title:"점검",startDate:"2025-08-24"},{id:19,title:"위험성평가",startDate:"2025-08-26"},{id:20,title:"안전교육",startDate:"2025-08-28"},{id:21,title:"TBM",startDate:"2025-09-01"},{id:22,title:"점검",startDate:"2025-09-02"},{id:23,title:"위험성평가",startDate:"2025-09-03"},{id:24,title:"안전교육",startDate:"2025-09-04"},{id:25,title:"TBM",startDate:"2025-09-05"},{id:26,title:"점검",startDate:"2025-09-06"},{id:27,title:"위험성평가",startDate:"2025-09-07"},{id:28,title:"안전교육",startDate:"2025-09-08"},{id:29,title:"TBM",startDate:"2025-09-09"},{id:30,title:"점검",startDate:"2025-09-10"},{id:31,title:"위험성평가",startDate:"2025-09-11"},{id:32,title:"안전교육",startDate:"2025-09-12"},{id:33,title:"TBM",startDate:"2025-09-13"},{id:34,title:"점검",startDate:"2025-09-15"},{id:35,title:"위험성평가",startDate:"2025-09-17"},{id:36,title:"안전교육",startDate:"2025-09-19"},{id:37,title:"TBM",startDate:"2025-09-21"},{id:38,title:"점검",startDate:"2025-09-23"},{id:39,title:"위험성평가",startDate:"2025-09-25"},{id:40,title:"안전교육",startDate:"2025-09-27"}]

const weekDays=["일","월","화","수","목","금","토"]
const kinds=["TBM","안전교육","위험성평가","점검"]

const DashboardCalendar:React.FC=()=>{
const[currentDate,setCurrentDate]=useState(new Date())
const[selectedDate,setSelectedDate]=useState<Date>(new Date())
const[openFilter,setOpenFilter]=useState(false)
const[activeKinds,setActiveKinds]=useState<string[]>([])
const[draftKinds,setDraftKinds]=useState<string[]>([])
const popRef=useRef<HTMLDivElement|null>(null)

useEffect(()=>{const onDown=(e:MouseEvent)=>{if(popRef.current&&!popRef.current.contains(e.target as Node))setOpenFilter(false)};document.addEventListener("mousedown",onDown);return()=>document.removeEventListener("mousedown",onDown)},[])
useEffect(()=>{if(openFilter)setDraftKinds(activeKinds)},[openFilter,activeKinds])

const dateKey=(d:Date)=>d.toISOString().slice(0,10)
const getStartDate=(date:Date)=>{const first=new Date(date.getFullYear(),date.getMonth(),1);const start=new Date(first);start.setDate(first.getDate()-first.getDay());return start}
const getCalendarDays=()=>{const start=getStartDate(currentDate);return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d})}
const titleKind=(t:string)=>kinds.find(k=>t.includes(k))||"기타"
const filtered=events.filter(e=>((activeKinds.length===0)||activeKinds.includes(titleKind(e.title))))
const getEventsForDate=(date:Date)=>filtered.filter(e=>e.startDate===dateKey(date))
const isToday=(date:Date)=>{const t=new Date();return date.getFullYear()===t.getFullYear()&&date.getMonth()===t.getMonth()&&date.getDate()===t.getDate()}
const isCurrentMonth=(date:Date)=>date.getMonth()===currentDate.getMonth()
const prevMonth=()=>setCurrentDate(new Date(currentDate.getFullYear(),currentDate.getMonth()-1,1))
const nextMonth=()=>setCurrentDate(new Date(currentDate.getFullYear(),currentDate.getMonth()+1,1))
const goToday=()=>{const t=new Date();setCurrentDate(new Date(t.getFullYear(),t.getMonth(),1));setSelectedDate(t)}
const selectedEvents=getEventsForDate(selectedDate)

const badgeStyleFor = (title: string, dimmed: boolean) => {
let bg = "bg-gray-200", text = "text-[#333]"
if (title.includes("TBM")) {
bg = "bg-[#EAF3FF]"; text = "text-[#1C56D3]"
} else if (title.includes("안전교육")) {
bg = "bg-[#EEF5F5]"; text = "text-[#3C5C5A]"
} else if (title.includes("점검")) {
bg = "bg-[#E8EEFB]"; text = "text-[#1E3C6B]"
} else if (title.includes("위험성평가")) {
bg = "bg-[#FEEDE9]"; text = "text-[#FF3300]"
}
return `inline-block ${bg} ${text} text-[9px] px-[4px] py-[1px] rounded font-medium w-fit ${dimmed ? "text-gray-400 bg-gray-100" : ""}`
}  

const describeEvent = (e: Event) => {
const tbm: Record<string, string> = {
"2025-08-01": "기계장비 안전사용 TBM",
"2025-08-05": "전기작업 감전 예방 TBM",
"2025-08-10": "고소작업대 TBM",
"2025-08-16": "추락방지 TBM",
"2025-08-22": "지게차 작업 전 TBM",
"2025-09-01": "전동공구 TBM",
"2025-09-05": "야간작업 TBM",
"2025-09-09": "비계작업 TBM",
"2025-09-13": "크레인 TBM",
"2025-09-21": "개인보호구 TBM"
};

const edu: Record<string, string> = {
"2025-08-02": "신규 채용 안전교육",
"2025-08-07": "화재대피 교육",
"2025-08-14": "보호구 착용 교육",
"2025-08-21": "화학물질 취급 교육",
"2025-08-28": "정기 안전보건교육",
"2025-09-04": "정리정돈 캠페인 교육",
"2025-09-08": "밀폐공간 안전교육",
"2025-09-12": "화재예방 특별교육",
"2025-09-19": "신규 관리자 안전교육",
"2025-09-27": "감염병 예방교육"
};

const asset: Record<
string,
{ category: "위험기계/기구/설비" | "유해/위험물질"; target: string; code?: string }
> = {
"2025-08-03": { category: "위험기계/기구/설비", target: "컨베이어", code: "C-2-1000" },
"2025-08-06": { category: "유해/위험물질", target: "벤젠" },
"2025-08-12": { category: "위험기계/기구/설비", target: "프레스", code: "P-1-040" },
"2025-08-18": { category: "유해/위험물질", target: "톨루엔" },
"2025-08-24": { category: "위험기계/기구/설비", target: "호이스트", code: "H-3-220" },
"2025-09-02": { category: "유해/위험물질", target: "메탄올" },
"2025-09-06": { category: "위험기계/기구/설비", target: "지게차", code: "F-7-015" },
"2025-09-10": { category: "유해/위험물질", target: "아세톤" },
"2025-09-15": { category: "위험기계/기구/설비", target: "컨베이어", code: "C-3-220" },
"2025-09-23": { category: "유해/위험물질", target: "자일렌" }
};

const risk: Record<string, { name: string; endDate: string }> = {
"2025-08-04": { name: "이동형 크레인 작업 평가", endDate: "2025-08-12" },
"2025-08-08": { name: "밀폐공간 작업 평가", endDate: "2025-08-20" },
"2025-08-13": { name: "지게차 운행 평가", endDate: "2025-08-25" },
"2025-08-20": { name: "용접 작업 평가", endDate: "2025-08-29" },
"2025-08-26": { name: "포장공정 평가", endDate: "2025-09-03" },
"2025-09-03": { name: "혼합공정 평가", endDate: "2025-09-10" },
"2025-09-07": { name: "도장공정 평가", endDate: "2025-09-17" },
"2025-09-11": { name: "원료 이송 평가", endDate: "2025-09-22" },
"2025-09-17": { name: "포장라인 개선 평가", endDate: "2025-09-27" },
"2025-09-25": { name: "출하공정 평가", endDate: "2025-10-02" }
};

if (e.title === "TBM") return tbm[e.startDate] ?? "TBM";
if (e.title === "안전교육") return edu[e.startDate] ?? "안전교육";
if (e.title === "점검") {
const a = asset[e.startDate];
if (!a) return "자산 점검일";

const code = a.code ? `(${a.code})` : "";

return (
<span className="flex items-center gap-1">
<span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[11px] font-medium">
{a.category}
</span>
<span>
{a.target}{code} 점검일
</span>
</span>
);
}

if (e.title === "위험성평가") {
const r = risk[e.startDate];
if (!r) return "개선완료일";
return `${r.name} 개선완료일`;
}
return "일정 상세확인";
};


const dday=(iso:string)=>{const today=new Date();const base=new Date(today.getFullYear(),today.getMonth(),today.getDate());const target=new Date(iso+"T00:00:00");const diff=Math.round((target.getTime()-base.getTime())/86400000);if(diff===0)return"D-DAY";if(diff>0)return`D-${diff}`;return`D+${Math.abs(diff)}`}

return(<section className="w-full rounded-[16px] border border-[#E0E6EA] bg-white shadow-sm p-4 flex flex-col">
<div className="flex flex-col">
<div className="mb-2 px-1 relative z-40 flex items-center justify-start flex-nowrap">
<div className="flex items-center gap-2">
<button onClick={goToday} className="text-xs px-2.5 h-7 rounded-md border border-[#C9D6EE] text-[#1E3C6B] bg-[#F3F6FB] hover:bg-[#E8EEFB]">오늘</button>
<button onClick={prevMonth} className="w-7 h-7 rounded-md border flex items-center justify-center text-gray-600 hover:bg-gray-100"><ChevronLeft size={16}/></button>
<button onClick={nextMonth} className="w-7 h-7 rounded-md border flex items-center justify-center text-gray-600 hover:bg-gray-100"><ChevronRight size={16}/></button>
</div>
<span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-[#161616]">{currentDate.getFullYear()}년 {currentDate.getMonth()+1}월</span>
<div className="absolute right-1 top-1/2 -translate-y-1/2 z-50">
<button onClick={()=>setOpenFilter(v=>!v)} className="w-9 h-8 md:w-8 md:h-7 flex items-center justify-center rounded-md border border-[#E0E0E0]"><Filter size={12} className="text-gray-600"/></button>
{openFilter&&(<div ref={popRef} className="absolute right-0 top-9 z-50 w-[190px] rounded-xl border border-[#E5E7EB] bg-white shadow-2xl p-2">
<div className="flex items-center justify-between px-1 pb-1"><span className="text-[11px] font-medium text-gray-800">검색조건</span><button onClick={()=>setOpenFilter(false)} className="w-6 h-6 grid place-items-center rounded hover:bg-gray-100"><X size={14}/></button></div>
<div className="grid grid-cols-2 gap-1">{kinds.map(k=>{const on=draftKinds.includes(k);return(<button key={k} onClick={()=>setDraftKinds(p=>on?p.filter(x=>x!==k):[...p,k])} className={`h-8 rounded-lg border text-[12px] transition ${on?"border-[#C9D6EE] bg-[#F3F6FB] text-[#1E3C6B]":"border-[#E5E7EB] text-gray-700 hover:bg-gray-50"}`}>{k}</button>)})}</div>
<div className="flex justify-end mt-2 px-1 gap-3"><button onClick={()=>setDraftKinds(kinds)} className="text-[12px] text-gray-400 underline hover:text-gray-600">전체</button><button onClick={()=>{setActiveKinds(draftKinds);setOpenFilter(false)}} className="text-[12px] text-gray-500 hover:text-gray-700">적용</button></div>
</div>)}
</div>
</div>

<div className="relative z-0">
<div className="grid grid-cols-7 mb-1 text-center text-[11px] font-semibold text-gray-600">{weekDays.map(d=><div key={d}>{d}</div>)}</div>

<div className="grid grid-cols-7 grid-rows-6 gap-[1px] text-[11px]">
{getCalendarDays().map((date,i)=>{const evts=getEventsForDate(date);const dimmed=!isCurrentMonth(date);const today=isToday(date);const isSelected=dateKey(date)===dateKey(selectedDate);const visible=evts.slice(0,2);const extra=evts.length-visible.length;return(<div key={i} role="button" tabIndex={0} onClick={()=>setSelectedDate(new Date(date))} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setSelectedDate(new Date(date))}}} className={`border border-[#E8E8E8] ${dimmed?"bg-[#FAFAFA]":"bg-white"} p-1 overflow-hidden ${isSelected?"outline outline-1 outline-[#1E3C6B]":""}`}>
<div className={`w-fit px-[3px] font-semibold ${dimmed?"text-gray-400":"text-[#161616]"} text-[11px] ${today?"ring-1 ring-[#1C56D3] rounded":""}`}>{date.getDate()}</div>
<div className="mt-0.5 relative h-[36px] overflow-hidden">
<div className="flex flex-col gap-[2px]">{visible.map(ev=><span key={ev.id} className={badgeStyleFor(ev.title,dimmed)} onClick={e=>{e.stopPropagation();setSelectedDate(new Date(date))}}>{ev.title}</span>)}</div>
{extra>0&&(<span className="absolute bottom-0 right-0 text-[9px] px-1 rounded bg-white/70 text-gray-500">+{extra}</span>)}
</div>
</div>)})}
</div>
</div>
</div>

<div className="mt-3 rounded-[12px] border border-[#E0E6EA] p-3 h-[130px] flex flex-col">
<div className="flex items-center justify-between mb-2 shrink-0"><div className="flex items-center gap-2"><CalIcon className="w-4 h-4 text-[#1E3C6B]"/><h4 className="text-sm font-semibold text-gray-800">{selectedDate.toLocaleDateString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",weekday:"short"})}</h4></div><span className="text-xs text-gray-500">{selectedEvents.length}건</span></div>
{selectedEvents.length===0?(<div className="flex items-center gap-2 text-[12px] text-gray-500"><Info className="w-4 h-4 text-gray-400"/>선택한 날짜에 등록된 일정이 없습니다.</div>):(<ul className="space-y-1 flex-1 min-h-0 overflow-auto pr-1 max-h-[112px]">{selectedEvents.map(ev=>(<li key={ev.id} className="flex items-start justify-between rounded-md border border-[#EEF2F6] px-2 py-2 min-h-[54px]"><div className="min-w-0"><div className="flex items-center gap-2"><span className={badgeStyleFor(ev.title,false)}>{ev.title}</span><span className="text-[11px] text-gray-500">{ev.startDate}</span></div><p className="text-[12px] text-gray-700 mt-1 truncate">{describeEvent(ev)}</p></div><span className="text-[11px] px-2 py-0.5 rounded-md border border-[#E5E7EB] text-gray-700 shrink-0">{dday(ev.startDate)}</span></li>))}</ul>)}
</div>
</section>)}

export default DashboardCalendar