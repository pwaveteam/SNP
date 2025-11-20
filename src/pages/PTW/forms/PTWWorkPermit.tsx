import React, { useState, useCallback } from "react"
import { Printer, Save, Send, FolderOpen, Plus, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import Button from "@/components/common/base/Button"
import useTableActions from "@/hooks/tableActions"
import PTWListModal from "./PTWListModal"
import SignatureSelector from "../SignatureModule/SignatureSelector"
import { SignatureInfo } from "../SignatureModule/types"

type PTWWorkPermitProps = { ptwId?: string }

interface SafetyRequirement {
id: number
text: string
hasInput: boolean
}

interface PTWFormData {
workplace?: string
applicationDate?: string
workTypes?: string[]
requestDept?: string
workerCount?: number
workDate?: string
applicantName?: string
applicantSignature?: string
workLocation?: string
workType?: string
otherSafety?: string
safetyChecks?: Record<string, string | boolean>
approvers?: Record<string, SignatureInfo>
supervisor?: SignatureInfo
}

const BORDER_COLOR = "border-[#888888]"
const HEADER_TEXT_STYLE = "text-[#595F68] text-[15px] font-medium"
const BODY_TEXT_STYLE = "text-[#333A3F] text-[15px] font-normal"
const HEADER_BG_STYLE = `bg-[#f3f3f3] ${HEADER_TEXT_STYLE}`
const LABEL_WIDTH = "w-[11%]"
const WORKPLACE_NAME = "(주)에스피에스앤아이 당진 슬래그공장"
const PLACEHOLDER_STYLE = "placeholder:text-[13px] placeholder:text-gray-500"
const ICON_COLOR = "text-gray-500"

const APPROVAL_STEPS = [
{ title: "검토", subtitle: "(생산반장)", key: "sig_review1" },
{ title: "검토", subtitle: "(생산팀장)", key: "sig_review2" },
{ title: "합의", subtitle: "(안전담당자)", key: "sig_agreement" },
{ title: "승인", subtitle: "(관리책임자)", key: "sig_approval" },
]

const WORK_TYPES = ["화기작업", "중장비", "LOTOTO", "고소작업", "기타 위험작업"]

const FINAL_CHECK_QUESTIONS = [
"1. 작업을 위해 철거된 방호울/개구부, 정리정돈 상태는 원상복귀 되었는가?",
"2. 작업 완료 후 작업장소 주변 및 하부에 화재징후는 없는가?",
"3. 작업 중 위험성평가에 없는 새로운 위험요소가 발견되었는가?",
"4. 작업 중에 안전사고, 아차사고 또는 근로자 건강 이벤트가 발생했습니까?",
]

export default function PTWWorkPermit({ ptwId }: PTWWorkPermitProps): React.ReactElement {
const [formData, setFormData] = useState<PTWFormData>({ workplace: WORKPLACE_NAME, applicantName: "홍길동" })
const [isListModalOpen, setIsListModalOpen] = useState(false)
const [safetyRequirements, setSafetyRequirements] = useState({
prework: [
{ id: 1, text: "개인보호구 : 4대 보호구 외", hasInput: true },
{ id: 2, text: "공도구 상태 안전점검", hasInput: false },
{ id: 3, text: "작업자 교육결과 확인 (특별교육)", hasInput: false }
],
fire: [
{ id: 1, text: "화재감시자 지정", hasInput: true },
{ id: 2, text: "화기작업 주변 인화성 물질 확인", hasInput: false },
{ id: 3, text: "소화기 비치", hasInput: false },
{ id: 4, text: "불티비산 방지망 설치", hasInput: false }
],
heavy: [
{ id: 1, text: "유자격자 운전 (자격증, 보험증, 점검증 등)", hasInput: false },
{ id: 2, text: "작업지휘자 및 신호수 운영", hasInput: false },
{ id: 3, text: "작업계획서 작성 및 안전장치 확인", hasInput: false }
],
lototo: [
{ id: 1, text: "작업 전 설비 정지상태 확인", hasInput: false },
{ id: 2, text: "LOTO 체결상태 확인", hasInput: false }
],
height: [
{ id: 1, text: "안전모, 안전화, 안전대 착용 확인", hasInput: false },
{ id: 2, text: "추락 위험구간 안전대 걸이시설 여부 확인", hasInput: false }
]
})

const updateFormData = useCallback((updates: Partial<PTWFormData>): void => {
setFormData((prev: PTWFormData) => ({ ...prev, ...updates }))
}, [])

const updateSafetyCheck = useCallback((key: string, value: string | boolean): void => {
setFormData((prev: PTWFormData) => ({
...prev,
safetyChecks: { ...(prev.safetyChecks || {}), [key]: value },
}))
}, [])

const updateApprover = useCallback((key: string, person: SignatureInfo): void => {
setFormData((prev: PTWFormData) => ({
...prev,
approvers: { ...(prev.approvers || {}), [key]: person },
}))
}, [])

const addRequirementRow = useCallback((category: keyof typeof safetyRequirements) => {
setSafetyRequirements(prev => {
if (prev[category].length >= 10) return prev
return {
...prev,
[category]: [...prev[category], { id: Date.now(), text: "", hasInput: false }]
}
})
}, [])

const removeRequirementRow = useCallback((category: keyof typeof safetyRequirements, id: number) => {
setSafetyRequirements(prev => ({
...prev,
[category]: prev[category].filter(item => item.id !== id)
}))
}, [])

const updateRequirementRow = useCallback((category: keyof typeof safetyRequirements, id: number, text: string) => {
setSafetyRequirements(prev => ({
...prev,
[category]: prev[category].map(item => item.id === id ? { ...item, text } : item)
}))
}, [])

const handleLoadMySignature = async () => {
const signatureImage = "/images/sample-signature.png"
updateFormData({ applicantSignature: signatureImage })
}

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

<div id="ptw-print-area">

<table className={`w-full border-collapse border ${BORDER_COLOR} ${BODY_TEXT_STYLE}`}>
<tbody>
<tr>
<td colSpan={4} className={`border ${BORDER_COLOR} text-center font-semibold text-[18px] py-3`}>위험작업 허가서(직영)</td>
</tr>

<tr>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 text-center ${LABEL_WIDTH}`}>사업장</td>
<td className={`border ${BORDER_COLOR} p-2 w-[39%]`}>
<Input value={WORKPLACE_NAME} readOnly className="w-full bg-[#F9FAFB] text-gray-600 cursor-default"/>
</td>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 text-center ${LABEL_WIDTH}`}>신청일자</td>
<td className={`border ${BORDER_COLOR} p-2 w-[39%]`}>
<Input type="date" value={formData.applicationDate || ""} onChange={e => updateFormData({ applicationDate: e.target.value })} className="w-full"/>
</td>
</tr>

<tr>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 text-center ${LABEL_WIDTH}`}>작업요청부서</td>
<td className={`border ${BORDER_COLOR} p-2 w-[39%]`}>
<Input value={formData.requestDept || ""} onChange={e => updateFormData({ requestDept: e.target.value })} className={`w-full ${PLACEHOLDER_STYLE}`} placeholder="작업요청부서를 입력하세요"/>
</td>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 text-center ${LABEL_WIDTH}`}>작업인원</td>
<td className={`border ${BORDER_COLOR} p-2 w-[39%]`}>
<div className="flex items-center gap-2">
<Input type="number" value={formData.workerCount || ""} onChange={e => updateFormData({ workerCount: e.target.value ? Number(e.target.value) : undefined })} className="w-30"/>
<span>명</span>
</div>
</td>
</tr>

