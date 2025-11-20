import React, { useState, useCallback, ChangeEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Button from "@/components/common/base/Button"
import { Send, FolderOpen, Printer, Save, Plus, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import useTableActions from "@/hooks/tableActions"
import PTWListModal from "./PTWListModal"
import SignatureSelector from "../SignatureModule/SignatureSelector"
import { SignatureInfo } from "../SignatureModule/types"

type PTWTBMProps = { ptwId?: string }

interface TBMFormData {
workplace?: string
applicationDate?: string
workTypes?: string[]
requestDept?: string
workerCount?: number
workDate?: string
applicantName?: string
applicant?: string
workLocation?: string
workType?: string
otherSafety?: string
safetyChecks?: Record<string, string | boolean>
no?: string
team?: string
date?: string
rev?: string
reason?: string
tools?: string
safetyDevices?: string
workContent?: string
workName?: string
companyName?: string
time?: string
processName?: string
manager?: string
}

interface AttendeeRow {
id: number
name: string
health: string
isNew: boolean
signature?: SignatureInfo
}

interface RiskRow {
id: number
hazard: string
currentRisk: string
measure: string
checked: boolean
}

interface ProposalRow {
id: number
hazard: string
solution: string
proposer: string
}

interface NearMissRow {
id: number
content: string
prevention: string
proposer: string
}

const BORDER_COLOR = "border-[#888888]"
const HEADER_TEXT_STYLE = "text-[#595F68] text-[15px] font-medium"
const HEADER_BG_STYLE = `bg-[#f3f3f3] ${HEADER_TEXT_STYLE}`
const TEXT_TITLE = "text-[18px] font-bold text-[#333A3F]"
const TEXT_SUBTITLE = "text-[15px] text-[#333A3F]"
const TEXT_HEADER = "text-[15px] font-medium text-[#595F68]"
const TEXT_BODY = "text-[15px] text-[#333A3F]"
const TEXT_NOTICE = "text-[13px] text-[#333A3F]"
const ALIGN_CENTER = "text-center"
const ALIGN_LEFT = "text-left"
const LABEL_WIDTH = "w-[10%]"
const READONLY_BG = "bg-[#F9FAFB] text-gray-600 cursor-default"
const PLACEHOLDER_STYLE = "placeholder:text-[13px] placeholder:text-gray-500"
const WORKPLACE_NAME = "(주)에스피에스앤아이 당진 슬래그공장"
const ICON_COLOR = "text-gray-500"

const HEADER_FORM_FIELDS = [
{ label: "회사명", key: "companyName", placeholder: "회사명을 입력하세요" },
{ label: "사업장명", key: "workplace", readOnly: true, value: WORKPLACE_NAME },
{ label: "일자", key: "date", type: "date" },
{ label: "시간", key: "time", type: "time" },
{ label: "공정명", key: "processName", placeholder: "공정명을 입력하세요" },
{ label: "관리담당자", key: "manager", placeholder: "담당자를 입력하세요" },
]

const ATTENDANCE_HEADERS = ["No.", "서명", "건강상태(본인작성)", "신규채용자", "본인서명"]
const RISK_LEVELS = ["상", "중", "하"]
const SAFETY_PROPOSAL_HEADERS = ["유해·위험요인(근로자)", "개선대책", "제안자"]
const NEAR_MISS_HEADERS = ["아차사고 내용", "방지 및 개선대책", "제안자"]

const INITIAL_RISK_DATA = [
{ hazard: "작업중 설비 가동 위험", measure: "LOTOTO 실시" },
{ hazard: "조도불량에 따른 시야확보 불가", measure: "내부 조명 설치" },
{ hazard: "분진에 의한 호흡기 질환", measure: "방진마스크 착용" },
{ hazard: "중량물에 의한 근골격계 질환", measure: "2인 1조 작업" },
{ hazard: "함마드릴 사용에 의한 타박상 위험", measure: "올바른 자세로 안전하게 작업" }
]

const NOTICE_TEXTS = {
attendance: "현장 관리담당자(관리감독자)로부터 주요 위험포인트가 무엇인지 교육받았으며, 위험성평가(JSA) 내용을 숙지하고 안전작업절차(SOP)에 따라 작업 절차를 준수하며 안전하게 작업할 것을 약속합니다.",
riskEval: "○ 현장리더 또는 관리자는 작업시작 전 T.B.M을 통한 현장 위험성평가 결과를 전 직원과 공유하고 확인하여야 합니다."
}

export default function PTWTBM({ ptwId }: PTWTBMProps): React.ReactElement {
const [formData, setFormData] = useState<TBMFormData>({ workplace: WORKPLACE_NAME })
const [attendeeRows, setAttendeeRows] = useState<AttendeeRow[]>(
Array.from({ length: 10 }, (_, i) => ({
id: i + 1,
name: "",
health: "",
isNew: false,
signature: undefined
}))
)
const [riskRows, setRiskRows] = useState<RiskRow[]>(
INITIAL_RISK_DATA.map((data, i) => ({
id: i + 1,
hazard: data.hazard,
currentRisk: "",
measure: data.measure,
checked: false
}))
)
const [proposalRows, setProposalRows] = useState<ProposalRow[]>(
Array.from({ length: 3 }, (_, i) => ({
id: i + 1,
hazard: "",
solution: "",
proposer: ""
}))
)
const [nearMissRows, setNearMissRows] = useState<NearMissRow[]>(
Array.from({ length: 3 }, (_, i) => ({
id: i + 1,
content: "",
prevention: "",
proposer: ""
}))
)
const [isListModalOpen, setIsListModalOpen] = useState(false)

const updateFormData = useCallback((updates: Partial<TBMFormData>): void => {
setFormData(prev => ({ ...prev, ...updates }))
}, [])

const updateAttendeeRow = useCallback((id: number, key: keyof AttendeeRow, value: any): void => {
setAttendeeRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row))
}, [])

const addAttendeeRow = useCallback(() => {
setAttendeeRows(prev => {
if (prev.length >= 30) return prev
return [...prev, { id: Date.now(), name: "", health: "", isNew: false, signature: undefined }]
})
}, [])

const removeAttendeeRow = useCallback((id: number) => {
setAttendeeRows(prev => prev.filter(row => row.id !== id))
}, [])

const updateSafetyCheck = useCallback((key: string, value: string | boolean): void => {
setFormData(prev => ({
...prev,
safetyChecks: { ...(prev.safetyChecks || {}), [key]: value }
}))
}, [])

const updateRiskRow = useCallback((id: number, key: keyof RiskRow, value: any): void => {
setRiskRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row))
}, [])

