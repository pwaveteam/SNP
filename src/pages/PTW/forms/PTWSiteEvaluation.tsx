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

type PTWSiteEvaluationProps = { ptwId?: string }

interface SiteEvalFormData {
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
teamName?: string
teamMember?: SignatureInfo
}

interface RiskRow {
id: number
task: string
hazard: string
currentRisk: string
measure: string
improvedRisk: string
checked: boolean
beforeImages: string[]
afterImages: string[]
}

interface InspectionRow {
id: number
time: string
person: string
note: string
}

const BORDER_COLOR = "border-[#888888]"
const HEADER_TEXT_STYLE = "text-[#595F68] text-[15px] font-medium"
const HEADER_BG_STYLE = `bg-[#f3f3f3] ${HEADER_TEXT_STYLE}`
const TEXT_TITLE = "text-[18px] font-bold text-[#333A3F] text-center"
const TEXT_SUBTITLE = "text-[15px] text-[#333A3F] text-center"
const TEXT_HEADER = "text-[15px] font-medium text-[#595F68] text-center"
const TEXT_BODY = "text-[15px] text-[#333A3F] text-left"
const TEXT_NOTICE = "text-[13px] text-[#333A3F]"
const LABEL_WIDTH = "w-[10%]"
const READONLY_BG = "bg-[#F9FAFB] text-gray-600 cursor-default"
const PLACEHOLDER_STYLE = "placeholder:text-[13px] placeholder:text-gray-500"
const WORKPLACE_NAME = "(주)에스피에스앤아이 당진 슬래그공장"
const ICON_COLOR = "text-gray-500"

const RISK_LEVELS = ["상", "중", "하"]

const INITIAL_QUESTIONS = [
{ id: 1, question: "처음 작업에 투입되는 작업자가 있는가?", key: "first_worker" },
{ id: 2, question: "처음 취급하는 공기구나 장비가 있는가?", key: "first_equipment" }
]

const NOTICE_TEXTS = {
riskEval: "○ 현장리더 또는 관리자는 작업시작 전 T.B.M을 통한 현장 위험성평가 결과를 전 직원과 공유하고 확인하여야 합니다.",
inspection: "(작업팀, 관리감독자, 안전담당자, 관리책임자 등은 위험성에 대한 방호대책이 유지되고 있는지 확인하여야 합니다.)"
}

export default function PTWSiteEvaluation({ ptwId }: PTWSiteEvaluationProps): React.ReactElement {
const [formData, setFormData] = useState<SiteEvalFormData>({ workplace: WORKPLACE_NAME })
const [riskRows, setRiskRows] = useState<RiskRow[]>(
Array.from({ length: 8 }, (_, i) => ({
id: i + 1,
task: "",
hazard: "",
currentRisk: "",
measure: "",
improvedRisk: "",
checked: false,
beforeImages: [],
afterImages: []
}))
)
const [inspectionRows, setInspectionRows] = useState<InspectionRow[]>(
Array.from({ length: 3 }, (_, i) => ({
id: i + 1,
time: "",
person: "",
note: ""
}))
)
const [isListModalOpen, setIsListModalOpen] = useState(false)

const updateFormData = useCallback((u: Partial<SiteEvalFormData>): void => {
setFormData(p => ({ ...p, ...u }))
}, [])

const updateSafetyCheck = useCallback((k: string, v: string | boolean): void => {
setFormData(p => ({
...p,
safetyChecks: { ...(p.safetyChecks || {}), [k]: v }
}))
}, [])

const updateRiskRow = useCallback((id: number, k: keyof RiskRow, v: any): void => {
setRiskRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))
}, [])

const addRiskRow = useCallback(() => {
setRiskRows(prev => {
if (prev.length >= 15) return prev
return [...prev, {
id: Date.now(),
task: "",
hazard: "",
currentRisk: "",
measure: "",
improvedRisk: "",
checked: false,
beforeImages: [],
afterImages: []
}]
})
}, [])

