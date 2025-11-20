import React from "react"
import { ClipboardCheck, Inbox, Send, ChevronRight, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ApprovalDetail,{ type ReceivedDetail, type SentDetail } from "@/components/modules/ApprovalDetail"

type ApprovalStatus="대기"|"진행"|"완료"
type ApprovalItem={id:number;title:string;counterpart:string;date:string;status:ApprovalStatus}
type ModalState={variant:"received";row:ReceivedDetail}|{variant:"sent";row:SentDetail}

const statusChip=(st:ApprovalStatus)=>({진행:"bg-[#DEFBE8] text-[#1F5F36]",대기:"bg-[#FFF8EF] text-[#EE680F]",완료:"bg-[#F3F4F6] text-[#666666]"}[st])

const ApprovalsTrayCard:React.FC=()=>{
const navigate=useNavigate()
const [tab,setTab]=React.useState<"inbox"|"sent">("inbox")
const [modal,setModal]=React.useState<ModalState|null>(null)

const inbox:ApprovalItem[]=[{id:1,title:"위험성평가 결과서 승인",counterpart:"홍길동",date:"2025-08-17",status:"완료"},{id:2,title:"특별안전점검 계획 결재",counterpart:"박철수",date:"2025-08-16",status:"대기"},{id:3,title:"신규 화학물질 등록 요청",counterpart:"최안전",date:"2025-08-15",status:"완료"},{id:4,title:"보호구 교체 예산안",counterpart:"박근로",date:"2025-08-14",status:"대기"},{id:5,title:"정기점검 결과 보고",counterpart:"이안전",date:"2025-08-13",status:"대기"},{id:6,title:"감전 위험개선 조치서",counterpart:"오근로",date:"2025-08-12",status:"완료"},{id:7,title:"작업허가서 제도 개선(안)",counterpart:"최근로",date:"2025-08-11",status:"대기"},{id:8,title:"밀폐공간 작업절차 개정",counterpart:"홍딩동",date:"2025-08-10",status:"완료"},{id:9,title:"안전보건 관리규정 개정(안)",counterpart:"홍길동",date:"2025-08-09",status:"완료"},{id:10,title:"화재감지 설비 점검 보고",counterpart:"김근로",date:"2025-08-08",status:"완료"}]
const sent:ApprovalItem[]=[{id:11,title:"법정교육 이수 보고",counterpart:"김근로",date:"2025-08-17",status:"진행"},{id:12,title:"기계가드 개선 공사 발주",counterpart:"홍길동",date:"2025-08-16",status:"대기"},{id:13,title:"비상대응 훈련 결과 보고",counterpart:"김근로",date:"2025-08-15",status:"완료"},{id:14,title:"소화설비 정비 계획",counterpart:"홍길동",date:"2025-08-14",status:"진행"},{id:15,title:"낙상방지 난간 설치 요청",counterpart:"김근로",date:"2025-08-13",status:"대기"},{id:16,title:"유해물질 보관장 개보수 승인",counterpart:"홍길동",date:"2025-08-12",status:"진행"},{id:17,title:"TBM 운영 개선안",counterpart:"홍길동",date:"2025-08-11",status:"대기"},{id:18,title:"안전보건 목표/계획 승인",counterpart:"홍길동",date:"2025-08-10",status:"완료"},{id:19,title:"보호구 지급 현황 보고",counterpart:"홍길동",date:"2025-08-09",status:"완료"},{id:20,title:"위험물 저장소 개선 계획",counterpart:"박반장",date:"2025-08-08",status:"대기"}]

const allowedByTab:Record<"inbox"|"sent",Set<ApprovalStatus>>={inbox:new Set<ApprovalStatus>(["완료","대기"]),sent:new Set<ApprovalStatus>(["진행","대기","완료"])}

const raw=tab==="inbox"?inbox:sent
const visible=raw.filter(it=>allowedByTab[tab].has(it.status))
const limit=Math.min(10,visible.length)
const goAll=()=>navigate(tab==="inbox"?"/approval-box/received":"/approval-box/sent")

const openDetail=(item:ApprovalItem)=>{if(tab==="inbox"){const row:ReceivedDetail={date:item.date,type:"결재문서",content:item.title,drafter:item.counterpart,status:item.status==="완료"?"결재완료":"결재대기"};setModal({variant:"received",row})}else{const row:SentDetail={date:item.date,document:item.title,status:item.status,progress:"-",finalApprover:item.counterpart};setModal({variant:"sent",row})}}

return(
<section className="bg-white rounded-[16px] p-3 shadow-sm border border-[#E0E6EA] flex flex-col h-[623px]">
<div className="flex items-center justify-between mb-2">
<div className="flex items-center gap-1.5"><ClipboardCheck className="w-3.5 h-3.5 text-[#1E3C6B]"/><h3 className="text-[13px] font-semibold text-gray-800">결재함</h3></div>
<button type="button" onClick={goAll} className="hidden md:inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 transition"><span>전체보기</span><ChevronRight className="w-3.5 h-3.5"/></button>
</div>
<div className="flex items-center gap-2 text-[12px]">
<button onClick={()=>setTab("inbox")} className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 border ${tab==="inbox"?"bg-[#F3F6FB] border-[#C9D6EE] text-[#1E3C6B]":"bg-white border-[#E5E7EB] text-gray-600"}`}><Inbox className="w-3.5 h-3.5"/> 받은결재함</button>
<button onClick={()=>setTab("sent")} className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 border ${tab==="sent"?"bg-[#F3F6FB] border-[#C9D6EE] text-[#1E3C6B]":"bg-white border-[#E5E7EB] text-gray-600"}`}><Send className="w-3.5 h-3.5"/> 보낸결재함</button>
</div>
<div className="mt-2 rounded-xl border border-[#EEF2F6]">
<ul className="divide-y divide-gray-100">
{visible.slice(0,limit).map(it=>(
<li key={it.id} role="button" tabIndex={0} onClick={()=>openDetail(it)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openDetail(it)}}} className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 cursor-pointer">
<div className="flex items-center gap-2 min-w-0">
<div className="min-w-0">
<div className="text-[13px] font-medium text-gray-900 truncate">{it.title}</div>
<div className="flex items-center gap-1 text-[11px] text-gray-500"><Clock className="w-3 h-3"/><span className="truncate">{it.counterpart}</span><span>·</span><span>{it.date}</span></div>
</div>
</div>
<span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusChip(it.status)}`}>{it.status}</span>
</li>
))}
</ul>
</div>
{modal&&<ApprovalDetail variant={modal.variant} row={modal.row as any} onClose={()=>setModal(null)}/>}
</section>
)
}

const DashboardApproval:React.FC=()=>(
<div className="flex flex-col"><ApprovalsTrayCard/></div>
)

export default DashboardApproval