const addRiskRow = useCallback(() => {
setRiskRows(prev => {
if (prev.length >= 10) return prev
return [...prev, { id: Date.now(), hazard: "", currentRisk: "", measure: "", checked: false }]
})
}, [])

const removeRiskRow = useCallback((id: number) => {
setRiskRows(prev => prev.filter(row => row.id !== id))
}, [])

const updateProposalRow = useCallback((id: number, key: keyof ProposalRow, value: string): void => {
setProposalRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row))
}, [])

const addProposalRow = useCallback(() => {
setProposalRows(prev => {
if (prev.length >= 10) return prev
return [...prev, { id: Date.now(), hazard: "", solution: "", proposer: "" }]
})
}, [])

const removeProposalRow = useCallback((id: number) => {
setProposalRows(prev => prev.filter(row => row.id !== id))
}, [])

const updateNearMissRow = useCallback((id: number, key: keyof NearMissRow, value: string): void => {
setNearMissRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row))
}, [])

const addNearMissRow = useCallback(() => {
setNearMissRows(prev => {
if (prev.length >= 10) return prev
return [...prev, { id: Date.now(), content: "", prevention: "", proposer: "" }]
})
}, [])

const removeNearMissRow = useCallback((id: number) => {
setNearMissRows(prev => prev.filter(row => row.id !== id))
}, [])

const handleSelectPTW = (selectedPTW: any) => {
setFormData(selectedPTW)
setIsListModalOpen(false)
}

const {
handleSubmit,
handleSave,
handlePrint,
handleLoad
} = useTableActions({
data: [],
checkedIds: [],
onSubmit: () => {},
onSave: () => {},
onLoad: () => setIsListModalOpen(true)
})

const handleCancel = () => {
if (window.confirm("목록으로 이동하시겠습니까?\n저장하지 않은 내용은 사라집니다."))
window.location.href = "/ptw/list"
}

