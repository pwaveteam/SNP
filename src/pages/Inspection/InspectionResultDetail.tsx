import React,{useMemo,useState}from"react"
import{useParams,useNavigate}from"react-router-dom"
import PageTitle from "@/components/common/base/PageTitle"
import Button from "@/components/common/base/Button"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"

type DetailItemRow=DataRow&{id:number;content:string;result:boolean;note:string}
type ResultHeader={id:number;template:string;site:string;area:string;kind:string;inspectedAt:string;inspector:string}

const BOX="h-[36px] border border-[#E5E7EB] rounded-[8px] px-3 bg-gray-50 text-sm text-[#333639] flex items-center"
const LABEL="text-sm font-medium text-[#333639] whitespace-nowrap"

const InspectionResultDetail:React.FC=()=>{
const{resultId}=useParams()
const navigate=useNavigate()

const header:ResultHeader=useMemo(()=>({
id:Number(resultId??5),
template:"전기설비 정기점검표",
site:"본사",
area:"시설물",
kind:"정기점검",
inspectedAt:"2025-06-28",
inspector:"김현장"
}),[resultId])

const[rows]=useState<DetailItemRow[]>([
{id:1,content:"분전반 외관 이상 유무 확인",result:true,note:"양호"},
{id:2,content:"누전차단기 시험버튼 작동 확인",result:false,note:"교체 필요"},
{id:3,content:"접지상태(접지선 손상/이탈) 점검",result:true,note:"정상"},
{id:4,content:"과열·변색 흔적 여부 확인",result:false,note:"점검 시 변색 발견"},
{id:5,content:"작업장 내 임시배선 정리상태 점검",result:true,note:"정리 완료"}
])

const columns:Column<DetailItemRow>[]=[
{key:"__no",label:"번호",align:"center"},
{key:"content",label:"점검세부내용"},
{key:"result",label:"점검결과",type:"checkbox"},
{key:"note",label:"조치/비고",type:"input"}
]

const tableData:DetailItemRow[]=useMemo(()=>rows.map((r,i)=>({...r,__no:i+1})),[rows])

return(
<section className="w-full bg-white">
<PageTitle>점검결과</PageTitle>

<div className="w-full px-3 py-3 mb-4 bg-[#F8F8F8] border border-[#E5E5E5] rounded-[10px]">
<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
<div className="flex items-center gap-5 min-w-0"><span className={LABEL}>장소</span><div className={`${BOX} w-full`}>{header.site}</div></div>
<div className="flex items-center gap-5 min-w-0"><span className={LABEL}>점검분야</span><div className={`${BOX} w-full`}>{header.area}</div></div>
<div className="flex items-center gap-5 min-w-0"><span className={LABEL}>점검종류</span><div className={`${BOX} w-full`}>{header.kind}</div></div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
<div className="flex items-center gap-5 min-w-0"><span className={LABEL}>점검일</span><div className={`${BOX} w-full`}>{header.inspectedAt}</div></div>
<div className="flex items-center gap-5 min-w-0"><span className={LABEL}>점검표명</span><div className={`${BOX} w-full`}>{header.template}</div></div>
<div className="flex items-center gap-5 min-w-0"><span className={LABEL}>점검자</span><div className={`${BOX} w-full`}>{header.inspector}</div></div>
</div>
</div>

<div className="mb-2 text-sm font-medium text-[#333639]">점검항목</div>
<div className="overflow-x-auto bg-white">
<style>{`
.hide-select-col table thead tr th:first-child,
.hide-select-col table tbody tr td:first-child{display:none !important;}
`}</style>
<div className="hide-select-col">
<DataTable<DetailItemRow> columns={columns} data={tableData}/>
</div>
{rows.length===0&&(<div className="py-16 text-center text-sm text-gray-500">등록된 항목이 없습니다.</div>)}
</div>

<div className="md:mt-8 flex justify-end">
<Button variant="primary" onClick={()=>navigate("/inspection/results")}>확인</Button>
</div>
</section>
)
}

export default InspectionResultDetail