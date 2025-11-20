import React,{useState}from"react"
import{useNavigate}from"react-router-dom"
import PageTitle from"@/components/common/base/PageTitle"
import Button from"@/components/common/base/Button"
import{Search}from"lucide-react"
import{inspectionFieldOptions,inspectionKindOptions}from"@/components/common/base/FilterBar"
import Checkbox from"@/components/common/base/Checkbox"
import ChecklistSelectDialog from"@/pages/Inspection/ChecklistSelectDialog"

const INPUT_CLASS="h-[36px] border border-[#AAAAAA] rounded-[8px] px-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#B9D0F6] text-sm font-normal text-[#333639] placeholder:text-[#AAAAAA]"
const LABEL_CLASS="text-sm font-medium text-[#333639] whitespace-nowrap"
const weekDays=["월","화","수","목","금","토","일"]

const InspectionPlanRegister:React.FC=()=>{
const navigate=useNavigate()
const[site,setSite]=useState("");const[field,setField]=useState("");const[kind,setKind]=useState("");const[startDate,setStartDate]=useState("");const[endDate,setEndDate]=useState("");const[weekChecked,setWeekChecked]=useState<string[]>([]);const[monthDays,setMonthDays]=useState<number[]>([]);const[newDay,setNewDay]=useState("");const[planName,setPlanName]=useState("");const[assignee,setAssignee]=useState("");const[assigneePhone,setAssigneePhone]=useState("010-");const[isChecklistOpen,setIsChecklistOpen]=useState(false)

const isWeeklyActive=weekChecked.length>0;const isMonthlyActive=monthDays.length>0;const weeklyDisabled=isMonthlyActive;const monthlyDisabled=isWeeklyActive

const handleAddDay=()=>{const num=parseInt(newDay,10);if(!num||num<1||num>31){alert("1~31 사이 숫자를 입력하세요.");return}if(monthDays.includes(num))return;if(isWeeklyActive)setWeekChecked([]);setMonthDays(prev=>[...prev,num].sort((a,b)=>a-b));setNewDay("")}
const removeDay=(d:number)=>setMonthDays(prev=>prev.filter(x=>x!==d))
const toggleWeek=(day:string)=>{setWeekChecked(prev=>{const next=prev.includes(day)?prev.filter(x=>x!==day):[...prev,day];if(next.length>0&&isMonthlyActive){setMonthDays([]);setNewDay("")}return next})}
const handlePhoneChange=(val:string)=>{let digits=val.replace(/\D/g,"");if(!digits.startsWith("010"))digits="010"+digits.replace(/^010/,"");if(digits.length>11)digits=digits.slice(0,11);let formatted="010-";if(digits.length>3)formatted+=digits.slice(3,7);if(digits.length>7)formatted+="-"+digits.slice(7);setAssigneePhone(formatted)}
const handleSave=()=>{if(!site.trim()){alert("장소를 입력하세요.");return}if(!field||!kind||!startDate||!endDate){alert("점검분야/점검종류/점검일정을 입력하세요.");return}if(!planName.trim()){alert("점검표명을 선택(검색)하세요.");return}if(!assignee.trim()){alert("점검자를 지정하세요.");return}if(!assigneePhone.trim()||assigneePhone.length<13){alert("점검자 전화번호를 올바르게 입력하세요.");return}console.log({site,field,kind,startDate,endDate,weekChecked,monthDays,planName,assignee,assigneePhone});alert("저장되었습니다.");navigate("/inspection/plan")}

return(<section className="w-full bg-white">
<PageTitle>점검일정 등록</PageTitle>
<div className="w-full px-3 py-3 mb-4 bg-[#F8F8F8] border border-[#E5E5E5] rounded-[10px]">

<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>장소 <span className="text-[#FF3C0B]">*</span></span><input className={`${INPUT_CLASS} w-full`} placeholder="점검 장소 입력" value={site} onChange={e=>setSite(e.target.value)}/></div>
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>점검분야 <span className="text-[#FF3C0B]">*</span></span><select className={`${INPUT_CLASS} w-full`} value={field} onChange={e=>setField(e.target.value)}>{inspectionFieldOptions.map(opt=>(<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select></div>
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>점검종류 <span className="text-[#FF3C0B]">*</span></span><select className={`${INPUT_CLASS} w-full`} value={kind} onChange={e=>setKind(e.target.value)}>{inspectionKindOptions.map(opt=>(<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select></div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
<div className="flex flex-wrap items-center gap-x-3 gap-y-2 min-w-0"><span className={LABEL_CLASS}>점검일정 <span className="text-[#FF3C0B]">*</span></span><input type="date" className={`${INPUT_CLASS} w-[130px]`} value={startDate} onChange={e=>setStartDate(e.target.value)}/><span className="text-sm font-normal text-[#333639] select-none">~</span><input type="date" className={`${INPUT_CLASS} w-[130px]`} value={endDate} onChange={e=>setEndDate(e.target.value)}/></div>
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>점검표명 <span className="text-[#FF3C0B]">*</span></span><input className={`${INPUT_CLASS} w-full`} placeholder="점검표를 검색하여 선택하세요" value={planName} readOnly/><Button variant="action" className="flex-shrink-0 !h-[36px] !px-3 !text-sm flex items-center gap-1" onClick={()=>setIsChecklistOpen(true)}><Search size={16}/>점검표 검색</Button></div>
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>점검자</span><input className={`${INPUT_CLASS} flex-grow`} placeholder="점검자명 입력" value={assignee} onChange={e=>setAssignee(e.target.value)}/><input className={`${INPUT_CLASS} flex-grow`} placeholder="전화번호 입력" value={assigneePhone} onChange={e=>handlePhoneChange(e.target.value)}/></div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
<div className="flex flex-wrap items-center gap-2"><span className={LABEL_CLASS}>주간 점검요일</span>{weekDays.map(d=>(<label key={d} className={`flex items-center gap-1 text-sm ${weeklyDisabled?"opacity-50 pointer-events-none":""}`}><Checkbox checked={weekChecked.includes(d)} onChange={()=>toggleWeek(d)} disabled={weeklyDisabled}/>{d}</label>))}</div>
<div className="flex items-center gap-3"><span className={LABEL_CLASS}>월별 점검일자</span><input type="number" min={1} max={31} className={`${INPUT_CLASS} w-[80px] ${monthlyDisabled?"opacity-50":""}`} value={newDay} onChange={e=>setNewDay(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!monthlyDisabled)handleAddDay()}} disabled={monthlyDisabled}/><button type="button" onClick={()=>!monthlyDisabled&&handleAddDay()} className={`h-[28px] px-2 rounded-md border border-gray-300 bg-white text-gray-600 text-xs font-medium ${monthlyDisabled?"opacity-50 cursor-not-allowed":""}`}>추가</button><div className="flex flex-wrap gap-1">{monthDays.map(d=>(<span key={d} onClick={()=>removeDay(d)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-300 bg-[#F5F5F5] text-gray-600 text-xs cursor-pointer">{d}일<span className="text-[10px] leading-none">✕</span></span>))}</div></div>
</div>
</div>

<div className="absolute right-4 bottom-4 md:static md:mt-8 flex justify-end"><Button variant="primary" onClick={handleSave}>저장하기</Button></div>
{isChecklistOpen&&(<ChecklistSelectDialog onClose={()=>setIsChecklistOpen(false)} onConfirm={(selected:string)=>{setPlanName(selected);setIsChecklistOpen(false)}}/>)}
</section>)}
export default InspectionPlanRegister