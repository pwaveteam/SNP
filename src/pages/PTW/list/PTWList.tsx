import React,{useState}from"react"
import{useNavigate}from"react-router-dom"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import Pagination from"@/components/common/base/Pagination"
import useFilterBar from"@/hooks/useFilterBar"
import usePagination from"@/hooks/usePagination"
import useTabNavigation from"@/hooks/useTabNavigation"
import useTableActions from"@/hooks/tableActions"
import{CirclePlus,Save,Printer,Trash2}from"lucide-react"

const TAB_LABELS=["PTW 그룹","위험작업허가서 목록","작업위험분석(JSA) 목록","현장 위험성평가 목록","TBM 목록"]
const TAB_PATHS=["/ptw/list","/ptw/list/work-permit","/ptw/list/jsa","/ptw/list/site-evaluation","/ptw/list/tbm"]

type PTWRow=DataRow&{
ptwName:string
createdAt:string
registrant:string
updatedAt:string
}

const columns:Column<PTWRow>[]=[
{key:"id",label:"번호",align:"center"},
{key:"ptwName",label:"PTW 그룹명"},
{key:"createdAt",label:"등록일"},
{key:"registrant",label:"등록인"},
{key:"updatedAt",label:"최종수정일"},
{key:"manage",label:"관리",type:"manage"}
]

const initialData:PTWRow[]=[
{id:1,ptwName:"11월 용접 작업 패키지",createdAt:"2025-10-20",registrant:"김안전",updatedAt:"2025-10-25"},
{id:2,ptwName:"11월 고소작업 패키지",createdAt:"2025-10-22",registrant:"박현장",updatedAt:"2025-10-27"},
{id:3,ptwName:"11월 전기설비 패키지",createdAt:"2025-10-23",registrant:"이관리",updatedAt:"2025-10-26"}
]

export default function PTWList(){
const navigate=useNavigate()
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)
const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()

const[data,setData]=useState<PTWRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])

const{currentPage,totalPages,currentData,onPageChange}=usePagination<PTWRow>(data,30)

const{handleCreate,handleDelete,handleDownload,handlePrint}=useTableActions({
data,
checkedIds,
onCreate:()=>navigate("/ptw/register"),
onDeleteSuccess:ids=>setData(prev=>prev.filter(r=>!ids.includes(r.id)))
})

return(
<section className="w-full bg-white">
<PageTitle>PTW</PageTitle>

<TabMenu tabs={TAB_LABELS}activeIndex={currentIndex}onTabClick={handleTabClick}className="mb-6"/>

<div className="mb-3">
<FilterBar startDate={startDate}endDate={endDate}onStartDate={setStartDate}onEndDate={setEndDate}searchText={searchText}onSearchText={setSearchText}onSearch={()=>{}}/>
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
<DataTable<PTWRow>
columns={columns}
data={currentData}
onCheckedChange={setCheckedIds}
onManageClick={row=>navigate(`/ptw/manage/${row.id}`)}
/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>
</section>
)
}