return (
<>
<div className="w-full">
<CardContent className="p-0 flex justify-start">
<ScrollArea className="w-full">
<div className="w-[900px] min-w-[900px] bg-white print:shadow-none">

<div className="flex justify-between mb-3 no-print">
<Button variant="action" onClick={handleCancel}>목록으로</Button>
<div className="flex flex-nowrap gap-1">
<Button variant="action" onClick={handleSubmit} className="flex items-center gap-1">
<Send size={16}/>전송
</Button>
<Button variant="action" onClick={handleLoad} className="flex items-center gap-1">
<FolderOpen size={16}/>문서 불러오기
</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1">
<Printer size={16}/>인쇄/미리보기
</Button>
<Button variant="action" onClick={handleSave} className="flex items-center gap-1">
<Save size={16}/>저장
</Button>
</div>
</div>

<table className={`w-full border-collapse border ${BORDER_COLOR}`}>
<tbody>
<tr>
<td colSpan={4} className={`border ${BORDER_COLOR} ${ALIGN_CENTER} py-3 leading-relaxed`}>
<p className={TEXT_TITLE}>T.B.M 안전일지</p>
<p className={`${TEXT_SUBTITLE} mt-1`}>(현장 위험성평가/작업계획서 내용 및 안전대책 공유 확인)</p>
</td>
</tr>

{HEADER_FORM_FIELDS.map((field, idx) => {
if (idx % 2 === 0) {
const nextField = HEADER_FORM_FIELDS[idx + 1]
return (
<tr key={idx}>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-2 ${LABEL_WIDTH}`}>
{field.label}
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[40%]`}>
<Input type={field.type || "text"} value={field.readOnly ? field.value : (formData[field.key as keyof TBMFormData] as string || "")} onChange={e => updateFormData({ [field.key]: e.target.value })} className={`w-full ${TEXT_BODY} ${PLACEHOLDER_STYLE} ${field.readOnly ? READONLY_BG : ""}`} placeholder={field.placeholder} readOnly={field.readOnly}/>
</td>
{nextField && (
<>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-2 ${LABEL_WIDTH}`}>
{nextField.label}
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[40%]`}>
<Input type={nextField.type || "text"} value={nextField.readOnly ? nextField.value : (formData[nextField.key as keyof TBMFormData] as string || "")} onChange={e => updateFormData({ [nextField.key]: e.target.value })} className={`w-full ${TEXT_BODY} ${PLACEHOLDER_STYLE} ${nextField.readOnly ? READONLY_BG : ""}`} placeholder={nextField.placeholder} readOnly={nextField.readOnly}/>
</td>
</>
)}
</tr>
)
}
return null
}).filter(Boolean)}
</tbody>
</table>

