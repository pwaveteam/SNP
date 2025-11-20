import React,{useState,useCallback}from"react"
import Button from"@/components/common/base/Button"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import{Trash2,Plus,Send,FileText}from"lucide-react"
import Badge from"@/components/common/base/Badge"

interface CertificateTarget{name:string;phone:string;submitted?:boolean;submittedAt?:string}
interface Props{targets:CertificateTarget[];onAdd:(t:CertificateTarget)=>void;onRemove:(idx:number)=>void}

export default function CertificatePanel({targets,onAdd,onRemove}:Props){
const[name,setName]=useState("")
const[phone,setPhone]=useState("")
const[demoRows,setDemoRows]=useState<CertificateTarget[]>(targets.length===0?[
{name:"홍길동",phone:"010-1234-5678",submitted:true,submittedAt:"2025-01-15 14:30"},
{name:"박안전",phone:"010-2222-3333",submitted:false},
{name:"최관리",phone:"010-4444-5555",submitted:true,submittedAt:"2025-01-16 09:15"}
]:[])
const isDemo=targets.length===0

const formatPhone=(v:string)=>{
const only=v.replace(/[^0-9]/g,"")
if(only.length<=3)return only
if(only.length<=7)return`${only.slice(0,3)}-${only.slice(3)}`
return`${only.slice(0,3)}-${only.slice(3,7)}-${only.slice(7,11)}`
}

const handleAdd=useCallback(()=>{
if(!name.trim())return alert("이름을 입력해주세요")
const phoneDigits=phone.replace(/[^0-9]/g,"")
if(phoneDigits.length!==11)return alert("연락처를 정확히 입력해주세요 (11자리)")
onAdd({name,phone,submitted:false})
setName("")
setPhone("")
},[name,phone,onAdd])

const handleDelete=(idx:number)=>{
if(!window.confirm("정말 삭제하시겠습니까?")){
if(isDemo)setDemoRows(rows=>rows.filter((_,i)=>i!==idx))
else onRemove(idx)
alert("삭제되었습니다.")
}
}

const handleSendCertificate=()=>{
const currentList=isDemo?demoRows:targets
if(currentList.length===0){
alert("등록된 대상자가 없습니다")
return
}
alert(`${currentList.length}명의 대상자에게 이수증 제출 요청이 전송되었습니다`)
}

const handleViewCertificate=(target:CertificateTarget)=>{
if(target.submitted){
alert(`${target.name}의 이수증을 다운로드합니다`)
}else{
alert(`${target.name}은(는) 아직 이수증을 제출하지 않았습니다`)
}
}

const columns:Column[]=[
{key:"name",label:"이름",minWidth:70,maxWidth:100},
{key:"phone",label:"휴대폰",minWidth:110,maxWidth:140},
{key:"submitted",label:"제출여부",minWidth:80,maxWidth:90},
{key:"submittedAt",label:"제출시간",minWidth:120,maxWidth:150},
{key:"view",label:"이수증",minWidth:70,maxWidth:80},
{key:"actions",label:"삭제",minWidth:50,maxWidth:60}
]

const data:DataRow[]=(isDemo?demoRows:targets).map((t,idx)=>({
id:idx,
name:t.name,
phone:t.phone,
submitted:<Badge color={t.submitted?"blue":"red"}>{t.submitted?"완료":"미완료"}</Badge>,
submittedAt:t.submittedAt||"-",
view:(
<button
aria-label="이수증 보기"
className="p-1 rounded hover:bg-gray-100 relative z-10"
style={{pointerEvents:'auto'}}
onClick={()=>handleViewCertificate(t)}
>
<FileText className={`w-4 h-4 ${t.submitted?"text-blue-600":"text-gray-400"}`}/>
</button>
),
actions:(
<button
aria-label="삭제"
className="p-1 rounded hover:bg-gray-100 relative z-10"
style={{pointerEvents:'auto'}}
onClick={()=>handleDelete(idx)}
>
<Trash2 className="w-4 h-4 text-gray-600"/>
</button>
)
}))

const tableStyle=`
<style>
.hide-select-col table thead th:first-child, .hide-select-col table tbody td:first-child {display:none!important;}
.no-row-hover table tbody tr:hover {pointer-events:none;}
.no-row-hover table tbody tr button {pointer-events:auto;}
</style>
`

return(
<div className="flex flex-col h-full">
<div dangerouslySetInnerHTML={{__html:tableStyle}}/>
<div className="border border-[#F3F3F3] rounded-[16px] p-3">
<h3 className="text-[#333639] font-semibold text-sm md:text-base mb-4">이수증 제출 대상 등록</h3>

<div className="flex flex-col lg:flex-row gap-2 items-end mb-4">
<div className="flex-1 min-w-0">
<label className="text-sm font-medium text-[#333639] mb-1 block">이름</label>
<input
value={name}
onChange={e=>setName(e.target.value)}
placeholder="이름 입력"
maxLength={20}
className="border border-[var(--border)] rounded-[8px] px-2 h-[39px] w-full text-sm"
onKeyDown={e=>{
if(!/[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/.test(e.key)&&!["Backspace","ArrowLeft","ArrowRight","Delete","Tab"].includes(e.key))
e.preventDefault()
}}
onPaste={e=>e.preventDefault()}
/>
</div>

<div className="flex-1 min-w-0">
<label className="text-sm font-medium text-[#333639] mb-1 block">연락처</label>
<input
value={phone}
onChange={e=>setPhone(formatPhone(e.target.value))}
placeholder="010-1234-5678"
maxLength={13}
className="border border-[var(--border)] rounded-[8px] px-2 h-[39px] w-full text-sm"
inputMode="numeric"
onKeyDown={e=>{
if(!/[0-9]/.test(e.key)&&!["Backspace","ArrowLeft","ArrowRight","Delete","Tab"].includes(e.key))
e.preventDefault()
}}
/>
</div>

<Button variant="action" onClick={handleAdd} className="h-[39px] shrink-0 w-full lg:w-auto flex items-center gap-1">
<Plus size={18}/>
추가
</Button>
</div>

<div className="border-t border-[#F3F3F3] pt-3 hide-select-col no-row-hover">
<DataTable columns={columns} data={data} selectable={false}/>
{data.length===0&&(
<div className="w-full text-center text-gray-500 mt-6 text-sm select-none">
등록된 대상자가 없습니다
</div>
)}
<div className="flex justify-end mt-4">
<Button variant="action" onClick={handleSendCertificate} className="h-[39px] flex items-center gap-1">
<Send size={18}/>
이수증 제출 요청 전송
</Button>
</div>
</div>
</div>
</div>
)
}