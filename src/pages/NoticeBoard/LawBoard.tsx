import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import FilterBar from"@/components/common/base/FilterBar"
import Pagination from"@/components/common/base/Pagination"
import useFilterBar from"@/hooks/useFilterBar"
import usePagination from"@/hooks/usePagination"
import useTabNavigation from"@/hooks/useTabNavigation"
import useTableActions from"@/hooks/tableActions"
import{Save,Printer,Trash2}from"lucide-react"

const TAB_LABELS=["공지사항","자료실","중대재해처벌법"]
const TAB_PATHS=["/notice-board/notice","/notice-board/resources","/notice-board/law"]

const columns:Column[]=[
{key:"id",label:"번호"},
{key:"title",label:"제목"},
{key:"organization",label:"소관기관"},
{key:"date",label:"발표일"},
{key:"fileAttach",label:"첨부파일",type:"download"}
]

const initialData:DataRow[]=[
{id:103,title:"『중대재해 처벌 등에 관한 법률 시행령』 일부개정령안 행정예고",organization:"고용노동부",date:"2025-06-28",fileAttach:false},
{id:102,title:"『중대재해 처벌법』 개정법률 공포 (2025.06.21 시행)",organization:"안전보건공단",date:"2025-06-21",fileAttach:true},
{id:101,title:"중대산업재해 발생 시 보고 및 조치 매뉴얼(제5차 개정판)",organization:"안전보건공단",date:"2025-06-19",fileAttach:false}
]

export default function LawBoard(){
const navigate=useNavigate()
const location=useLocation()

const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)
const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()

const[data,setData]=useState<DataRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])

const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(data,30)

const{handleDelete,handleDownload,handlePrint}=useTableActions({
data,
checkedIds,
onDeleteSuccess:ids=>setData(prev=>prev.filter(r=>!ids.includes(r.id)))
})

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
<Button variant="action"onClick={handleDownload}className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable columns={columns}data={currentData}onCheckedChange={setCheckedIds}/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>
</section>
)
}