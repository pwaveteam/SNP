import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import StepBar from "@/components/modules/StepBar"
import DataTable, { Column } from "@/components/common/tables/DataTable"
import Button from "@/components/common/base/Button"
import { Upload, ChevronDown, ChevronRight, ChevronLeft, Save, Trash2, Printer, FileDown } from "lucide-react"
import DatePicker from "@/components/common/inputs/DatePicker"
import PageTitle from "@/components/common/base/PageTitle"
import EditableTextArea from "@/components/common/inputs/EditableTextArea"

type RiskDataRow = {
id: number
work: string
hazard: string
action: string
plannedDate: Date
completedDate: Date
evaluator: string
riskLevel: number
afterPhoto: string | null
}

const initialData: RiskDataRow[] = [
{ id: 1, work: "운송준비", hazard: "내부 청소 작업 시 바닥면의 분진이 재비산되면서 흡입 위험", action: "청소 시 방진마스크 착용 및 습식 청소 시행", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 2, afterPhoto: null },
{ id: 2, work: "운송준비", hazard: "청소 작업 시 청소 장비 등의 가동음에 의한 소음에 노출되어 난청 발생 위험", action: "청소작업 시 귀마개 착용 의무화", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 2, afterPhoto: null },
{ id: 3, work: "운송준비", hazard: "운행 전 청소 작업 시 반복해서 청소 작업을 수행하여 근골격계질환 위험", action: "작업 전 스트레칭 교육 및 작업대 높이 조정", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 3, afterPhoto: null },
{ id: 4, work: "운송준비", hazard: "청소 작업 시 청소 장비 등에 의한 걸림으로 넘어짐 위험", action: "청소 장비 정리정돈 및 작업장 바닥 정비", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 1, afterPhoto: null },
{ id: 5, work: "운송준비", hazard: "협소한 장소 및 구성된 곳 등 제한된 공간의 점검 시 충돌 사고 위험", action: "점검 전 작업구간 사전 정리 및 위험표시 부착", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 2, afterPhoto: null },
{ id: 6, work: "여객운송", hazard: "승·하선 및 이동 시 틈틈이 의한 넘어짐 위험", action: "승선 시 안전유도선 표시 및 조도 확보", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 1, afterPhoto: null },
{ id: 7, work: "여객운송", hazard: "운송수단의 운행 시 제한적인 작업공간 이동 및 점검 시 떨어지는 사고 위험", action: "이동 경로 안전난간 설치 및 안전모 착용", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 3, afterPhoto: null },
{ id: 8, work: "여객운송", hazard: "운송수단의 운행 시 제한적인 작업공간의 이동 및 점검 시 아래로 떨어지는 사고 위험", action: "이동 시 추락방지장치 착용 및 2인 1조 작업", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 3, afterPhoto: null },
{ id: 9, work: "여객운송", hazard: "여객석의 운행 시 기계실 등의 점검에 따른 기계 가동음에 노출되어 난청 발생 위험", action: "점검 시 귀마개 착용 및 소음 측정 실시", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 2, afterPhoto: null },
{ id: 10, work: "여객운송", hazard: "운송수단의 운행 시 틈틈이로 전신 진동 등으로 근무자 스트레스, 피로도 증가 위험", action: "작업시간 조정 및 휴게시설 마련", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 1, afterPhoto: null },
{ id: 11, work: "여객운송", hazard: "승객의 안전을 위하여 운행 시 정기적인 점검 등으로 기후(한랭/고온)에 영향을 받아 안", action: "계절별 적정 복장 및 기상 상황에 맞춘 점검시간 조정", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 2, afterPhoto: null },
{ id: 12, work: "여객운송", hazard: "승객의 안전을 위하여 운행 시 정기적인 점검 등으로 기후(한랭/고온)에 영향을 받아 안", action: "작업복 보급 및 기후 영향 예보에 따른 작업계획 수립", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 1, afterPhoto: null },
{ id: 13, work: "여객운송", hazard: "승객의 이동 통로가 어두울 경우 안전사고 발생 위험", action: "비상등 및 보조등 점검 및 설치", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 2, afterPhoto: null },
{ id: 14, work: "여객운송", hazard: "여객선 등 운송수단의 이동 시 틈틈 등에 의해 넘어질 수 있는 위험", action: "틈 보수 및 안전라인 표시", plannedDate: new Date(), completedDate: new Date(), evaluator: "최담당", riskLevel: 1, afterPhoto: null },
]