<tr>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 text-center ${LABEL_WIDTH}`}>작업일</td>
<td className={`border ${BORDER_COLOR} p-2 w-[39%]`}>
<Input type="datetime-local" value={formData.workDate || ""} onChange={e => updateFormData({ workDate: e.target.value })} className="w-full"/>
</td>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 text-center ${LABEL_WIDTH}`}>신청자</td>
<td className={`border ${BORDER_COLOR} p-2 w-[39%]`}>
<div className="flex items-center gap-2">
<Input value={formData.applicantName || ""} onChange={e => updateFormData({ applicantName: e.target.value })} placeholder="이름" className={`w-32 ${PLACEHOLDER_STYLE}`}/>
{formData.applicantSignature ? (
<button onClick={handleLoadMySignature} className="border border-gray-300 rounded px-2 py-1 hover:border-gray-400 transition">
<img src={formData.applicantSignature} alt="신청자 서명" className="h-8"/>
</button>
) : (
<Button variant="action" onClick={handleLoadMySignature}>서명 불러오기</Button>
)}
</div>
</td>
</tr>

<tr>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 text-center ${LABEL_WIDTH} align-middle`}>작업장소</td>
<td className={`border ${BORDER_COLOR} p-2 w-[39%] align-middle`}>
<Input value={formData.workLocation || ""} onChange={e => updateFormData({ workLocation: e.target.value })} className={`w-full h-8 ${PLACEHOLDER_STYLE}`} placeholder="작업장소를 입력하세요"/>
</td>
<td rowSpan={2} colSpan={2} className={`border ${BORDER_COLOR} p-0 w-[50%] align-top`}>
<div className="flex flex-col h-full">
<div className={`relative grid grid-cols-4 border-b ${BORDER_COLOR} h-[52px] items-center`}>
{APPROVAL_STEPS.map((item, i) => (
<div key={i} className="relative flex flex-col items-center justify-center py-1 h-full">
<span className={HEADER_TEXT_STYLE}>{item.title}</span>
<span className="text-[12px] font-normal text-gray-500 leading-tight">{item.subtitle}</span>
</div>
))}
{[1, 2, 3].map(i => (
<div key={`divider-top-${i}`} className={`absolute top-0 bottom-0 border-l ${BORDER_COLOR}`} style={{ left: `${(100 / 4) * i}%` }}/>
))}
</div>

<div className="relative grid grid-cols-4">
{APPROVAL_STEPS.map((item, i) => (
<div key={i} className="relative flex items-center justify-center bg-white py-2 h-full min-h-[80px]">
<SignatureSelector value={formData.approvers?.[item.key]} onChange={person => updateApprover(item.key, person)}/>
</div>
))}
{[1, 2, 3].map(i => (
<div key={`divider-bottom-${i}`} className={`absolute top-0 bottom-0 border-l ${BORDER_COLOR}`} style={{ left: `${(100 / 4) * i}%` }}/>
))}
</div>
</div>
</td>
</tr>

<tr>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 text-center align-middle ${LABEL_WIDTH}`}>작업명</td>
<td className={`border ${BORDER_COLOR} p-2 align-middle w-[39%]`}>
<Input value={formData.workType || ""} onChange={e => updateFormData({ workType: e.target.value })} className={`w-full h-8 ${PLACEHOLDER_STYLE}`} placeholder="작업명을 입력하세요"/>
</td>
</tr>

