import React,{useState}from"react"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import PageTitle from"@/components/common/base/PageTitle"
import TabMenu from"@/components/common/base/TabMenu"
import Pagination from"@/components/common/base/Pagination"
import useFilterBar from"@/hooks/useFilterBar"
import usePagination from"@/hooks/usePagination"
import useTableActions from"@/hooks/tableActions"
import NoticeRegister from"./ResponseManualRegister"
import{CirclePlus,ShieldAlert,Save,Printer,Trash2}from"lucide-react"

const TAB_LABELS=["대응매뉴얼 목록"]
const TAB_PATHS=["/response-manual"]

const columns:Column[]=[
{key:"id",label:"번호"},
{key:"title",label:"제목",align:"left"},
{key:"author",label:"작성자"},
{key:"date",label:"작성일"},
{key:"views",label:"조회수"},
{key:"fileAttach",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const initialData:DataRow[]=[
{id:3,title:"(산업안전) 2025년 산업안전보건법령의 요지",author:"김작성",date:"2025-05-30",views:25,fileAttach:true},
{id:2,title:"(중대재해) 중대산업재해 등 사고 대비·대응 매뉴얼(2025)",author:"김작성",date:"2025-05-30",views:234,fileAttach:true},
{id:1,title:"(산업안전) 2025년 산업안전보건법령의 요지",author:"김작성",date:"2025-05-30",views:860,fileAttach:true}
]

export default function ResponseManual(){
const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()
const[data,setData]=useState<DataRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[modalOpen,setModalOpen]=useState(false)
const userName="김작성"

const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(data,30)

const{
handleCreate,
handleDelete,
handleDownload,
handlePrint
}=useTableActions({
data,
checkedIds,
onCreate:()=>setModalOpen(true),
onDeleteSuccess:ids=>setData(prev=>prev.filter(r=>!ids.includes(r.id)))
})

const handleSave=(item:{title:string;author:string;date:string;attachment?:boolean})=>{
const newId=data.length>0?Math.max(...data.map(d=>Number(d.id)))+1:1
const newData:DataRow={id:newId,title:item.title,author:item.author,date:item.date,views:0,fileAttach:item.attachment?true:false}
setData(prev=>[newData,...prev])
setModalOpen(false)
}

return(
<section className="w-full bg-white">
<PageTitle>대응매뉴얼</PageTitle>

<TabMenu tabs={TAB_LABELS}activeIndex={0}onTabClick={()=>{}}className="mb-6"/>

<FilterBar
startDate={startDate}
endDate={endDate}
onStartDate={setStartDate}
onEndDate={setEndDate}
searchText={searchText}
onSearchText={setSearchText}
onSearch={()=>{}}
/>

<div className="mb-3 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-2">
<span className="text-sm text-gray-600 leading-none mt-2 sm:mt-0">총 {data.length}건</span>
<div className="flex gap-1 justify-end w-full sm:w-auto">
<Button variant="action"onClick={handleCreate}className="flex gap-1 items-center"><CirclePlus size={16}/>신규등록</Button>
<Button variant="warning"onClick={()=>alert("비상대응체계 가이드 다운로드")}className="flex gap-1 items-center"><ShieldAlert size={16}/>비상대응체계 가이드</Button>
<Button variant="action"onClick={handleDownload}className="flex gap-1 items-center"><Save size={16}/>다운로드</Button>
<Button variant="action"onClick={handlePrint}className="flex gap-1 items-center"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex gap-1 items-center"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable
columns={columns}
data={currentData.map(r=>({...r,onManageClick:()=>setModalOpen(true)}))}
onCheckedChange={setCheckedIds}
/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

{modalOpen&&(
<NoticeRegister
isOpen
onClose={()=>setModalOpen(false)}
onSave={handleSave}
userName={userName}
/>
)}
</section>
)
}