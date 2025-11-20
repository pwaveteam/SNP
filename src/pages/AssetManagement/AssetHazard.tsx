import React,{useState}from"react"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import AssetHazardRegister from"./AssetHazardRegister"
import Pagination from"@/components/common/base/Pagination"
import usePagination from"@/hooks/usePagination"
import useTabNavigation from"@/hooks/useTabNavigation"
import useFilterBar from"@/hooks/useFilterBar"
import useTableActions from"@/hooks/tableActions"
import{CirclePlus,QrCode,Printer,Trash2}from"lucide-react"

const TAB_LABELS=["위험기계/기구/설비","유해/위험물질"]
const TAB_PATHS=["/asset-management/machine","/asset-management/hazard"]

const hazardColumns:Column[]=[
{key:"id",label:"번호"},
{key:"chemicalName",label:"화학물질명"},
{key:"casNo",label:"CAS No"},
{key:"exposureLimit",label:"노출기준"},
{key:"dailyUsage",label:"일일사용량"},
{key:"storageAmount",label:"저장량"},
{key:"registrationDate",label:"등록일"},
{key:"msds",label:"MSDS",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const initialHazardData:DataRow[]=[
{id:1,chemicalName:"메틸알코올",casNo:"67-56-1",exposureLimit:"200 ppm",dailyUsage:"25 L",storageAmount:"1 m³",registrationDate:"2025/06/01",msds:"",manage:""},
{id:2,chemicalName:"벤젠",casNo:"71-43-2",exposureLimit:"1 ppm",dailyUsage:"1.2 L",storageAmount:"0.7 t",registrationDate:"2025/03/30",msds:"",manage:""},
{id:3,chemicalName:"톨루엔",casNo:"108-88-3",exposureLimit:"50 ppm",dailyUsage:"10 kg",storageAmount:"700 L",registrationDate:"2025/05/20",msds:"",manage:""}
]

export default function AssetHazard(){
const[data,setData]=useState<DataRow[]>(initialHazardData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[isModalOpen,setIsModalOpen]=useState(false)

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)

const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(data,30)

const{
handleCreate,
handleDelete,
handlePrint,
handleGenerateQR,
}=useTableActions({
data,
checkedIds,
onCreate:()=>setIsModalOpen(true),
onDeleteSuccess:(ids)=>setData(prev=>prev.filter(row=>!ids.includes(row.id)))
})

const handleSave=(newItem:Partial<DataRow>)=>{
setData(prev=>[{id:prev.length+1,...newItem,msds:"",manage:""},...prev])
setIsModalOpen(false)
}

return(
<section className="asset-management-content w-full bg-white">
<PageTitle>{TAB_LABELS[currentIndex]}</PageTitle>
<TabMenu tabs={TAB_LABELS}activeIndex={currentIndex}onTabClick={handleTabClick}className="mb-6"/>

<div className="mb-3">
<FilterBar startDate={startDate}endDate={endDate}onStartDate={setStartDate}onEndDate={setEndDate}searchText={searchText}onSearchText={setSearchText}onSearch={()=>{}}/>
</div>

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handleGenerateQR}className="flex items-center gap-1"><QrCode size={16}/>QR 생성</Button>
</div>
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handleGenerateQR}className="flex items-center gap-1"><QrCode size={16}/>QR 생성</Button>
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable columns={hazardColumns}data={currentData}onCheckedChange={setCheckedIds}/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

{isModalOpen&&(<AssetHazardRegister isOpen={isModalOpen}onClose={()=>setIsModalOpen(false)}onSave={handleSave}/>)}
</section>
)
}