const ThreeStep3: React.FC = () => {
const navigate = useNavigate()
const afterRefs = useRef<(HTMLInputElement | null)[]>([])
const [data, setData] = useState<RiskDataRow[]>(initialData)
const [checkedRows, setCheckedRows] = useState<(number | string)[]>([])

const handleDelete = () => {
if (checkedRows.length === 0) return alert("삭제할 항목을 선택하세요")
if (window.confirm("정말 삭제하시겠습니까?")) {
setData(prev => prev.filter(row => !checkedRows.includes(row.id)))
setCheckedRows([])
}
}

const columns: Column<RiskDataRow>[] = [
{ key: "id", label: "번호", minWidth: 50, renderCell: row => <div>{row.id}</div> },
{ key: "work", label: "공정(작업)", minWidth: 60, renderCell: row => <span className="text-[#999999]">{row.work}</span> },
{ key: "hazard", label: "유해위험요인", minWidth: 480, renderCell: row => <span className="text-left text-[#999999]">{row.hazard}</span> },
{ key: "action", label: "감소대책", minWidth: 390, renderCell: r => <EditableTextArea value={r.action} onChange={v => setData(prev => prev.map(x => x.id === r.id ? { ...x, action: v } : x))} /> },
{ key: "plannedDate", label: "개선예정일", minWidth: 90, renderCell: r => <DatePicker selected={r.plannedDate} onChange={d => d && setData(prev => prev.map(x => x.id === r.id ? { ...x, plannedDate: d } : x))} dateFormat="yyyy-MM-dd" className="w-full text-center" /> },
{ key: "completedDate", label: "개선완료일", minWidth: 90, renderCell: r => <DatePicker selected={r.completedDate} onChange={d => d && setData(prev => prev.map(x => x.id === r.id ? { ...x, completedDate: d } : x))} dateFormat="yyyy-MM-dd" className="w-full text-center" /> },
{ key: "evaluator", label: "평가담당자", minWidth: 30, maxWidth: 0, renderCell: r => <EditableTextArea value={r.evaluator} onChange={v => setData(prev => prev.map(x => x.id === r.id ? { ...x, evaluator: v } : x))} /> },
{ key: "riskLevel", label: "위험성 수준판단", minWidth: 180, renderCell: row => (<div className="flex justify-center gap-3">{[3,2,1].map(level => { const color = level === 3 ? "#FF3939" : level === 2 ? "#FFE13E" : "#1EED1E"; const text = level === 3 ? "상" : level === 2 ? "중" : "하"; return (<div key={level} className="flex items-center gap-1 cursor-pointer" onClick={() => setData(prev => prev.map(r => r.id === row.id ? { ...r, riskLevel: level } : r))}><div className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ border: `1px solid ${color}` }}>{row.riskLevel === level && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}</div><span className="text-xs md:text-base font-medium text-[#333639]">{text}({level})</span></div>) })}</div>) },
{ key: "afterPhoto", label: "개선후 사진", minWidth: 100, renderCell: (_r, _col, rowIdx) => <><input type="file" accept="image/*" style={{ display: "none" }} ref={(el: HTMLInputElement | null) => { afterRefs.current[rowIdx] = el }} onChange={e => { const file = e.target.files?.[0]; if (!file) return; const url = URL.createObjectURL(file); setData(prev => prev.map((r, i) => i === rowIdx ? { ...r, afterPhoto: url } : r)) }} /><button type="button" onClick={() => afterRefs.current[rowIdx]?.click()}><Upload size={19} /></button></> }
]

return (
<section className="mypage-content w-full px-3 py-1 bg-[#F8F8F8] flex flex-col min-h-screen">
<StepBar currentStep={2} setCurrentStep={() => {}} />
<div className="flex justify-center w-full">
<div className="border border-[#DDDDDD] bg-white rounded-[13px] p-8 w-full flex flex-col">
<PageTitle>위험성평가 실시(위험성수준 3단계 판단법)</PageTitle>

<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-y-2">
<div className="text-xs sm:text-sm md:text-base md:whitespace-nowrap md:flex-1">
<span className="font-medium">산재업종분류:&nbsp;</span>
<span className="font-normal">
제조업&nbsp;&gt;&nbsp;전기기계기구ㆍ정밀기구ㆍ전자제품제조업&nbsp;&gt;&nbsp;
<span className="inline md:hidden"><br /></span>
기타전기기계기구제조업
</span>
</div>

<div className="flex flex-wrap md:flex-nowrap gap-1 w-full md:w-auto justify-end md:justify-start md:ml-4 shrink-0">
<Button variant="action" onClick={() => alert("엑셀 다운로드")} className="flex items-center gap-1">
<FileDown size={16} />엑셀다운로드
</Button>
<Button variant="action" onClick={() => alert("인쇄")} className="flex items-center gap-1">
<Printer size={16} />인쇄
</Button>
<Button variant="action" onClick={() => alert("임시저장 완료")} className="flex items-center gap-1">
<Save size={16} />임시저장하기
</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1">
<Trash2 size={16} />삭제
</Button>
</div>
</div>

<DataTable<RiskDataRow> columns={columns} data={data} onCheckedChange={setCheckedRows} selectable className="min-w-[600px] md:min-w-auto" />
</div>
</div>

<div className="mt-5 flex justify-between">
<Button variant="secondary" onClick={() => navigate("/risk-assessment/methods/threestep/step2")}>
<ChevronLeft size={18} className="mr-2" />
이전으로
</Button>
<Button variant="secondary" onClick={() => {
if (window.confirm("작성한 평가내용을 저장하시겠습니까?")) {
alert("저장되었습니다")
setTimeout(() => {
navigate("/risk-assessment/list")
}, 1000)
}
}}>
<Save size={18} className="mr-1" />
저장완료
</Button>
</div>
</section>
)
}

export default ThreeStep3