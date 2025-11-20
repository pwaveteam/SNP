import React,{useState}from"react"
import{useNavigate,useLocation}from"react-router-dom"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import Pagination from"@/components/common/base/Pagination"
import usePagination from"@/hooks/usePagination"
import useFilterBar from"@/hooks/useFilterBar"
import useTableActions from"@/hooks/tableActions"
import useTabNavigation from"@/hooks/useTabNavigation"
import SiteAuditRegister from"@/pages/SupplyChainManagement/SiteAuditRegister"
import {CirclePlus,Download,Printer,Trash2,Save}from"lucide-react"

const TAB_LABELS=["수급업체 관리","안전보건수준 평가","도급안전보건 회의록","안전보건 점검","안전보건 교육/훈련"]
const TAB_PATHS=["/supply-chain-management/partners","/supply-chain-management/evaluation","/supply-chain-management/committee","/supply-chain-management/siteaudit","/supply-chain-management/training"]

const columns:Column[]=[
{key:"id",label:"번호"},
{key:"inspectionDate",label:"점검일"},
{key:"inspectionType",label:"점검종류"},
{key:"inspectionName",label:"점검명(계획명)"},
{key:"inspectionResult",label:"점검결과"},
{key:"note",label:"비고"},
{key:"inspector",label:"점검자"},
{key:"sitePhotos",label:"현장사진",type:"photo"},
{key:"fileAttach",label:"점검지",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const initialData:DataRow[]=[
{id:3,inspectionDate:"2025-01-10",inspectionType:"합동점검",inspectionName:"비상구 개폐 상태 확인",inspectionResult:"이상없음",note:"-",inspector:"박점검",sitePhotos:["/images/photo11.jpg"],fileAttach:"",manage:""},
{id:2,inspectionDate:"2025-02-01",inspectionType:"일반점검",inspectionName:"이동식 사다리 고정 상태 점검",inspectionResult:"시정조치 완료",note:"나사 조임/고정 브래킷 교체 완료",inspector:"이점검",sitePhotos:[],fileAttach:"",manage:""},
{id:1,inspectionDate:"2025-03-15",inspectionType:"특별점검",inspectionName:"화학물질 보관 용기 누수 여부 확인",inspectionResult:"중대 위험요인",note:"누수 용기 즉시 교체/바닥 세척 및 방수 처리",inspector:"최안전",sitePhotos:[],fileAttach:"",manage:""}
]

export default function SiteManagement(){
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)
const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()

const[data,setData]=useState<DataRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[modalOpen,setModalOpen]=useState(false)

const{
currentPage,
totalPages,
currentData,
onPageChange
}=usePagination<DataRow>(data,30)

const{
handleCreate,
handleDelete,
handleDownload,
handlePrint,
handleFormDownload
}=useTableActions({
data,
checkedIds,
onCreate:()=>setModalOpen(true),
onDeleteSuccess:(ids)=>setData(prev=>prev.filter(r=>!ids.includes(r.id)))
})

const handleSave=(item:Partial<DataRow>)=>{
setData(prev=>[{id:prev.length+1,...item},...prev])
setModalOpen(false)
}

return(
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[currentIndex]}</PageTitle>

<TabMenu tabs={TAB_LABELS}activeIndex={currentIndex}onTabClick={handleTabClick}className="mb-6"/>

<div className="mb-3">
<FilterBar startDate={startDate}endDate={endDate}onStartDate={setStartDate}onEndDate={setEndDate}searchText={searchText}onSearchText={setSearchText}onSearch={()=>{}}/>
</div>

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>

<div className="flex flex-nowrap gap-1 w-full justify-end sm:w-auto">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handleFormDownload}className="flex items-center gap-1"><Download size={16}/>점검지 양식</Button>
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
<SiteAuditRegister isOpen={modalOpen}onClose={()=>setModalOpen(false)}onSave={handleSave}/>
)}
</section>
)
}
