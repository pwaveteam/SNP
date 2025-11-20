import React,{useState,useCallback}from"react"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import PageTitle from"@/components/common/base/PageTitle"
import SafetyWorkPermitRegister from"./SafetyWorkPermitRegister"
import TabMenu from"@/components/common/base/TabMenu"
import Pagination from"@/components/common/base/Pagination"
import useFilterBar from"@/hooks/useFilterBar"
import usePagination from"@/hooks/usePagination"
import useTableActions from"@/hooks/tableActions"
import{CirclePlus,Download,Printer,Trash2}from"lucide-react"

const TAB_LABELS=["안전작업허가서 목록"]
const TAB_PATHS=["/safety-work-permit"]

const columns:Column[]=[
{key:"id",label:"번호"},
{key:"workType",label:"작업유형"},
{key:"workerCount",label:"작업인원"},
{key:"hazardLevel",label:"위험수준"},
{key:"workPeriod",label:"작업기간"},
{key:"registrationDate",label:"등록일"},
{key:"approvalStatus",label:"승인상태",type:"badge"},
{key:"attachment",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const initialData:DataRow[]=[
{id:1,workType:"용접",workerCount:"3명",hazardLevel:"높음",workPeriod:"2025-06-01 ~ 2025-06-02",registrationDate:"2025-05-30",approvalStatus:{text:"미완료",color:"red"},attachment:"",manage:""},
{id:2,workType:"크레인 운전",workerCount:"2명",hazardLevel:"중간",workPeriod:"2025-06-03 ~ 2025-06-07",registrationDate:"2025-05-30",approvalStatus:{text:"완료",color:"blue"},attachment:"",manage:""},
{id:3,workType:"밀폐공간 진입",workerCount:"6명",hazardLevel:"높음",workPeriod:"2025-06-04 ~ 2025-06-05",registrationDate:"2025-05-30",approvalStatus:{text:"완료",color:"blue"},attachment:"",manage:""}
]

export default function SafetyWorkPermit(){
const[data,setData]=useState<DataRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[isModalOpen,setIsModalOpen]=useState(false)

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()
const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(data,30)

const{
handleCreate,
handleDelete,
handlePrint
}=useTableActions({
data,
checkedIds,
onCreate:()=>setIsModalOpen(true),
onDeleteSuccess:ids=>setData(prev=>prev.filter(row=>!ids.includes(row.id)))
})

const handlePermitFormDownload=useCallback(()=>alert("안전작업허가서 양식 다운로드"),[])

const handleSave=useCallback((newItem:Partial<DataRow>)=>{
setData(prev=>[
{id:prev.length+1,...newItem,manage:""},
...prev
])
setIsModalOpen(false)
},[])

return(
<section className="safety-work-permit-content w-full bg-white">
<PageTitle>안전작업허가서</PageTitle>

<TabMenu tabs={TAB_LABELS}activeIndex={0}onTabClick={()=>{}}className="mb-6"/>

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

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handlePermitFormDownload}className="flex items-center gap-1"><Download size={16}/>안전작업허가서 양식</Button>
</div>
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handlePermitFormDownload}className="flex items-center gap-1"><Download size={16}/>안전작업허가서 양식</Button>
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable columns={columns}data={currentData}onCheckedChange={setCheckedIds}/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

{isModalOpen&&(
<SafetyWorkPermitRegister
isOpen={isModalOpen}
onClose={()=>setIsModalOpen(false)}
onSave={handleSave}
/>
)}
</section>
)
}