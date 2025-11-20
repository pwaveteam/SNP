import React,{useState}from"react"
import{useNavigate}from"react-router-dom"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import Pagination from"@/components/common/base/Pagination"
import{Eye}from"lucide-react"
import useFilterBar from"@/hooks/useFilterBar"
import usePagination from"@/hooks/usePagination"
import useTableActions from"@/hooks/tableActions"
import useTabNavigation from"@/hooks/useTabNavigation"
import{CirclePlus,Printer,Trash2,Save}from"lucide-react"

const TAB_LABELS=["점검일정","점검결과","점검표(체크리스트)"]
const TAB_PATHS=["/inspection/plan","/inspection/results","/inspection/checklist"]

type PlanRow=DataRow&{
planName:string
site:string
area:string
kind:string
inspector:string
schedule:string
registrant:string
progress:"미점검"|"완료"
}

const initialData:PlanRow[]=[
{id:1,planName:"전기설비 정기점검(9월)",site:"제3공장",area:"시설물",kind:"수시점검",inspector:"김안전",schedule:"2025/09/10 ~ 2025/09/15",registrant:"관리자",progress:"미점검"},
{id:2,planName:"화기작업 사전점검",site:"제1공장",area:"시설물",kind:"수시점검",inspector:"박현장",schedule:"2025/09/01 ~ 2025/09/03",registrant:"관리자",progress:"완료"},
{id:3,planName:"보호구 일상점검(주간)",site:"제3공장",area:"자산(설비)",kind:"특별점검",inspector:"김현장",schedule:"2025/08/18 ~ 2025/08/22",registrant:"안전팀",progress:"미점검"}
]

export default function InspectionPlan(){
const navigate=useNavigate()
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)
const[data,setData]=useState<PlanRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])

const{searchText,setSearchText}=useFilterBar()
const[inspectionField,setInspectionField]=useState("")
const[inspectionKind,setInspectionKind]=useState("")

const{
currentPage,
totalPages,
currentData,
onPageChange
}=usePagination<PlanRow>(data,30)

const{
handleCreate,
handleDelete,
handleDownload,
handlePrint
}=useTableActions({
data,
checkedIds,
onCreate:()=>navigate("/inspection/plan/register"),
onDeleteSuccess:(ids)=>setData(prev=>prev.filter(row=>!ids.includes(row.id)))
})

const handleStartInspection=(id:number|string)=>{
navigate(`/inspection/plan/${id}/execute`)
}

const btnBase={background:"none",border:"none",padding:0,margin:0,cursor:"pointer",font:"inherit",lineHeight:"inherit"}

const columns:Column<PlanRow>[]=[
{key:"id",label:"번호",align:"center"},
{key:"planName",label:"점검표명"},
{key:"site",label:"장소"},
{key:"area",label:"점검분야"},
{key:"kind",label:"점검종류"},
{key:"schedule",label:"점검일정"},
{key:"inspector",label:"점검자"},
{key:"registrant",label:"등록인"},
{key:"progress",label:"점검여부",align:"center",renderCell:(row)=>(
<div className="flex justify-center">
{row.progress==="완료"?(
<button style={{...btnBase,color:"#9CA3AF",display:"inline-flex",alignItems:"center",gap:"4px",cursor:"default"}}>
<Eye size={14}/>
점검완료
</button>
):(
<button type="button" onClick={()=>handleStartInspection(row.id)} style={{...btnBase,color:"var(--tertiary)",display:"inline-flex",alignItems:"center",gap:"4px"}} onMouseEnter={e=>(e.currentTarget.style.textDecoration="underline")} onMouseLeave={e=>(e.currentTarget.style.textDecoration="none")}>
<Eye size={14}/>
점검하기
</button>
)}
</div>
)}
]

return(
<section className="inspection-plan w-full bg-white">
<PageTitle>{TAB_LABELS[currentIndex]}</PageTitle>
<TabMenu tabs={TAB_LABELS}activeIndex={currentIndex}onTabClick={handleTabClick}className="mb-6"/>

<div className="mb-3">
<FilterBar
inspectionField={inspectionField}
onInspectionFieldChange={setInspectionField}
inspectionKind={inspectionKind}
onInspectionKindChange={setInspectionKind}
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
<Button variant="action"onClick={handleDownload}className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
</div>
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handleDownload}className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable<PlanRow>columns={columns}data={currentData}onCheckedChange={setCheckedIds}/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>
</section>
)
}