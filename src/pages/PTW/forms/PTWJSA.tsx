import React, { useState, useCallback, ChangeEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Printer, Save, FolderOpen, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import useTableActions from "@/hooks/tableActions"
import Button from "@/components/common/base/Button"
import PTWListModal from "./PTWListModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PTWJSAProps = { ptwId?: string }

interface JSAFormData {
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

const BORDER_COLOR = "border-[#888888]"
const HEADER_TEXT_STYLE = "text-[#595F68] text-[15px] font-medium"
const HEADER_BG_STYLE = `bg-[#f3f3f3] ${HEADER_TEXT_STYLE}`
const TEXT_TITLE = "text-[18px] font-bold text-[#333A3F]"
const TEXT_BODY = "text-[15px] text-[#333A3F]"
const ALIGN_CENTER = "text-center"
const LABEL_WIDTH = "w-[10%]"
const READONLY_BG = "bg-[#F9FAFB] text-gray-800"
const PLACEHOLDER_STYLE = "placeholder:text-[13px] placeholder:text-gray-500"
const WORKPLACE_NAME = "(주)에스피에스앤아이 당진 슬래그공장"
const ICON_COLOR = "text-gray-500"

const FORM_FIELDS = [
{ label: "Date", key: "date", type: "date", width: "w-[40%]" },
{ label: "No", key: "no", defaultValue: "SPS&A-JSA-15", width: "w-[40%]" },
{ label: "분임조", key: "team", width: "w-[40%]", placeholder: "분임조를 입력하세요" },
{ label: "Rev", key: "rev", width: "w-[40%]", hasReason: true, placeholder: "Rev를 입력하세요" },
{ label: "작업명", key: "workName", width: "w-[40%]", placeholder: "작업명을 입력하세요" },
{ label: "작업도구", key: "tools", width: "w-[40%]", placeholder: "작업도구를 입력하세요" },
{ label: "안전장치", key: "safetyDevices", width: "w-[40%]", placeholder: "안전장치를 입력하세요" },
{ label: "작업내용", key: "workContent", width: "w-[40%]", placeholder: "작업 내용을 입력하세요" }
]

const RISK_TABLE_HEADERS = ["작업순서", "위험요인", "현재 위험성", "안전대책", "개선후 위험성", "체크"]
const RISK_LEVELS = ["상", "중", "하"]

const INITIAL_WORK_TASKS = [
"1. 작업 전 설비(공구), 안전 보호구 점검",
"2. 점검 맨홀 Open",
"3. B/F(12-FN-240) 가동 및 설비 내부 Aring 실시",
"4. 24mm 연결 된 60A 파이프 시계 회전 방향 회전",
"5. Roller Oil 급유 뚜껑 OPEN 및 Oil 확인 후 급유",
"6. Roller 회전 상태 및 누유 확인",
"7. 점검맨홀 Close",
"8. 작업 마무리 주변 정리정돈"
]

export default function PTWJSA({ ptwId }: PTWJSAProps): React.ReactElement {
const [formData, setFormData] = useState<JSAFormData>({ workplace: WORKPLACE_NAME })
const [riskRows, setRiskRows] = useState<RiskRow[]>(
INITIAL_WORK_TASKS.map((task, i) => ({
id: i + 1,
task,
hazard: "",
currentRisk: "",
measure: "",
improvedRisk: "",
checked: false,
beforeImages: [],
afterImages: []
}))
)
const [isListModalOpen, setIsListModalOpen] = useState(false)

const updateFormData = useCallback((updates: Partial<JSAFormData>): void => {
setFormData(prev => ({ ...prev, ...updates }))
}, [])

const updateRiskRow = useCallback((id: number, key: keyof RiskRow, value: any): void => {
setRiskRows(prev => prev.map(r => r.id === id ? { ...r, [key]: value } : r))
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
handleSave,
handlePrint,
handleLoad
} = useTableActions({
data: [],
checkedIds: [],
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
<td colSpan={4} className={`border ${BORDER_COLOR} ${ALIGN_CENTER} ${TEXT_TITLE} py-3`}>
작업위험분석(JSA)
</td>
</tr>
{FORM_FIELDS.map((f, i) => {
if (i % 2 === 0) {
const n = FORM_FIELDS[i + 1]
return (
<tr key={i}>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-2 ${LABEL_WIDTH}`}>
{f.label}
</td>
<td className={`border ${BORDER_COLOR} p-2 ${f.width}`}>
{f.hasReason ? (
<div className="flex items-center gap-2 w-full">
<Input value={(formData[f.key as keyof JSAFormData] as string) || ""} onChange={e => updateFormData({ [f.key]: e.target.value })} className={`w-[30%] ${TEXT_BODY} ${PLACEHOLDER_STYLE}`}/>
<Input value={formData.reason || ""} onChange={e => updateFormData({ reason: e.target.value })} className={`flex-1 ${TEXT_BODY} ${PLACEHOLDER_STYLE}`}/>
</div>
) : (
<Input type={f.type || "text"} value={(formData[f.key as keyof JSAFormData] as string) || f.defaultValue || ""} onChange={e => updateFormData({ [f.key]: e.target.value })} className={`w-full ${TEXT_BODY} ${PLACEHOLDER_STYLE}`} placeholder={f.placeholder}/>
)}
</td>
{n && (
<>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-2 ${LABEL_WIDTH}`}>
{n.label}
</td>
<td className={`border ${BORDER_COLOR} p-2 ${n.width}`}>
<Input type={n.type || "text"} value={(formData[n.key as keyof JSAFormData] as string) || n.defaultValue || ""} onChange={e => updateFormData({ [n.key]: e.target.value })} className={`w-full ${TEXT_BODY} ${PLACEHOLDER_STYLE}`} placeholder={n.placeholder}/>
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

<table className={`w-full border-collapse border mt-3 ${BORDER_COLOR}`}>
<thead>
<tr>
{RISK_TABLE_HEADERS.map((t, i) => (
<th key={i} className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} ${ALIGN_CENTER} p-2`}>
{t}
</th>
))}
</tr>
</thead>
<tbody>
{riskRows.map((row, i) => (
<tr key={row.id} className="align-top">
<td className={`border ${BORDER_COLOR} p-2 w-[23%] align-middle`}>
<div className="flex items-start gap-1">
{riskRows.length > 1 && (
<button onClick={() => removeRiskRow(row.id)} className="text-xs no-print mt-3">
<X size={14} className={ICON_COLOR}/>
</button>
)}
<Textarea value={row.task} onChange={e => updateRiskRow(row.id, "task", e.target.value)} className={`flex-1 min-h-[48px] ${TEXT_BODY} resize-none`}/>
</div>
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[24%]`}>
<Textarea value={row.hazard} onChange={e => updateRiskRow(row.id, "hazard", e.target.value)} className={`w-full min-h-[48px] ${TEXT_BODY} resize-none`}/>
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[12%] ${ALIGN_CENTER} align-middle`}>
<div className={`rounded-md ${getRiskColor(row.currentRisk)}`}>
<Select value={row.currentRisk} onValueChange={v => updateRiskRow(row.id, "currentRisk", v)}>
<SelectTrigger className={`h-8 ${TEXT_BODY} bg-transparent border-none focus:ring-0 text-black`}>
<SelectValue placeholder="선택"/>
</SelectTrigger>
<SelectContent>
{RISK_LEVELS.map(l => (
<SelectItem key={l} value={l}>{l}</SelectItem>
))}
</SelectContent>
</Select>
</div>
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[28%]`}>
<Textarea value={row.measure} onChange={e => updateRiskRow(row.id, "measure", e.target.value)} className={`w-full min-h-[48px] ${TEXT_BODY} resize-none`}/>
</td>
<td className={`border ${BORDER_COLOR} p-2 w-[12%] ${ALIGN_CENTER} align-middle`}>
<div className={`rounded-md ${getRiskColor(row.improvedRisk)}`}>
<Select value={row.improvedRisk} onValueChange={v => updateRiskRow(row.id, "improvedRisk", v)}>
<SelectTrigger className={`h-8 ${TEXT_BODY} bg-transparent border-none focus:ring-0 text-black`}>
<SelectValue placeholder="선택"/>
</SelectTrigger>
<SelectContent>
{RISK_LEVELS.map(l => (
<SelectItem key={l} value={l}>{l}</SelectItem>
))}
</SelectContent>
</Select>
</div>
</td>
<td className={`border ${BORDER_COLOR} ${ALIGN_CENTER} align-middle min-w-[50px]`}>
<div className="flex items-center justify-center h-full">
<Checkbox checked={row.checked} onCheckedChange={c => updateRiskRow(row.id, "checked", Boolean(c))}/>
</div>
</td>
</tr>
))}
<tr>
<td colSpan={6} className={`border ${BORDER_COLOR} p-2 text-center`}>
<button onClick={addRiskRow} disabled={riskRows.length >= 15} className={`text-xs no-print flex items-center gap-1 mx-auto ${riskRows.length >= 15 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
documentType="작업위험분석(JSA)"
/>
</>
)
}