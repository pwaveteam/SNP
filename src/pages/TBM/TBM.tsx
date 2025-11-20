import React,{useState}from"react"
import{useNavigate}from"react-router-dom"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import Pagination from"@/components/common/base/Pagination"
import usePagination from"@/hooks/usePagination"
import useTabNavigation from"@/hooks/useTabNavigation"
import useFilterBar from"@/hooks/useFilterBar"
import useTableActions from"@/hooks/tableActions"
import{CirclePlus,QrCode,Printer,Trash2,Save}from"lucide-react"

const TAB_LABELS=["TBM"]
const TAB_PATHS=["/tbm"]

const tbmColumns:Column[]=[
{key:"id",label:"번호"},
{key:"tbm",label:"TBM명"},
{key:"eduDate",label:"실시일"},
{key:"eduTime",label:"진행시간"},
{key:"targetText",label:"대상"},
{key:"participantsText",label:"참여"},
{key:"leader",label:"실시자"},
{key:"sitePhotos",label:"현장사진",type:"photo"},
{key:"attachments",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const rawData:DataRow[]=[
{id:3,tbm:"기계장비 안전사용 교육",date:"2025/06/01",start:"15:30",end:"16:30",targetCount:5,participantsCount:3,leader:"이동현",sitePhotos:["/images/photo1.jpg","/images/photo2.jpg","/images/photo3.jpg"]},
{id:2,tbm:"프레스 안전작동 교육",date:"2025/06/01",start:"10:00",end:"12:00",targetCount:9,participantsCount:7,leader:"이동현",sitePhotos:["/images/photo2.jpg"]},
{id:1,tbm:"신규직원 안전입문 교육",date:"2025/06/01",start:"13:30",end:"15:00",targetCount:8,participantsCount:6,leader:"이동현",sitePhotos:[]}
]

export default function TBMContent(){
const navigate=useNavigate()

const{
startDate,
endDate,
searchText,
setStartDate,
setEndDate,
setSearchText
}=useFilterBar()

const[selectedIds,setSelectedIds]=useState<(number|string)[]>([])
const[photoPreview,setPhotoPreview]=useState<{open:boolean;images:string[];index:number}>({open:false,images:[],index:0})

const enrich=(r:DataRow):DataRow=>{
const toMin=(t:string)=>{const[h,m]=t.split(":").map(Number);return h*60+m}
const diff=Math.max(0,toMin(String(r.end||"00:00"))-toMin(String(r.start||"00:00")))
const dh=Math.floor(diff/60),dm=diff%60
const durText=diff>0?(dh>0?`${dh}시간${dm?` ${dm}분`:""}`:`${dm}분`):"0분"
return{
...r,
eduDate:r.date,
eduTime:`${r.start} ~ ${r.end}${diff>0?` (${durText})`:""}`,
targetText:`${r.targetCount??0}명`,
participantsText:`${r.participantsCount??0}명`
}
}

const[data,setData]=useState<DataRow[]>(rawData.map(enrich))

const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)

const{
currentPage,
totalPages,
currentData,
onPageChange
}=usePagination<DataRow>(data,30)

const {
    handleCreate,
    handleDelete,
    handleDownload,
    handlePrint,
    handleGenerateQR
  } = useTableActions({
    data,
    checkedIds: selectedIds,
    onCreate: () => navigate("/tbm/register"),
    onDeleteSuccess: (ids) => setData(prev => prev.filter(r => !ids.includes(r.id)))
  })  

return(
<section className="tbm-content w-full bg-white">
<PageTitle>TBM</PageTitle>

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

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handleGenerateQR}className="flex items-center gap-1"><QrCode size={16}/>QR 생성</Button>
<Button variant="action"onClick={handleDownload}className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
</div>
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handleGenerateQR}className="flex items-center gap-1"><QrCode size={16}/>QR 생성</Button>
<Button variant="action"onClick={handleDownload}className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable
columns={tbmColumns}
data={currentData}
onCheckedChange={setSelectedIds}
onPhotoClick={(row)=>{const imgs=row.sitePhotos||[];if(imgs.length>0)setPhotoPreview({open:true,images:imgs,index:0})}}
/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

</section>
)
}