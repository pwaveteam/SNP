import React,{useState}from"react"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import useFilterBar from"@/hooks/useFilterBar"
import Pagination from"@/components/common/base/Pagination"
import usePagination from"@/hooks/usePagination"
import useTableActions from"@/hooks/tableActions"
import useTabNavigation from"@/hooks/useTabNavigation"
import EvaluationRegister from"./EvaluationRegister"
import{CirclePlus,Download,Printer,Trash2,Save}from"lucide-react"

const TAB_LABELS=["수급업체 관리","안전보건수준 평가","도급안전보건 회의록","안전보건 점검","안전보건 교육/훈련"]
const TAB_PATHS=["/supply-chain-management/partners","/supply-chain-management/evaluation","/supply-chain-management/committee","/supply-chain-management/siteaudit","/supply-chain-management/training"]

const columns:Column[]=[
{key:"id",label:"번호"},
{key:"company",label:"업체명"},
{key:"evaluationName",label:"평가명"},
{key:"evaluationType",label:"평가종류"},
{key:"contractPeriod",label:"평가기간"},
{key:"evaluator",label:"평가자"},
{key:"externalEvaluator",label:"외부 평가업체"},
{key:"evaluationFile",label:"평가지",type:"download"},
{key:"attachmentFile",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const initialData:DataRow[]=[
{id:3,company:"테스트 주식회사",evaluationName:"테스트 주식회사 안전보건수준 선정평가",evaluationType:"선정평가",contractPeriod:"2025-01-01 ~ 2025-12-31",evaluator:"김민수",externalEvaluator:"국가기술안전원",evaluationFile:"",attachmentFile:""},
{id:2,company:"굴착기회사",evaluationName:"굴착기회사 안전보건수준 재평가",evaluationType:"재평가",contractPeriod:"2024-07-01 ~ 2025-06-30",evaluator:"이현주",externalEvaluator:"한국산업안전협회",evaluationFile:"",attachmentFile:""},
{id:1,company:"ABC 협의체",evaluationName:"ABC 협의체 안전보건수준 신규평가",evaluationType:"신규평가",contractPeriod:"2025-04-01 ~ 2026-03-31",evaluator:"박성호",externalEvaluator:"서울안전기술(주)",evaluationFile:"",attachmentFile:""}
]

export default function Evaluation(){
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)

const[data,setData]=useState<DataRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[modalOpen,setModalOpen]=useState(false)

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()
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
onDeleteSuccess:(ids)=>setData(prev=>prev.filter(row=>!ids.includes(row.id)))
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
<Button variant="action"onClick={handleFormDownload}className="flex items-center gap-1"><Download size={16}/>평가지 양식</Button>
</div>
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handleDownload}className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action"onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handleFormDownload}className="flex items-center gap-1"><Download size={16}/>평가지 양식</Button>
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
<EvaluationRegister isOpen={modalOpen}onClose={()=>setModalOpen(false)}onSave={handleSave}/>
)}
</section>
)
}