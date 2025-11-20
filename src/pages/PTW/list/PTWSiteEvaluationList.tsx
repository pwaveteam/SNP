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
import{Trash2}from"lucide-react"

const TAB_LABELS=["PTW 그룹","위험작업허가서 목록","작업위험분석(JSA) 목록","현장 위험성평가 목록","TBM 목록"]
const TAB_PATHS=["/ptw/list","/ptw/list/work-permit","/ptw/list/jsa","/ptw/list/site-evaluation","/ptw/list/tbm"]

const columns:Column[]=[
{key:"id",label:"번호"},
{key:"workTeam",label:"작업팀(업체)"},
{key:"workerName",label:"성명"},
{key:"workDate",label:"작업일자"},
{key:"author",label:"작성자"},
{key:"signatureStatus",label:"서명",type:"badge"},
{key:"sitePhotos",label:"현장사진",type:"photo"},
{key:"fileAttach",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const initialData:DataRow[]=[
{id:1,workTeam:"삼성건설 A팀",workerName:"김철수",workDate:"2025-10-20",author:"이안전",signatureStatus:{text:"완료",color:"gray"},sitePhotos:["/images/photo1.jpg","/images/photo2.jpg"],fileAttach:true},
{id:2,workTeam:"현대건설 B팀",workerName:"박영희",workDate:"2025-10-22",author:"최관리",signatureStatus:{text:"미완료",color:"red"},sitePhotos:["/images/photo3.jpg"],fileAttach:true},
{id:3,workTeam:"대림산업 C팀",workerName:"정민수",workDate:"2025-10-23",author:"강현장",signatureStatus:{text:"완료",color:"gray"},sitePhotos:[],fileAttach:false}
]

export default function PTWSiteEvaluationList(){
const navigate=useNavigate()
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)
const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()

const[data,setData]=useState<DataRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])

const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(data,30)

const{handleDelete}=useTableActions({
data,checkedIds,
onDeleteSuccess:ids=>setData(prev=>prev.filter(r=>!ids.includes(r.id)))
})

return(
<section className="w-full bg-white">
<PageTitle>현장 위험성평가 목록</PageTitle>

<TabMenu tabs={TAB_LABELS}activeIndex={currentIndex}onTabClick={handleTabClick}className="mb-6"/>

<div className="mb-3">
<FilterBar startDate={startDate}endDate={endDate}onStartDate={setStartDate}onEndDate={setEndDate}searchText={searchText}onSearchText={setSearchText}onSearch={()=>{}}/>
</div>

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end sm:w-auto">
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable
columns={columns}
data={currentData.map(r=>({...r,onManageClick:()=>navigate("/ptw/manage")}))}
onCheckedChange={setCheckedIds}
/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>
</section>
)
}