const removeRiskRow = useCallback((id: number) => {
setRiskRows(prev => prev.filter(r => r.id !== id))
}, [])

const updateInspectionRow = useCallback((id: number, k: keyof InspectionRow, v: string): void => {
setInspectionRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r))
}, [])

const addInspectionRow = useCallback(() => {
setInspectionRows(prev => {
if (prev.length >= 10) return prev
return [...prev, {
id: Date.now(),
time: "",
person: "",
note: ""
}]
})
}, [])

const removeInspectionRow = useCallback((id: number) => {
setInspectionRows(prev => prev.filter(r => r.id !== id))
}, [])

const handleImageUpload = (id: number, k: "beforeImages" | "afterImages", e: ChangeEvent<HTMLInputElement>): void => {
const f = e.target.files
if (!f) return
const s = Array.from(f).filter(x => x.type.startsWith("image/")).slice(0, 5)
const urls = s.map(x => URL.createObjectURL(x))
setRiskRows(p => p.map(r => r.id === id ? { ...r, [k]: [...r[k], ...urls].slice(0, 5) } : r))
}

const getRiskColor = (l: string): string =>
l === "상" ? "bg-[#B65E5D] text-white" :
l === "중" ? "bg-[#CAB359] text-white" :
l === "하" ? "bg-[#80A16A] text-white" :
"bg-white text-gray-700"

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
<td colSpan={4} className={`border ${BORDER_COLOR} ${TEXT_TITLE} py-3`}>
현장 위험성평가(JSA)
</td>
</tr>

<tr>
<td colSpan={4} className={`border ${BORDER_COLOR} p-0`}>
<div className={`flex flex-col items-center justify-center ${TEXT_NOTICE} text-center leading-relaxed px-6 py-3`}>
<p className={`${TEXT_SUBTITLE} font-semibold mb-2`}>
상시 현장 위험성평가_내 작업장 안전분석(JSA)
</p>
<p>
<span className="underline">1) 작업허가서 작성 시 모든 작업자가 참여하여 현장 위험성평가 실시</span> 
<span className="font-medium">※</span> (작업순서별 위험요인, 작업자 행동, 주변환경 등)
<br/>
<span className="underline">2) 최초 위험성평가는 별도로 작성하거나, 작업절차서 등 안전작업표준서를 이용하여 작성 가능</span>
<br/>
<span className="underline">3) 상시 위험성평가 결과에 반영되지 않는 위험요인 발생 시 즉시 작업을 중지하고, 조치 후 작업을 재개한다</span>
</p>
</div>
</td>
</tr>

<tr>
<td colSpan={4} className={`border-x ${BORDER_COLOR} p-0`}>
<table className="w-full border-separate border-spacing-0">
<tbody>
{INITIAL_QUESTIONS.map((item, i) => (
<tr key={i}>
<td className={`${i === 0 ? "" : `border-t ${BORDER_COLOR}`} pl-3 py-[6px] ${TEXT_BODY} w-[45%]`}>
{`${item.id}. ${item.question}`}
</td>
<td className={`${i === 0 ? "" : `border-t ${BORDER_COLOR}`} text-center py-[6px] w-[25%]`}>
<div className="flex justify-center items-center gap-4">
<label className={`flex items-center gap-1 ${TEXT_BODY}`}>
네
<Checkbox checked={formData.safetyChecks?.[`${item.key}_yes`] as boolean || false} onCheckedChange={v => updateSafetyCheck(`${item.key}_yes`, Boolean(v))}/>
</label>
<label className={`flex items-center gap-1 ${TEXT_BODY}`}>
아니오
<Checkbox checked={formData.safetyChecks?.[`${item.key}_no`] as boolean || false} onCheckedChange={v => updateSafetyCheck(`${item.key}_no`, Boolean(v))}/>
</label>
</div>
</td>
<td className={`${i === 0 ? "" : `border-t ${BORDER_COLOR}`} px-2 py-[4px] w-[30%]`}>
<Input value={formData.safetyChecks?.[`${item.key}_action`] as string || ""} onChange={e => updateSafetyCheck(`${item.key}_action`, e.target.value)} className={`w-full h-[28px] ${TEXT_BODY} ${PLACEHOLDER_STYLE}`} placeholder="조치사항"/>
</td>
</tr>
))}
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

