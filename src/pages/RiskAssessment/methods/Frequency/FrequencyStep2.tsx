import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import StepBar from "@/components/modules/StepBar"
import DataTable, { Column } from "@/components/common/tables/DataTable"
import Button from "@/components/common/base/Button"
import { Upload, ChevronRight, ChevronLeft, Trash2, Save } from "lucide-react"
import PageTitle from "@/components/common/base/PageTitle"
import EditableTextArea from "@/components/common/inputs/EditableTextArea"
import DatePicker from "@/components/common/inputs/DatePicker"

type RiskDataRow = {
id: number
work: string
hazard: string
action: string
attachmentFile: string | null
frequency: number
intensity: number
afterPhoto: string | null
evaluator: string
evaluationDate: Date
}

const selectStyle: React.CSSProperties = {
appearance: "none",
WebkitAppearance: "none",
MozAppearance: "none",
paddingRight: 30,
backgroundColor: "transparent",
border: "none",
outline: "none",
fontSize: 15,
cursor: "pointer",
width: "100%",
}

const initialData: RiskDataRow[] = [
{ id: 1, work: "운송준비", hazard: "내부 청소 작업 시 바닥면의 분진이 재비산되면서 흡입 위험", action: "- 보호구 지급 및 착용", attachmentFile: null, frequency: 3, intensity: 2, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 2, work: "운송준비", hazard: "청소 작업 시 청소 장비 등의 가동음에 의한 소음에 노출되어 난청 발생 위험", action: "- 보호구 지급 및 착용", attachmentFile: null, frequency: 2, intensity: 2, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 3, work: "운송준비", hazard: "운행 전 청소 작업 시 반복해서 청소 작업을 수행하여 근골격계질환 위험", action: "- 근골격계부담작업의 유해요인 교육\n- 올바른 작업자세\n- 대체요령 교육", attachmentFile: null, frequency: 2, intensity: 3, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 4, work: "운송준비", hazard: "청소 작업 시 청소 장비 등에 의한 걸림으로 넘어짐 위험", action: "- 작업장 정리정돈 및 청소\n- 전도예방조치(고정)", attachmentFile: null, frequency: 1, intensity: 1, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 5, work: "운송준비", hazard: "협소한 장소 및 구성된 곳 등 제한된 공간의 점검 시 충돌 사고 위험", action: "- 작업장 정리정돈 및 청소\n- 전도예방조치(고정)", attachmentFile: null, frequency: 1, intensity: 2, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 6, work: "여객운송", hazard: "승·하선 및 이동 시 틈틈이 의한 넘어짐 위험", action: "- 가설통로 설치\n- 안전난간 설치", attachmentFile: null, frequency: 2, intensity: 1, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 7, work: "여객운송", hazard: "운송수단의 운행 시 제한적인 작업공간 이동 및 점검 시 떨어지는 사고 위험", action: "- 작업장소 구명장구 비치", attachmentFile: null, frequency: 2, intensity: 2, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 8, work: "여객운송", hazard: "운송수단의 운행 시 제한적인 작업공간의 이동 및 점검 시 아래로 떨어지는 사고 위험", action: "- 안전난간 설치\n- 발끝막이판 설치", attachmentFile: null, frequency: 3, intensity: 3, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 9, work: "여객운송", hazard: "여객석의 운행 시 기계실 등의 점검에 따른 기계 가동음에 노출되어 난청 발생 위험", action: "- 청력보호구 지급 착용", attachmentFile: null, frequency: 2, intensity: 2, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 10, work: "여객운송", hazard: "운송수단의 운행 시 틈틈이로 전신 진동 등으로 근무자 스트레스, 피로도 증가 위험", action: "- 근로자 휴게시설 설치", attachmentFile: null, frequency: 2, intensity: 1, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 11, work: "여객운송", hazard: "승객의 안전을 위하여 운행 시 정기적인 점검 등으로 기후(한랭/고온)에 영향을 받아 안", action: "- 보호구 지급 및 착용", attachmentFile: null, frequency: 2, intensity: 2, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 12, work: "여객운송", hazard: "승객의 안전을 위하여 운행 시 정기적인 점검 등으로 기후(한랭/고온)에 영향을 받아 안", action: "- 작업 및 감장 작업 중지", attachmentFile: null, frequency: 1, intensity: 1, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 13, work: "여객운송", hazard: "승객의 이동 통로가 어두울 경우 안전사고 발생 위험", action: "- 안전하게 통행할 수 있도록 75lux 이상의 차량 조명\n- 조명 시설 설치", attachmentFile: null, frequency: 2, intensity: 2, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
{ id: 14, work: "여객운송", hazard: "여객선 등 운송수단의 이동 시 틈틈 등에 의해 넘어질 수 있는 위험", action: "- 작업장 정리정돈 및 청소\n- 전도예방조치(고정)", attachmentFile: null, frequency: 2, intensity: 1, afterPhoto: null, evaluator: "", evaluationDate: new Date() },
]


export default function FrequencyStep2() {
const navigate = useNavigate()
const [currentStep, setCurrentStep] = useState(1)
const [checked, setChecked] = useState<(number | string)[]>([])
const [data, setData] = useState<RiskDataRow[]>(initialData)
const attachmentFileRefs = useRef<(HTMLInputElement | null)[]>([])
const afterFileRefs = useRef<(HTMLInputElement | null)[]>([])

const calcRisk = (f: number, i: number) => f * i
const getRiskColor = (v: number) => v >= 7 ? "#FF3939" : v >= 4 ? "#FFE13E" : "#1EED1E"

const handleFileClick = (idx: number, type: "attachment" | "after") => {
if (type === "attachment") attachmentFileRefs.current[idx]?.click()
else afterFileRefs.current[idx]?.click()
}

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number, type: "attachment" | "after") => {
const file = e.target.files?.[0]
if (!file) return
const url = URL.createObjectURL(file)
setData(prev =>
prev.map((r, i) =>
i === idx
? {
...r,
attachmentFile: type === "attachment" ? url : r.attachmentFile,
afterPhoto: type === "after" ? url : r.afterPhoto,
}
: r
)
)
}

const onDelete = () => {
if (checked.length === 0) return alert("삭제할 항목을 선택하세요")
if (window.confirm("정말 삭제하시겠습니까?")) {
setData(prev => prev.filter(r => !checked.includes(r.id)))
setChecked([])
}
}

const columns: Column<RiskDataRow>[] = [
{ key: "id", label: "번호", minWidth: 50, renderCell: row => <div>{row.id}</div> },
{ key: "work", label: "공정(작업)", minWidth: 60, renderCell: row => <span className="text-[#999999]">{row.work}</span> },
{ key: "hazard", label: "유해위험요인", minWidth: 500, renderCell: row => <span className="text-left text-[#999999]">{row.hazard}</span> },
{ key: "action", label: "현재 안전보건조치", minWidth: 500, renderCell: row => <EditableTextArea value={row.action} onChange={() => {}} placeholder="현재 안전보건조치 입력" /> },
{ key: "frequency", label: "빈도", minWidth: 60, renderCell: row => <div className="relative"><select style={selectStyle} value={row.frequency} onChange={e => setData(prev => prev.map(r => r.id === row.id ? { ...r, frequency: Number(e.target.value) } : r))} className="font-semibold">{[1, 2, 3].map(v => <option key={v}>{v}</option>)}</select></div> },
{ key: "intensity", label: "강도", minWidth: 60, renderCell: row => <div className="relative"><select style={selectStyle} value={row.intensity} onChange={e => setData(prev => prev.map(r => r.id === row.id ? { ...r, intensity: Number(e.target.value) } : r))} className="font-semibold">{[1, 2, 3].map(v => <option key={v}>{v}</option>)}</select></div> },
{ key: "risk", label: "위험성", minWidth: 60, renderCell: row => { const val = calcRisk(row.frequency, row.intensity); return <div className="flex justify-center"><span className="px-5 py-1 rounded-lg font-bold" style={{ backgroundColor: getRiskColor(val) }}>{val}</span></div> } },
{ key: "afterPhoto", label: "평가현장 사진", minWidth: 100, renderCell: (_r, _col, rowIdx) => <><input type="file" accept="image/*" style={{ display: "none" }} ref={el => { afterFileRefs.current[rowIdx] = el }} onChange={e => handleFileChange(e, rowIdx, "after")} /><button type="button" onClick={() => handleFileClick(rowIdx, "after")}><Upload size={19} /></button></> },
{ key:"evaluationDate", label:"평가일자", minWidth:110, maxWidth:120, renderCell:row=><DatePicker value={row.evaluationDate} onChange={d=>setData(prev=>prev.map(r=>r.id===row.id?{...r,evaluationDate:d}:r))} /> },
]

return (
<section className="mypage-content w-full px-3 py-1 bg-[#F8F8F8] flex flex-col min-h-screen">
<StepBar currentStep={currentStep} setCurrentStep={setCurrentStep} />
<div className="flex justify-center w-full">
<div className="border border-[#DDDDDD] bg-white rounded-[13px] p-8 w-full flex flex-col">
<PageTitle>위험성평가 실시(빈도·강도법)</PageTitle>

<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-y-2">
<div className="text-xs sm:text-sm md:text-base md:whitespace-nowrap md:flex-1">
<span className="font-medium">산재업종분류: </span>
<span className="font-normal">
제조업&nbsp;&gt;&nbsp;전기기계기구ㆍ정밀기구ㆍ전자제품제조업&nbsp;&gt;&nbsp;
<span className="inline md:hidden"><br /></span>
기타전기기계기구제조업
</span>
</div>

<div className="flex flex-wrap md:flex-nowrap gap-1 w-full md:w-auto justify-end md:justify-start md:ml-4 shrink-0">
<Button variant="action" onClick={() => alert("임시저장 완료")} className="flex items-center gap-1">
<Save size={16} />임시저장하기
</Button>
<Button variant="action" onClick={onDelete} className="flex items-center gap-1">
<Trash2 size={16} />삭제
</Button>
</div>
</div>

<DataTable<RiskDataRow> columns={columns} data={data} onCheckedChange={setChecked} className="min-w-[600px] md:min-w-auto" />
</div>
</div>
<div className="mt-5 flex justify-between">
<Button variant="secondary" onClick={() => navigate("/risk-assessment/methods/frequency/step1")}><ChevronLeft size={18} className="mr-2" />이전으로</Button>
<Button variant="secondary" onClick={() => navigate("/risk-assessment/methods/frequency/step3")}>저장 후 다음으로<ChevronRight size={18} className="ml-2" /></Button>
</div>
</section>
)
}