<tr>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} text-center align-middle ${LABEL_WIDTH}`}>작업구분</td>
<td colSpan={3} className={`border ${BORDER_COLOR} p-0`}>
<div className={`relative grid grid-cols-5 border-b ${BORDER_COLOR}`}>
{WORK_TYPES.map(label => (
<div key={label} className={`flex items-center justify-center text-[14px] font-medium text-center py-[8px] ${HEADER_BG_STYLE}`}>{label}</div>
))}
{[1, 2, 3, 4].map(i => (
<div key={`divider-top-${i}`} className={`absolute top-0 bottom-0 border-l ${BORDER_COLOR}`} style={{ left: `${(100 / 5) * i}%` }}/>
))}
</div>

<div className="relative grid grid-cols-5 h-[40px]">
{WORK_TYPES.map(type => (
<div key={type} className="flex items-center justify-center">
{type === "기타 위험작업" ? (
<div className="flex items-center gap-1">
<Checkbox checked={(formData.workTypes || []).includes(type)} onCheckedChange={checked => {
const list = formData.workTypes || []
updateFormData({ workTypes: checked ? [...list, type] : list.filter(t => t !== type) })
}}/>
<Input value={formData.safetyChecks?.etcWork as string || ""} onChange={e => updateSafetyCheck("etcWork", e.target.value)} className="w-24 h-7"/>
</div>
) : (
<Checkbox checked={(formData.workTypes || []).includes(type)} onCheckedChange={checked => {
const list = formData.workTypes || []
updateFormData({ workTypes: checked ? [...list, type] : list.filter(t => t !== type) })
}}/>
)}
</div>
))}
{[1, 2, 3, 4].map(i => (
<div key={`divider-bottom-${i}`} className={`absolute top-0 bottom-0 border-l ${BORDER_COLOR}`} style={{ left: `${(100 / 5) * i}%` }}/>
))}
</div>

</td>
</tr>
</tbody>
</table>

<table className={`w-full border-collapse border ${BORDER_COLOR} mt-3 ${BODY_TEXT_STYLE}`}>
<tbody>

<tr>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 text-center w-[38%] align-middle relative`}>
<div className="font-medium">안전조치 요구사항</div>
<div className="text-[11px] text-gray-600 mt-1 leading-tight">1: 허가서 신청 시 작업팀 안전사항 Check 2: 관리감독자 현장확인 Check</div>
</td>