<table className={`w-full border-collapse border mt-3 ${BORDER_COLOR}`}>
<thead>
<tr>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2`}>작업순서</th>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2`}>위험요인</th>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-0`} colSpan={3}>
<div className="flex flex-col w-full">
<div className={`border-b ${BORDER_COLOR} py-1`}>위험성</div>
<div className="flex divide-x divide-[#888888]">
{RISK_LEVELS.map((l, i) => (
<div key={i} className="flex-1 py-1">{l}</div>
))}
</div>
</div>
</th>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2`}>방호대책</th>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2`}>조치확인</th>
</tr>
</thead>
<tbody>
{riskRows.map(row => (
<tr key={row.id} className="align-top">
<td className={`border ${BORDER_COLOR} p-2 w-[15%]`}>
<div className="flex items-start gap-1">
{riskRows.length > 1 && (
<button onClick={() => removeRiskRow(row.id)} className="text-xs no-print mt-3">
<X size={14} className={ICON_COLOR}/>
</button>
)}
<Textarea value={row.task} onChange={e => updateRiskRow(row.id, "task", e.target.value)} className={`flex-1 min-h-[48px] ${TEXT_BODY} resize-none`}/>
</div>
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[25%]`}>
<Textarea value={row.hazard} onChange={e => updateRiskRow(row.id, "hazard", e.target.value)} className={`w-full min-h-[48px] ${TEXT_BODY} resize-none`}/>
</td>
{RISK_LEVELS.map(level => (
<td key={level} className={`border ${BORDER_COLOR} w-[5%] align-middle text-center`}>
<div className="flex items-center justify-center h-full w-full">
<Checkbox checked={row.currentRisk === level} onCheckedChange={v => updateRiskRow(row.id, "currentRisk", v ? level : "")}/>
</div>
</td>
))}
<td className={`border ${BORDER_COLOR} p-2 w-[25%]`}>
<Textarea value={row.measure} onChange={e => updateRiskRow(row.id, "measure", e.target.value)} className={`w-full min-h-[48px] ${TEXT_BODY} resize-none`}/>
</td>
<td className={`border ${BORDER_COLOR} text-center align-middle w-[8%]`}>
<div className="flex items-center justify-center h-full">
<Checkbox checked={row.checked} onCheckedChange={v => updateRiskRow(row.id, "checked", Boolean(v))}/>
</div>
</td>
</tr>
))}

<tr>
<td colSpan={7} className={`border ${BORDER_COLOR} p-2 text-center`}>
<button onClick={addRiskRow} disabled={riskRows.length >= 15} className={`text-xs no-print flex items-center gap-1 mx-auto ${riskRows.length >= 15 ? 'opacity-50 cursor-not-allowed' : ''}`}>
<Plus size={14} className={ICON_COLOR}/>추가
</button>
</td>
</tr>

<tr>
<td colSpan={7} className={`border ${BORDER_COLOR} text-left px-4 py-2 ${TEXT_NOTICE}`}>
{NOTICE_TEXTS.riskEval}
</td>
</tr>
</tbody>
</table>

