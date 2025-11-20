import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import FilterBar from "@/components/common/base/FilterBar"
import Pagination from "@/components/common/base/Pagination"
import useFilterBar from "@/hooks/useFilterBar"
import usePagination from "@/hooks/usePagination"
import useTabNavigation from "@/hooks/useTabNavigation"
import useTableActions from "@/hooks/tableActions"
import ResourcesListRegister from "./ResourcesListRegister"
import { CirclePlus, Save, Printer, Trash2 } from "lucide-react"

const TAB_LABELS=["공지사항","자료실","중대재해처벌법"]
const TAB_PATHS=["/notice-board/notice","/notice-board/resources","/notice-board/law"]

const columns:Column[]=[
{key:"id",label:"번호"},
{key:"title",label:"자료명"},
{key:"author",label:"작성자"},
{key:"date",label:"등록일"},
{key:"fileAttach",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const initialData:DataRow[]=[
{id:103,title:"중대재해 예방조치 이행점검 서식",author:"이안전",date:"2025-05-30",fileAttach:true},
{id:102,title:"중대재해 예방관리계획 수립 및 자체점검 결과보고서 서식",author:"이안전",date:"2025-05-19",fileAttach:true},
{id:101,title:"도급·용역·위탁 협력업체 유해·위험요인 평가 확인서 서식",author:"박관리",date:"2025-05-11",fileAttach:true}
]

export default function ResourcesList(){
const navigate=useNavigate()
const location=useLocation()

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)

const[data,setData]=useState<DataRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[modalOpen,setModalOpen]=useState(false)

const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(data,30)

const{
handleCreate,
handleDelete,
handleDownload,
handlePrint
}=useTableActions({
data,
checkedIds,
onCreate:()=>setModalOpen(true),
onDeleteSuccess:(ids)=>setData(prev=>prev.filter(r=>!ids.includes(r.id)))
})

const handleSave=(item:{title:string;author:string;date:string;fileAttach:boolean})=>{
const newId=data.length>0?Math.max(...data.map(d=>Number(d.id)))+1:1
const newRow:DataRow={id:newId,title:item.title,author:item.author,date:item.date,fileAttach:item.fileAttach}
setData(prev=>[newRow,...prev])
setModalOpen(false)
}

return(
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[currentIndex]}</PageTitle>

<TabMenu tabs={TAB_LABELS}activeIndex={currentIndex}onTabClick={handleTabClick}className="mb-6"/>

<div className="mb-3">
<FilterBar
startDate={startDate}
endDate={endDate}
onStartDate={setStartDate}
onEndDate={setEndDate}
searchText={searchText}
onSearchText={setSearchText}
onSearch={()=>{}}
/>
</div>

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>

<div className="flex flex-nowrap gap-1 w-full justify-end sm:w-auto">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handleDownload}className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable columns={columns}data={currentData}onCheckedChange={setCheckedIds}/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

{modalOpen&&(
<ResourcesListRegister isOpen onClose={()=>setModalOpen(false)}onSave={handleSave}userName="관리자"/>
)}
</section>
)
}