<td colSpan={2} className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-0 text-center w-[12%]`}>
<div className="border-b border-gray-300 w-full flex items-center justify-center py-[5px]">확인</div>
<div className="grid grid-cols-2">
{["1", "2"].map(num => (
<div key={num} className={`border-t ${BORDER_COLOR} flex items-center justify-center py-1 text-[14px] font-medium ${num === "1" ? `border-r ${BORDER_COLOR}` : ""}`}>{num}</div>
))}
</div>
</td>

<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 text-center w-[38%] align-middle`}>안전조치 요구사항</td>
<td colSpan={2} className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-0 text-center w-[12%]`}>
<div className="border-b border-gray-300 w-full flex items-center justify-center py-[5px]">확인</div>
<div className="grid grid-cols-2">
{["1", "2"].map(num => (
<div key={num} className={`border-t ${BORDER_COLOR} flex items-center justify-center py-1 text-[14px] font-medium ${num === "1" ? `border-r ${BORDER_COLOR}` : ""}`}>{num}</div>
))}
</div>
</td>
</tr>

<tr>
<td className={`border ${BORDER_COLOR} p-2 font-medium`} colSpan={3}>
<div className="flex items-center justify-between">
<span>■ 작업 전 안전조치 (공통)</span>
<button onClick={() => addRequirementRow("prework")} className="text-xs no-print flex items-center gap-1">
<Plus size={14} className={ICON_COLOR}/>추가
</button>
</div>
</td>

<td className={`border ${BORDER_COLOR} p-2 font-medium`} colSpan={3}>
<div className="flex items-center justify-between">
<span>■ 화기작업</span>
<button onClick={() => addRequirementRow("fire")} className="text-xs no-print flex items-center gap-1">
<Plus size={14} className={ICON_COLOR}/>추가
</button>
</div>
</td>
</tr>

<tr>
<td className={`border ${BORDER_COLOR} p-2 text-sm`}>
<div className="space-y-1">
{safetyRequirements.prework.map((item, idx) => (
<div key={item.id} className="flex items-center gap-1">
<span>-</span>

{item.hasInput && idx === 0 ? (
<>
개인보호구 : 4대 보호구 외 (
<Input value={formData.safetyChecks?.prework_ppe_extra as string || ""} onChange={e => updateSafetyCheck("prework_ppe_extra", e.target.value)} className="inline-block w-24 h-6 px-1 text-xs"/>)
</>
) : (
<Input value={item.text} onChange={e => updateRequirementRow("prework", item.id, e.target.value)} className="inline-block flex-1 h-6 px-1 text-xs"/>
)}

{safetyRequirements.prework.length > 1 && (
<button onClick={() => removeRequirementRow("prework", item.id)} className="text-xs no-print ml-1">
<X size={14} className={ICON_COLOR}/>
</button>
)}
</div>
))}
</div>
</td>

{[1, 2].map(num => (
<td key={`pre-${num}`} className={`border ${BORDER_COLOR} p-2`}>
<div className="flex flex-col items-center space-y-1">
{safetyRequirements.prework.map((item, idx) => (
<Checkbox key={`${item.id}-${num}`} checked={formData.safetyChecks?.[`prework_${idx}_${num}`] as boolean} onCheckedChange={checked => updateSafetyCheck(`prework_${idx}_${num}`, checked)}/>
))}
</div>
</td>
))}

<td className={`border ${BORDER_COLOR} p-2 text-sm`}>
<div className="space-y-1">
{safetyRequirements.fire.map((item, idx) => (
<div key={item.id} className="flex items-center gap-1">
<span>-</span>

{item.hasInput && idx === 0 ? (
<>
화재감시자 지정 (
<Input value={formData.safetyChecks?.fire_monitor_name as string || ""} onChange={e => updateSafetyCheck("fire_monitor_name", e.target.value)} className="inline-block w-24 h-6 px-1 text-xs"/>)
</>
) : (
<Input value={item.text} onChange={e => updateRequirementRow("fire", item.id, e.target.value)} className="inline-block flex-1 h-6 px-1 text-xs"/>
)}

{safetyRequirements.fire.length > 1 && (
<button onClick={() => removeRequirementRow("fire", item.id)} className="text-xs no-print ml-1">
<X size={14} className={ICON_COLOR}/>
</button>
)}
</div>
))}
</div>
</td>

{[1, 2].map(num => (
<td key={`fire-${num}`} className={`border ${BORDER_COLOR} p-2`}>
<div className="flex flex-col items-center space-y-1">
{safetyRequirements.fire.map((item, idx) => (
<Checkbox key={`${item.id}-${num}`} checked={formData.safetyChecks?.[`fire_${idx}_${num}`] as boolean} onCheckedChange={checked => updateSafetyCheck(`fire_${idx}_${num}`, checked)}/>
))}
</div>
</td>
))}
</tr>

<tr>
<td className={`border ${BORDER_COLOR} p-2 font-medium`} colSpan={3}>
<div className="flex items-center justify-between">
<span>■ 중장비 작업 (이동식 크레인, 고소작업차 등)</span>
<button onClick={() => addRequirementRow("heavy")} className="text-xs no-print flex items-center gap-1">
<Plus size={14} className={ICON_COLOR}/>추가
</button>
</div>
</td>

<td className={`border ${BORDER_COLOR} p-2 font-medium`} colSpan={3}>
<div className="flex items-center justify-between">
<span>■ LOTOTO</span>
<button onClick={() => addRequirementRow("lototo")} className="text-xs no-print flex items-center gap-1">
<Plus size={14} className={ICON_COLOR}/>추가
</button>
</div>
</td>
</tr>

<tr>
<td className={`border ${BORDER_COLOR} p-2 text-sm`}>
<div className="space-y-1">
{safetyRequirements.heavy.map(item => (
<div key={item.id} className="flex items-center gap-1">
<span>-</span>
<Input value={item.text} onChange={e => updateRequirementRow("heavy", item.id, e.target.value)} className="inline-block flex-1 h-6 px-1 text-xs"/>
{safetyRequirements.heavy.length > 1 && (
<button onClick={() => removeRequirementRow("heavy", item.id)} className="text-xs no-print ml-1">
<X size={14} className={ICON_COLOR}/>
</button>
)}
</div>
))}
</div>
</td>

{[1, 2].map(num => (
<td key={`heavy-${num}`} className={`border ${BORDER_COLOR} p-2`}>
<div className="flex flex-col items-center space-y-1">
{safetyRequirements.heavy.map((item, idx) => (
<Checkbox key={`${item.id}-${num}`} checked={formData.safetyChecks?.[`heavy_${idx}_${num}`] as boolean} onCheckedChange={checked => updateSafetyCheck(`heavy_${idx}_${num}`, checked)}/>
))}
</div>
</td>
))}

<td className={`border ${BORDER_COLOR} p-2 text-sm`}>
<div className="space-y-1">
{safetyRequirements.lototo.map(item => (
<div key={item.id} className="flex items-center gap-1">
<span>-</span>
<Input value={item.text} onChange={e => updateRequirementRow("lototo", item.id, e.target.value)} className="inline-block flex-1 h-6 px-1 text-xs"/>
{safetyRequirements.lototo.length > 1 && (
<button onClick={() => removeRequirementRow("lototo", item.id)} className="text-xs no-print ml-1">
<X size={14} className={ICON_COLOR}/>
</button>
)}
</div>
))}
</div>
</td>

{[1, 2].map(num => (
<td key={`loto-${num}`} className={`border ${BORDER_COLOR} p-2`}>
<div className="flex flex-col items-center space-y-1">
{safetyRequirements.lototo.map((item, idx) => (
<Checkbox key={`${item.id}-${num}`} checked={formData.safetyChecks?.[`lototo_${idx}_${num}`] as boolean} onCheckedChange={checked => updateSafetyCheck(`lototo_${idx}_${num}`, checked)}/>
))}
</div>
</td>
))}
</tr>

<tr>
<td className={`border ${BORDER_COLOR} p-2 font-medium`} colSpan={3}>
<div className="flex items-center justify-between">
<span>■ 고소작업 (높이 2M 이상)</span>
<button onClick={() => addRequirementRow("height")} className="text-xs no-print flex items-center gap-1">
<Plus size={14} className={ICON_COLOR}/>추가
</button>
</div>
</td>

<td className={`border ${BORDER_COLOR} p-2 font-medium`} colSpan={3}>■ 기타 안전조치 사항 (기술)</td>
</tr>

<tr>
<td className={`border ${BORDER_COLOR} p-2 text-sm align-middle`}>
<div className="flex flex-col justify-center h-full space-y-1">
{safetyRequirements.height.map(item => (
<div key={item.id} className="flex items-center gap-1">
<span>-</span>
<Input value={item.text} onChange={e => updateRequirementRow("height", item.id, e.target.value)} className="inline-block flex-1 h-6 px-1 text-xs"/>
{safetyRequirements.height.length > 1 && (
<button onClick={() => removeRequirementRow("height", item.id)} className="text-xs no-print ml-1">
<X size={14} className={ICON_COLOR}/>
</button>
)}
</div>
))}
</div>
</td>

{[1, 2].map(num => (
<td key={`height-${num}`} className={`border ${BORDER_COLOR} p-2 align-middle`}>
<div className="flex flex-col items-center justify-center space-y-1">
{safetyRequirements.height.map((item, idx) => (
<Checkbox key={`${item.id}-${num}`} checked={formData.safetyChecks?.[`height_${idx}_${num}`] as boolean} onCheckedChange={checked => updateSafetyCheck(`height_${idx}_${num}`, checked)}/>
))}
</div>
</td>
))}

<td className={`border ${BORDER_COLOR} p-2 align-middle`}>
<div className="flex justify-center">
<Textarea value={formData.otherSafety || ""} onChange={e => updateFormData({ otherSafety: e.target.value })} className="w-full h-[60px] border-[#F0F0F0] text-sm resize-none"/>
</div>
</td>

{[1, 2].map(num => (
<td key={`other-${num}`} className={`border ${BORDER_COLOR} p-2 text-center align-middle`}>
<div className="flex justify-center items-center h-full">
<Checkbox checked={formData.safetyChecks?.[`other_check${num}`] as boolean} onCheckedChange={checked => updateSafetyCheck(`other_check${num}`, checked)}/>
</div>
</td>
))}
</tr>

</tbody>
</table>

<table className={`w-full border-collapse border ${BORDER_COLOR} mt-3 ${BODY_TEXT_STYLE}`}>
<tbody>
<tr>
<td className={`border ${BORDER_COLOR} p-3 text-sm leading-6`} colSpan={6}>
<div className="space-y-1">
<div className="font-semibold flex items-center gap-1">
<span className="text-[16px]">✓</span>
<span>준수사항</span>
</div>

<div>ㆍ공도구는 작업 전 안전장치 상태를 점검하고 정품을 사용합니다. 모든 에너지원은 LOTOTO 절차에 의해 차단되어야 합니다.</div>
<div>ㆍ용접(충전부위 절연조치)/절단(역화방지기, 게이지) 시 작업 전 안전조치를 확인해야 합니다.</div>
<div>ㆍ흡연구역 준수 및 정리정돈을 해야 합니다. (클린캔 사용, 클린캔에 철물 혼입금지)</div>
<div className="font-semibold">
ㆍ크레인 및 중장비 작업 전 사전조사 및 작업계획서를 작성해야 하며, 그 내용에 대하여 모든 작업자에게 교육해야 합니다.<br/>
<span className="underline underline-offset-2">(당사 최초작업 및 일용직은 사전에 안전교육을 실시하여야 하며 그 교육결과를 작업허가서와 함께 게시해야 합니다.)</span>
</div>
<div>※ 안전 점검 중 불안전한 상태 및 행동에 대한 개선 요청 시 즉시 조치해야 하며 불응 시 작업중지 및 퇴출될 수 있습니다.</div>
<div>※ 작업팀 관리자 및 관리감독자는 현장 안전점검 수시로 실시 (작업 전, 중, 후)</div>
</div>
</td>
</tr>
</tbody>
</table>

<table className={`w-full border-collapse border ${BORDER_COLOR} mt-3 ${BODY_TEXT_STYLE}`}>
<tbody>

<tr>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 font-medium text-center w-[70%]`}>작업 완료 시 관리감독자 최종 작업장 확인 및 검토</td>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} p-2 font-medium text-center w-[30%]`}>조치/의견</td>
</tr>

{FINAL_CHECK_QUESTIONS.map((question, i) => (
<tr key={i}>
<td className={`border ${BORDER_COLOR} p-2 text-sm align-middle`}>
<div className="flex justify-between items-center w-full">
<span className="text-left">{question}</span>
<div className="flex items-center gap-3 pr-2">
<label className="flex items-center gap-1 text-sm">
<Checkbox checked={formData.safetyChecks?.[`final_check_${i + 1}_y`] as boolean} onCheckedChange={checked => updateSafetyCheck(`final_check_${i + 1}_y`, checked)}/>Y
</label>
<label className="flex items-center gap-1 text-sm">
<Checkbox checked={formData.safetyChecks?.[`final_check_${i + 1}_n`] as boolean} onCheckedChange={checked => updateSafetyCheck(`final_check_${i + 1}_n`, checked)}/>N
</label>
</div>
</div>
</td>

{i === 0 && (
<td rowSpan={4} className={`border ${BORDER_COLOR} p-0 align-top w-[30%]`}>
<Textarea value={formData.safetyChecks?.final_comment as string || ""} onChange={e => updateSafetyCheck("final_comment", e.target.value)} className="w-full h-full min-h-[180px] text-sm border-0 resize-none p-2" placeholder="내용 입력"/>
</td>
)}
</tr>
))}

</tbody>
</table>

<table className={`w-full border-collapse border ${BORDER_COLOR} mt-3 ${BODY_TEXT_STYLE}`}>
<tbody>
<tr className="h-[26px]">
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} text-center align-middle w-[140px] font-medium h-[26px]`}>작업 종료 일시</td>
<td className={`border ${BORDER_COLOR} bg-white px-2 py-[2px] align-middle h-[26px]`}>
<Input type="datetime-local" value={formData.safetyChecks?.work_end_time as string || ""} onChange={e => updateSafetyCheck("work_end_time", e.target.value)} className="w-52 h-[28px]"/>
</td>
<td className={`border ${BORDER_COLOR} ${HEADER_BG_STYLE} text-center font-medium w-[140px] h-[26px]`}>관리감독자</td>
<td className={`border ${BORDER_COLOR} bg-white w-[140px] p-[2px]`}>
<div className="flex items-center justify-center h-[45px]">
<SignatureSelector value={formData.supervisor} onChange={person => updateFormData({ supervisor: person })}/>
</div>
</td>
</tr>
</tbody>
</table>

</div>
</div>
</ScrollArea>
</CardContent>
</div>

<PTWListModal
isOpen={isListModalOpen}
onClose={() => setIsListModalOpen(false)}
onSelect={handleSelectPTW}
documentType="위험작업허가서"
/>
</>
)
}