<table className={`w-full border-collapse border mt-2 ${BORDER_COLOR}`}>
<tbody>
<tr>
<td className={`border ${BORDER_COLOR} text-center ${TEXT_BODY} font-medium py-4 w-[28%] align-middle`}>
작업팀 서명란<br/>
<span className={`${TEXT_NOTICE} font-normal`}>(TBM, 작업방법 및 안전대책 공유)</span>
</td>
<td className={`border ${BORDER_COLOR} bg-white text-center ${TEXT_BODY} font-medium w-[6%] align-middle`}>
일<br/>자
</td>
<td className={`border ${BORDER_COLOR} text-center w-[16.5%] align-middle`}>
<Input type="date" value={formData.safetyChecks?.sign_date as string || ""} onChange={e => updateSafetyCheck("sign_date", e.target.value)} className={`w-full text-center ${TEXT_BODY}`}/>
</td>
<td className={`border ${BORDER_COLOR} bg-white text-center ${TEXT_BODY} font-medium w-[8%] align-middle`}>
작업팀<br/>
<span className={`${TEXT_NOTICE} font-normal`}>(업체)</span>
</td>
<td className={`border ${BORDER_COLOR} text-center w-[13%] align-middle`}>
<Input value={formData.teamName || ""} onChange={e => updateFormData({ teamName: e.target.value })} className={`w-full text-center ${TEXT_BODY} ${PLACEHOLDER_STYLE}`} placeholder="업체명"/>
</td>
<td className={`border ${BORDER_COLOR} bg-white text-center ${TEXT_BODY} font-medium w-[6%] align-middle`}>
성<br/>명
</td>
<td className={`border ${BORDER_COLOR} text-center w-[16.5%] align-middle`}>
<div className="flex items-center justify-center h-[45px]">
<SignatureSelector value={formData.teamMember} onChange={(person) => updateFormData({ teamMember: person })}/>
</div>
</td>
</tr>
<tr>
<td colSpan={7} className={`border-t-0 border ${BORDER_COLOR} text-left px-4 py-2 ${TEXT_NOTICE} leading-relaxed`}>
<span className="font-medium">일일순회점검 결과</span> 
<span className="font-normal">{NOTICE_TEXTS.inspection}</span>
</td>
</tr>
</tbody>
</table>

<table className={`w-full border-collapse border mt-2 ${BORDER_COLOR}`}>
<thead>
<tr>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 w-[15%]`}>시간</th>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 w-[20%]`}>소속 및 성명</th>
<th className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 w-[65%]`}>관찰/점검 내용</th>
</tr>
</thead>
<tbody>
{inspectionRows.map(row => (
<tr key={row.id}>
<td className={`border ${BORDER_COLOR} p-2 text-center align-middle`}>
<div className="flex items-center gap-1">
{inspectionRows.length > 1 && (
<button onClick={() => removeInspectionRow(row.id)} className="text-xs no-print">
<X size={14} className={ICON_COLOR}/>
</button>
)}
<Input value={row.time} onChange={e => updateInspectionRow(row.id, "time", e.target.value)} className={`flex-1 text-center ${TEXT_BODY} ${PLACEHOLDER_STYLE}`} placeholder="예: 9:30"/>
</div>
</td>
<td className={`border ${BORDER_COLOR} p-2 text-center align-middle`}>
<Input value={row.person} onChange={e => updateInspectionRow(row.id, "person", e.target.value)} className={`w-full text-center ${TEXT_BODY} ${PLACEHOLDER_STYLE}`} placeholder="소속 및 성명"/>
</td>
<td className={`border ${BORDER_COLOR} p-2 align-middle`}>
<Textarea value={row.note} onChange={e => updateInspectionRow(row.id, "note", e.target.value)} className={`w-full min-h-[40px] ${TEXT_BODY} ${PLACEHOLDER_STYLE} resize-none`} placeholder="관찰/점검 내용"/>
</td>
</tr>
))}
<tr>
<td colSpan={3} className={`border ${BORDER_COLOR} p-2 text-center`}>
<button onClick={addInspectionRow} disabled={inspectionRows.length >= 10} className={`text-xs no-print flex items-center gap-1 mx-auto ${inspectionRows.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
documentType="현장 위험성평가(JSA)"
/>
</>
)
}