// src/pages/ApprovalBox/SentApproval.tsx
import React,{useState}from"react"
import { useNavigate } from "react-router-dom"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import PageTitle from"@/components/common/base/PageTitle"
import TabMenu from"@/components/common/base/TabMenu"
import Pagination from"@/components/common/base/Pagination"
import useFilterBar from"@/hooks/useFilterBar"
import usePagination from"@/hooks/usePagination"
import useTableActions from"@/hooks/tableActions"
import ApprovalDetailModal,{type SentDetail}from"@/components/modules/ApprovalDetail"
import{Save,Printer,Trash2}from"lucide-react"

const TAB_LABELS=["받은결재함","보낸결재함"]
const TAB_PATHS=["/approval-box/received","/approval-box/sent"]

const columns:Column[]=[
{key:"id",label:"번호"},
{key:"date",label:"기안일"},
{key:"document",label:"결재문서"},
{key:"status",label:"상태",type:"badge"},
{key:"progress",label:"결재진행"},
{key:"finalApprover",label:"최종결재자"},
{key:"detail",label:"상세보기",type:"detail"}
]

const initialData:DataRow[]=[
{id:1,date:"2025-05-30",document:"안전보건관리체계 구축계획서",status:{text:"결재대기",color:"green"},progress:"1/3",finalApprover:"최관리"},
{id:2,date:"2025-05-19",document:"자체점검 계획서",status:{text:"결재완료",color:"blue"},progress:"3/3",finalApprover:"이대표"},
{id:3,date:"2025-05-11",document:"안전보건 예산 및 인력확보 계획서",status:{text:"결재대기",color:"green"},progress:"0/3",finalApprover:"김관리"}
]

export default function SentApproval(){
const navigate=useNavigate()
const activeIndex=TAB_PATHS.findIndex(p=>window.location.pathname.startsWith(p))===-1?0:TAB_PATHS.findIndex(p=>window.location.pathname.startsWith(p))

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()
const[data,setData]=useState<DataRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[detail,setDetail]=useState<SentDetail|null>(null)

const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(data,30)

const{handleDelete,handlePrint,handleDownload}=useTableActions({
data,
checkedIds,
onDeleteSuccess:ids=>setData(prev=>prev.filter(r=>!ids.includes(r.id)))
})

const handleTabClick=(i:number)=>{navigate(TAB_PATHS[i]);setCheckedIds([])}

const handleDetailClick=(row:DataRow)=>{
setDetail({
date:String(row.date),
document:String(row.document),
status:String(row.status.text),
progress:String(row.progress),
finalApprover:String(row.finalApprover)
})
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
/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

{detail&&(
<ApprovalDetailModal
variant="sent"
row={detail}
onClose={()=>setDetail(null)}
/>
)}
</section>
)
}