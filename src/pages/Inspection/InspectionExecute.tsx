import React,{useMemo,useState,useCallback}from"react"
import{useNavigate,useParams}from"react-router-dom"
import PageTitle from"@/components/common/base/PageTitle"
import Button from"@/components/common/base/Button"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"

type ExecItemRow=DataRow&{id:number;content:string;confirmed:boolean;note:string}
type PlanHeader={id:number;planName:string;site:string;area:string;kind:string;startDate:string;endDate:string;weekDays:string[];monthDays:number[];inspector:string;inspectorPhone:string;registrant:string}

const INPUT_CLASS="h-[36px] border border-[#AAAAAA] rounded-[8px] px-3 bg-gray-50 text-sm text-[#333639] flex items-center"
const LABEL_CLASS="text-sm font-medium text-[#333639] whitespace-nowrap"

const InspectionExecute:React.FC=()=>{
const{planId}=useParams();const navigate=useNavigate()
const header:PlanHeader=useMemo(()=>({id:Number(planId??3),planName:"전기설비 정기점검(9월)",site:"본사 A동",area:"시설물",kind:"특별점검",startDate:"2025-09-01",endDate:"2025-09-30",weekDays:["월","수","금"],monthDays:[],inspector:"김안전",inspectorPhone:"010-1234-1234",registrant:"박관리"}),[planId])

const[rows,setRows]=useState<ExecItemRow[]>([
{id:1,content:"분전반 외함 파손·열화·부식 여부 및 표면 이물질 부착 상태 확인",confirmed:false,note:""},
{id:2,content:"누전차단기 시험버튼 동작 확인 및 동작 후 원위치 복귀 상태 점검",confirmed:false,note:""},
{id:3,content:"접지선 체결상태(풀림/탈락/손상) 및 접지저항 측정기록 최신성 확인",confirmed:false,note:""},
{id:4,content:"전선 피복 손상·가닥 노출·비규격 접속(테이프 임시처리 등) 사용 금지 여부",confirmed:false,note:""},
{id:5,content:"분전반 내부 과열 흔적(변색/그을음) 및 냄새 유무, 발열 부위 비접촉 온도계 점검",confirmed:false,note:""},
{id:6,content:"임시배선 사용 구간 정리상태, 케이블 트레이/보호관 설치 및 통로 걸림 방지",confirmed:false,note:""},
{id:7,content:"경고표지·회로표시 부착 상태 및 최신 도면/회로표 일치 여부 확인",confirmed:false,note:""}
])

const handleToggleChange=useCallback((id:number|string,key:string,value:boolean)=>{
setRows(prev=>prev.map(r=>r.id===id?{...r,[key]:value}:r))
},[])

const handleInputChange=useCallback((id:number|string,key:string,value:string)=>{
setRows(prev=>prev.map(r=>r.id===id?{...r,[key]:value}:r))
},[])

const allDone=rows.length>0&&rows.every(r=>r.confirmed)

const columns:Column<ExecItemRow>[]=[
{key:"__no",label:"번호",align:"center"},
{key:"content",label:"점검세부내용"},
{key:"confirmed",label:"점검결과",type:"checkbox"},
{key:"note",label:"조치/비고",type:"input"}
]

const tableData:ExecItemRow[]=useMemo(()=>rows.map((r,i)=>({...r,__no:i+1})),[rows])
const handleSubmit=()=>{if(!allDone&&!window.confirm("모든 항목의 점검결과가 확인되지 않았습니다. 저장하시겠습니까?"))return;alert("저장되었습니다.");console.log("saved",{header,rows});navigate("/inspection/plan")}

const weekdayText=header.weekDays.length?header.weekDays.join(", "):"-"
const monthdayText=header.monthDays.length?`매월 ${header.monthDays.join(", ")}일`:"-"

return(<section className="w-full bg-white">
<PageTitle>점검하기</PageTitle>
<div className="w-full px-3 py-3 mb-4 bg-[#F8F8F8] border border-[#E5E5E5] rounded-[10px]">
<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>장소</span><div className={`${INPUT_CLASS} w-full`}>{header.site}</div></div>
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>점검분야</span><div className={`${INPUT_CLASS} w-full`}>{header.area}</div></div>
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>점검종류</span><div className={`${INPUT_CLASS} w-full`}>{header.kind}</div></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>점검일정</span><div className={`${INPUT_CLASS} w-full`}>{header.startDate} ~ {header.endDate}</div></div>
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>점검표명</span><div className={`${INPUT_CLASS} w-full`}>{header.planName}</div></div>
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>점검자</span><div className={`${INPUT_CLASS} w-full`}>{header.inspector}</div><div className={`${INPUT_CLASS} w-full`}>{header.inspectorPhone}</div></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>주간 점검요일</span><div className={`${INPUT_CLASS} w-full`}>{weekdayText}</div></div>
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>월별 점검일자</span><div className={`${INPUT_CLASS} w-full`}>{monthdayText}</div></div>
<div className="flex items-center gap-3 min-w-0"><span className={LABEL_CLASS}>등록인</span><div className={`${INPUT_CLASS} w-full`}>{header.registrant}</div></div>
</div>
</div>

<div className="mb-2 text-sm font-medium text-[#333639]">점검항목</div>
<div className="overflow-x-auto bg-white">
<style>{`.hide-select-col table thead tr th:first-child,.hide-select-col table tbody tr td:first-child{display:none!important}`}</style>
<div className="hide-select-col"><DataTable<ExecItemRow> columns={columns} data={tableData} onToggleChange={handleToggleChange} onInputChange={handleInputChange}/></div>
{rows.length===0&&(<div className="py-16 text-center text-sm text-gray-500">등록된 항목이 없습니다.</div>)}
</div>

<div className="absolute right-4 bottom-4 md:static md:mt-8 flex justify-end"><Button variant="primary" onClick={handleSubmit}>저장하기</Button></div>
</section>)}

export default InspectionExecute