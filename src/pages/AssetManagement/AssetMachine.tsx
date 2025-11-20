import React,{useState}from"react"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import AssetMachineRegister from"./AssetMachineRegister"
import Pagination from"@/components/common/base/Pagination"
import useTableActions from"@/hooks/tableActions"
import usePagination from"@/hooks/usePagination"
import useTabNavigation from"@/hooks/useTabNavigation"
import useFilterBar from"@/hooks/useFilterBar"
import{CirclePlus,QrCode,Printer,Trash2,Download,Save}from"lucide-react"

const TAB_LABELS=["위험기계/기구/설비","유해/위험물질"]
const TAB_PATHS=["/asset-management/machine","/asset-management/hazard"]

const machineColumns:Column[]=[
{key:"id",label:"번호"},
{key:"name",label:"기계/기구/설비명"},
{key:"capacity",label:"용량/단위"},
{key:"quantity",label:"수량"},
{key:"location",label:"설치/작업장소"},
{key:"inspectionDate",label:"점검일"},
{key:"purpose",label:"용도"},
{key:"inspectionCycle",label:"점검주기"},
{key:"attachments",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const initialMachineData:DataRow[]=[
{id:1,name:"프레스(P-1-0001)",capacity:"5ton",quantity:2,location:"A공장",inspectionCycle:"3개월",inspectionDate:"2025/06/01",purpose:"금속 판재 가공용"},
{id:2,name:"CNC밀링(M-3-2000)",capacity:"2ton",quantity:2,location:"B공장",inspectionCycle:"1년",inspectionDate:"2025/03/30",purpose:"정밀 부품 가공"},
{id:3,name:"컨베이어(C-2-1000)",capacity:"150m/min",quantity:1,location:"C공장",inspectionCycle:"6개월",inspectionDate:"2025/05/20",purpose:"제품 운반"},
{id:4,name:"리프트(L-4-0030)",capacity:"500kg",quantity:1,location:"창고1",inspectionCycle:"1년",inspectionDate:"2025/01/12",purpose:"자재 이동"},
{id:5,name:"용접기(W-2-1100)",capacity:"220V",quantity:3,location:"제작동",inspectionCycle:"3개월",inspectionDate:"2025/02/18",purpose:"금속 용접"},
{id:6,name:"지게차(F-1-7000)",capacity:"3ton",quantity:2,location:"물류창고",inspectionCycle:"6개월",inspectionDate:"2025/04/05",purpose:"제품 운반"},
{id:7,name:"집진기(D-3-9000)",capacity:"1500m³/h",quantity:1,location:"가공동",inspectionCycle:"1년",inspectionDate:"2025/03/02",purpose:"분진 제거"},
{id:8,name:"로더(LD-2-0012)",capacity:"1.5ton",quantity:1,location:"A공장",inspectionCycle:"1년",inspectionDate:"2025/02/10",purpose:"원자재 공급"},
{id:9,name:"호이스트(H-5-3300)",capacity:"2ton",quantity:2,location:"생산동",inspectionCycle:"6개월",inspectionDate:"2025/05/01",purpose:"중량물 인양"},
{id:10,name:"슬러지펌프(PM-1-0080)",capacity:"500L/min",quantity:1,location:"폐수처리장",inspectionCycle:"1년",inspectionDate:"2025/03/15",purpose:"슬러지 이동"}
]

export default function AssetManagement(){
const[machineData,setMachineData]=useState<DataRow[]>(initialMachineData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[isModalOpen,setIsModalOpen]=useState(false)

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText}=useFilterBar()
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)

const{
currentPage,
totalPages,
currentData,
onPageChange
}=usePagination<DataRow>(machineData,30)

const {
handleCreate,
handleDelete,
handleDownload,
handlePrint,
handleGenerateQR,
handleFormDownload
} = useTableActions({
data: machineData,
checkedIds,
onCreate: () => setIsModalOpen(true),
onDeleteSuccess: (ids) => setMachineData(prev => prev.filter(row => !ids.includes(row.id)))
})


const handleSave=(newItem:Partial<DataRow>)=>{
setMachineData(prev=>[{id:prev.length+1,...newItem},...prev])
setIsModalOpen(false)
}

return(
<section className="asset-management-content w-full bg-white">
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
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {machineData.length}건</span>

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action" onClick={handleCreate} className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action" onClick={handleFormDownload} className="flex items-center gap-1"><Download size={16}/>안전검사신청서 양식</Button>
<Button variant="action" onClick={handleGenerateQR} className="flex items-center gap-1"><QrCode size={16}/>QR 생성</Button>
</div>
<div className="flex gap-1 justify-end">
<Button variant="action" onClick={handleDownload} className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action" onClick={handleCreate} className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action" onClick={handleFormDownload} className="flex items-center gap-1"><Download size={16}/>안전검사신청서 양식</Button>
<Button variant="action" onClick={handleGenerateQR} className="flex items-center gap-1"><QrCode size={16}/>QR 생성</Button>
<Button variant="action" onClick={handleDownload} className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>


<div className="overflow-x-auto bg-white">
<DataTable columns={machineColumns}data={currentData}onCheckedChange={setCheckedIds}/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

{isModalOpen&&(
<AssetMachineRegister isOpen={isModalOpen}onClose={()=>setIsModalOpen(false)}onSave={handleSave}/>
)}
</section>
)
}