<table className={`w-full border-collapse border mt-4 ${BORDER_COLOR}`}>
<thead>
<tr>
<th colSpan={5} className={`border ${BORDER_COLOR} ${ALIGN_CENTER} py-1 ${HEADER_BG_STYLE}`}>
참석자 서명
</th>
</tr>
<tr>
{ATTENDANCE_HEADERS.map((title, i) => (
<th key={i} className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-2`}>
{title}
</th>
))}
</tr>
</thead>
<tbody>
{attendeeRows.map((attendee, i) => (
<tr key={attendee.id} className="h-[60px]">
<td className={`border ${BORDER_COLOR} ${ALIGN_CENTER} align-middle w-[6%] ${TEXT_BODY}`}>
<div className="flex items-center justify-center gap-1">
{attendeeRows.length > 1 && (
<button onClick={() => removeAttendeeRow(attendee.id)} className="text-xs no-print">
<X size={14} className={ICON_COLOR}/>
</button>
)}
{i + 1}
</div>
</td>
<td className={`border ${BORDER_COLOR} p-1 w-[20%] align-middle`}>
<Input value={attendee.name} onChange={e => updateAttendeeRow(attendee.id, "name", e.target.value)} className={`w-full h-7 ${TEXT_BODY} ${PLACEHOLDER_STYLE} ${ALIGN_CENTER}`} placeholder="이름"/>
</td>
<td className={`border ${BORDER_COLOR} p-1 w-[25%] align-middle`}>
<Input value={attendee.health} onChange={e => updateAttendeeRow(attendee.id, "health", e.target.value)} className={`w-full h-7 ${TEXT_BODY} ${PLACEHOLDER_STYLE} ${ALIGN_CENTER}`} placeholder="예: 양호, 피로 등"/>
</td>
<td className={`border ${BORDER_COLOR} ${ALIGN_CENTER} p-1 w-[15%] align-middle`}>
<div className="flex items-center justify-center">
<Checkbox checked={attendee.isNew} onCheckedChange={v => updateAttendeeRow(attendee.id, "isNew", Boolean(v))}/>
</div>
</td>
<td className={`border ${BORDER_COLOR} ${ALIGN_CENTER} align-middle w-[34%]`}>
<div className="flex items-center justify-center h-full">
<SignatureSelector value={attendee.signature} onChange={(person) => updateAttendeeRow(attendee.id, "signature", person)}/>
</div>
</td>
</tr>
))}
<tr>
<td colSpan={5} className={`border ${BORDER_COLOR} p-2 text-center`}>
<button onClick={addAttendeeRow} disabled={attendeeRows.length >= 30} className={`text-xs no-print flex items-center gap-1 mx-auto ${attendeeRows.length >= 30 ? 'opacity-50 cursor-not-allowed' : ''}`}>
<Plus size={14} className={ICON_COLOR}/>추가
</button>
</td>
</tr>
<tr>
<td colSpan={5} className={`border ${BORDER_COLOR} ${ALIGN_CENTER} p-3 leading-relaxed ${TEXT_NOTICE}`}>
{NOTICE_TEXTS.attendance}
</td>
</tr>
</tbody>
</table>

<table className={`w-full border-collapse border mt-3 ${BORDER_COLOR}`}>
<thead>
<tr>
<th colSpan={5} className={`border ${BORDER_COLOR} ${ALIGN_CENTER} py-2 ${TEXT_HEADER} ${HEADER_BG_STYLE}`}>
작업 전 위험성 평가 공유
</th>
</tr>
<tr>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-2 w-[35%]`}>
위험요인
</th>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-0 w-[15%]`} colSpan={3}>
<div className="flex flex-col w-full">
<div className={`border-b ${BORDER_COLOR} py-1`}>위험성</div>
<div className={`flex divide-x divide-[#888888]`}>
{RISK_LEVELS.map((level, i) => (
<div key={i} className="flex-1 py-1">{level}</div>
))}
</div>
</div>
</th>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-2 w-[35%]`}>
방호대책
</th>
</tr>
</thead>
<tbody>
{riskRows.map(row => (
<tr key={row.id} className="align-top">
<td className={`border ${BORDER_COLOR} p-2 w-[35%]`}>
<div className="flex items-start gap-1">
{riskRows.length > 1 && (
<button onClick={() => removeRiskRow(row.id)} className="text-xs no-print mt-3">
<X size={14} className={ICON_COLOR}/>
</button>
)}
<Textarea value={row.hazard} onChange={e => updateRiskRow(row.id, "hazard", e.target.value)} className={`flex-1 min-h-[48px] ${TEXT_BODY} resize-none`}/>
</div>
</td>
{RISK_LEVELS.map(level => (
<td key={level} className={`border ${BORDER_COLOR} w-[5%] align-middle ${ALIGN_CENTER}`}>
<div className="flex items-center justify-center h-full w-full">
<Checkbox checked={row.currentRisk === level} onCheckedChange={v => updateRiskRow(row.id, "currentRisk", v ? level : "")}/>
</div>
</td>
))}
<td className={`border ${BORDER_COLOR} p-2 w-[35%]`}>
<Textarea value={row.measure} onChange={e => updateRiskRow(row.id, "measure", e.target.value)} className={`w-full min-h-[48px] ${TEXT_BODY} resize-none`}/>
</td>
</tr>
))}
<tr>
<td colSpan={5} className={`border ${BORDER_COLOR} p-2 text-center`}>
<button onClick={addRiskRow} disabled={riskRows.length >= 10} className={`text-xs no-print flex items-center gap-1 mx-auto ${riskRows.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
<Plus size={14} className={ICON_COLOR}/>추가
</button>
</td>
</tr>
<tr>
<td colSpan={5} className={`border ${BORDER_COLOR} ${ALIGN_LEFT} px-4 py-2 ${TEXT_NOTICE}`}>
{NOTICE_TEXTS.riskEval}
</td>
</tr>
</tbody>
</table>

<table className={`w-full border-collapse border mt-3 ${BORDER_COLOR}`}>
<thead>
<tr>
<th colSpan={3} className={`border ${BORDER_COLOR} ${ALIGN_CENTER} py-2 ${TEXT_HEADER} ${HEADER_BG_STYLE}`}>
안전제안 내용
</th>
</tr>
<tr>
{SAFETY_PROPOSAL_HEADERS.map((title, i) => (
<th key={i} className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-2`}>
{title}
</th>
))}
</tr>
</thead>
<tbody>
{proposalRows.map(row => (
<tr key={row.id}>
<td className={`border ${BORDER_COLOR} p-2 w-[40%]`}>
<div className="flex items-start gap-1">
{proposalRows.length > 1 && (
<button onClick={() => removeProposalRow(row.id)} className="text-xs no-print mt-3">
<X size={14} className={ICON_COLOR}/>
</button>
)}
<Textarea value={row.hazard} onChange={e => updateProposalRow(row.id, "hazard", e.target.value)} className={`flex-1 min-h-[48px] ${TEXT_BODY} ${PLACEHOLDER_STYLE} resize-none`} placeholder="유해·위험요인 입력"/>
</div>
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[40%]`}>
<Textarea value={row.solution} onChange={e => updateProposalRow(row.id, "solution", e.target.value)} className={`w-full min-h-[48px] ${TEXT_BODY} ${PLACEHOLDER_STYLE} resize-none`} placeholder="개선대책 입력"/>
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[20%]`}>
<Input value={row.proposer} onChange={e => updateProposalRow(row.id, "proposer", e.target.value)} className={`w-full ${TEXT_BODY} ${PLACEHOLDER_STYLE}`} placeholder="제안자"/>
</td>
</tr>
))}
<tr>
<td colSpan={3} className={`border ${BORDER_COLOR} p-2 text-center`}>
<button onClick={addProposalRow} disabled={proposalRows.length >= 10} className={`text-xs no-print flex items-center gap-1 mx-auto ${proposalRows.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
<Plus size={14} className={ICON_COLOR}/>추가
</button>
</td>
</tr>
<tr>
<th colSpan={3} className={`border ${BORDER_COLOR} ${ALIGN_CENTER} py-2 ${TEXT_HEADER} ${HEADER_BG_STYLE}`}>
아차사고 신고 내용
</th>
</tr>
<tr>
{NEAR_MISS_HEADERS.map((title, i) => (
<th key={i} className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-2`}>
{title}
</th>
))}
</tr>
{nearMissRows.map(row => (
<tr key={row.id}>
<td className={`border ${BORDER_COLOR} p-2 w-[40%]`}>
<div className="flex items-start gap-1">
{nearMissRows.length > 1 && (
<button onClick={() => removeNearMissRow(row.id)} className="text-xs no-print mt-3">
<X size={14} className={ICON_COLOR}/>
</button>
)}
<Textarea value={row.content} onChange={e => updateNearMissRow(row.id, "content", e.target.value)} className={`flex-1 min-h-[48px] ${TEXT_BODY} ${PLACEHOLDER_STYLE} resize-none`} placeholder="아차사고 내용 입력"/>
</div>
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[40%]`}>
<Textarea value={row.prevention} onChange={e => updateNearMissRow(row.id, "prevention", e.target.value)} className={`w-full min-h-[48px] ${TEXT_BODY} ${PLACEHOLDER_STYLE} resize-none`} placeholder="방지 및 개선대책 입력"/>
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[20%]`}>
<Input value={row.proposer} onChange={e => updateNearMissRow(row.id, "proposer", e.target.value)} className={`w-full ${TEXT_BODY} ${PLACEHOLDER_STYLE}`} placeholder="제안자"/>
</td>
</tr>
))}
<tr>
<td colSpan={3} className={`border ${BORDER_COLOR} p-2 text-center`}>
<button onClick={addNearMissRow} disabled={nearMissRows.length >= 10} className={`text-xs no-print flex items-center gap-1 mx-auto ${nearMissRows.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
<Plus size={14} className={ICON_COLOR}/>추가
</button>
</td>
</tr>
</tbody>
</table>

</div>
</ScrollArea>
</CardContent>
</div>

<PTWListModal 
isOpen={isListModalOpen} 
onClose={() => setIsListModalOpen(false)} 
onSelect={handleSelectPTW}
documentType="TBM"
/>
</>
)
}