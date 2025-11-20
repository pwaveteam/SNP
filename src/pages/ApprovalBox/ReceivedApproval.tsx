// src/pages/ApprovalBox/ReceivedApproval.tsx
import React,{useState}from"react"
import { useNavigate } from "react-router-dom"
import Button from"@/components/common/base/Button"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import FilterBar from"@/components/common/base/FilterBar"
import Pagination from"@/components/common/base/Pagination"
import usePagination from"@/hooks/usePagination"
import{Save,Printer,Trash2}from"lucide-react"
import ApprovalDetailModal,{type ReceivedDetail}from"@/components/modules/ApprovalDetail"

const TAB_LABELS=["받은결재함","보낸결재함"]
const TAB_PATHS=["/approval-box/received","/approval-box/sent"]

const columns:Column[]=[
{key:"id",label:"번호"},
{key:"date",label:"기안일"},
{key:"type",label:"결재유형"},
{key:"content",label:"결재내용",align:"left"},
{key:"drafter",label:"기안자"},
{key:"status",label:"상태",type:"badge"},
{key:"sign",label:"서명",type:"sign"},
{key:"detail",label:"상세보기",type:"detail"}
]

const initialData:DataRow[]=[
{id:1,date:"2025-05-30",type:"예산계획서",content:"안전보건 예산 및 인력계획 결재 요청",drafter:"박관리",status:{text:"결재완료",color:"gray"},sign:"pending"},
{id:2,date:"2025-05-19",type:"점검계획서",content:"정기 자체점검 계획 결재 요청",drafter:"박안전",status:{text:"결재대기",color:"orange"},sign:"pending"},
{id:3,date:"2025-05-11",type:"위험요인개선",content:"유해·위험요인 개선계획 결재 요청",drafter:"박근로",status:{text:"결재대기",color:"orange"},sign:"done"}
]

export default function ReceivedApproval(){
const navigate=useNavigate()
const activeIndex=TAB_PATHS.findIndex(p=>window.location.pathname.startsWith(p))===-1?0:TAB_PATHS.findIndex(p=>window.location.pathname.startsWith(p))

const[startDate,setStartDate]=useState("")
const[endDate,setEndDate]=useState("")
const[searchText,setSearchText]=useState("")
const[data,setData]=useState<DataRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[detail,setDetail]=useState<ReceivedDetail|null>(null)

const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(data,30)

const handleTabClick=(i:number)=>{navigate(TAB_PATHS[i]);setCheckedIds([])}
const handleDownload=()=>{}
const handlePrint=()=>window.print()
const handleDelete=()=>{if(!checkedIds.length)return alert("삭제할 항목을 선택하세요");if(window.confirm("정말 삭제하시겠습니까?"))setData(p=>p.filter(r=>!checkedIds.includes(r.id)))}

const handleDetailClick=(row:DataRow)=>{
setDetail({date:String(row.date),type:String(row.type),content:String(row.content),drafter:String(row.drafter),status:(row.status.text as"결재완료"|"결재대기")})
}

const handleSignClick=(row:DataRow)=>{
setData(prev=>prev.map(r=>r.id===row.id?{...r,sign:"done"}:r))
}

return(
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[activeIndex]}</PageTitle>

<TabMenu tabs={TAB_LABELS}activeIndex={activeIndex}onTabClick={handleTabClick}className="mb-6"/>

<FilterBar
startDate={startDate}
endDate={endDate}
onStartDate={setStartDate}
onEndDate={setEndDate}
searchText={searchText}
onSearchText={setSearchText}
onSearch={()=>{}}
/>

<div className="mb-3 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-2">
<span className="text-sm text-gray-600 leading-none mt-2 sm:mt-0">총 {data.length}건</span>
<div className="flex gap-1 justify-end w-full sm:w-auto">
<Button variant="action"onClick={handleDownload}className="flex gap-1 items-center"><Save size={16}/>다운로드</Button>
<Button variant="action"onClick={handlePrint}className="flex gap-1 items-center"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex gap-1 items-center"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable
columns={columns}
data={currentData}
onCheckedChange={setCheckedIds}
onDetailClick={handleDetailClick}
onSignClick={handleSignClick}
/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

{detail&&(<ApprovalDetailModal variant="received"row={detail}onClose={()=>setDetail(null)}/>)}
</section>
)
}