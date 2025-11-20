import React,{useEffect,useMemo,useState}from"react"
import{useNavigate,useLocation}from"react-router-dom"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import Pagination from"@/components/common/base/Pagination"
import useTableActions from"@/hooks/tableActions"
import useTabNavigation from"@/hooks/useTabNavigation"
import{Save,Printer,Trash2}from"lucide-react"

const TAB_LABELS=["점검일정","점검결과","점검표(체크리스트)"]
const TAB_PATHS=["/inspection/plan","/inspection/results","/inspection/checklist"]
const PAGE_SIZE=30

type ResultRow=DataRow&{
template:string
workplace:string
field:string
kind:string
inspector:string
inspectedAt:string
confirmed:boolean
notes:string
}

const columns:Column[]=[
{key:"id",label:"번호"},
{key:"template",label:"점검표명"},
{key:"workplace",label:"장소"},
{key:"field",label:"점검분야"},
{key:"kind",label:"점검종류"},
{key:"inspectedAt",label:"점검일"},
{key:"inspector",label:"점검자"},
{key:"resultView",label:"점검결과",type:"resultView"}
]


const initialData:ResultRow[]=[
{id:1,template:"위험기계 장비점검표",workplace:"제2공장",field:"시설물",kind:"수시점검",inspector:"김안전",inspectedAt:"2025-08-02",confirmed:false,notes:""},
{id:2,template:"작업장 환경점검표",workplace:"제1공장",field:"자산(설비)",kind:"정기점검",inspector:"박현장",inspectedAt:"2025-07-29",confirmed:true,notes:"정상"},
{id:3,template:"이동장비 안전점검표",workplace:"제3공장",field:"시설물",kind:"수시점검",inspector:"곽현장",inspectedAt:"2025-07-20",confirmed:false,notes:""},
{id:4,template:"전기설비 열화상 점검표",workplace:"제5공장",field:"시설물",kind:"정기점검",inspector:"김현장",inspectedAt:"2025-07-18",confirmed:true,notes:"이상없음"},
{id:5,template:"화학물질 취급작업 점검표",workplace:"제1공장",field:"시설물",kind:"특별점검",inspector:"이현장",inspectedAt:"2025-06-27",confirmed:false,notes:""}
]

export default function InspectionResults(){
const navigate=useNavigate()
const location=useLocation()

const initIdx=TAB_PATHS.indexOf(location.pathname)
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)

const[data,setData]=useState<ResultRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[searchText,setSearchText]=useState("")
const[inspectionField,setInspectionField]=useState("")
const[inspectionKind,setInspectionKind]=useState("")
const[currentPage,setCurrentPage]=useState(1)


const{
handleDownload,
handlePrint,
handleDelete
}=useTableActions({
data,
checkedIds,
onDeleteSuccess:(ids)=>setData(prev=>prev.filter(row=>!ids.includes(row.id)))
})

const filteredData=data.filter(r=>{
const f=!inspectionField||r.field===inspectionField
const k=!inspectionKind||r.kind===inspectionKind
const s=!searchText||[r.template,r.workplace,r.field,r.kind,r.inspector,r.inspectedAt,String(r.id)].some(v=>v.toLowerCase().includes(searchText.toLowerCase()))
return f&&k&&s
})

const totalPages=Math.max(1,Math.ceil(filteredData.length/PAGE_SIZE))

useEffect(()=>{
setCurrentPage(p=>Math.min(Math.max(1,p),totalPages))
},[totalPages])

useEffect(()=>{
setCurrentPage(1)
},[inspectionField,inspectionKind,searchText])

const pagedData=useMemo(()=>{
const start=(currentPage-1)*PAGE_SIZE
return filteredData.slice(start,start+PAGE_SIZE)
},[filteredData,currentPage])

return(
<section className="w-full bg-white">
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
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handleDownload}className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action"onClick={handleDownload}className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable
columns={columns}
data={pagedData}
onCheckedChange={setCheckedIds}
onManageClick={row=>navigate(`/inspection/results/${row.id}`)}
/>
</div>

<div className="mt-4 flex justify-center">
<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={page=>setCurrentPage(page)}/>
</div>
</section>
)
}