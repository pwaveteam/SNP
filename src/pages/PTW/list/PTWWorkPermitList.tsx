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
{key:"workName",label:"작업명"},
{key:"workDate",label:"작업일"},
{key:"workLocation",label:"작업장소"},
{key:"workPersonnel",label:"작업인원"},
{key:"workType",label:"작업구분"},
{key:"applicant",label:"신청자"},
{key:"applicationDate",label:"신청일자"},
{key:"signatureStatus",label:"서명",type:"badge"},
{key:"sitePhotos",label:"현장사진",type:"photo"},
{key:"fileAttach",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const initialData:DataRow[]=[
{id:1,workName:"용접 작업",workDate:"2025-11-15(토)",workLocation:"03-BE-3호, 04-BE-1/10",workPersonnel:"3명",workType:"화기",applicant:"(주)건설/김철수",applicationDate:"2025-10-29(수)",signatureStatus:{text:"5/5",color:"gray"},sitePhotos:["/images/photo1.jpg","/images/photo2.jpg"],fileAttach:true},
{id:2,workName:"고소 작업",workDate:"2025-11-16(일)",workLocation:"B동 옥상",workPersonnel:"5명",workType:"고소",applicant:"(주)설비/이영희",applicationDate:"2025-10-27(월)",signatureStatus:{text:"3/5",color:"red"},sitePhotos:["/images/photo3.jpg"],fileAttach:true},
{id:3,workName:"전기 작업",workDate:"2025-11-17(월)",workLocation:"C동 지하 전기실",workPersonnel:"2명",workType:"LOTOTO",applicant:"(주)전기/박민수",applicationDate:"2025-10-26(일)",signatureStatus:{text:"1/5",color:"red"},sitePhotos:[],fileAttach:false}
]

export default function PTWWorkPermitList(){
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
<PageTitle>위험작업허가서 목록</PageTitle>

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
