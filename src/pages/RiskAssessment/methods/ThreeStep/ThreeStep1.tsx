import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import StepBar from "@/components/modules/StepBar"
import DataTable, { Column } from "@/components/common/tables/DataTable"
import Button from "@/components/common/base/Button"
import EditableTextArea from "@/components/common/inputs/EditableTextArea"
import PageTitle from "@/components/common/base/PageTitle"
import { ChevronRight, Upload, Save, Trash2, FolderSearch, CirclePlus } from "lucide-react"
import StepSelector from "@/pages/RiskAssessment/buttonFlow/StepSelector"
import NearMissImporter from "@/pages/RiskAssessment/buttonFlow/NearMissImporter"
import CauseImporter from "@/pages/RiskAssessment/buttonFlow/CauseImporter"

type EditableRow = {
id: number
work: string
hazard: string
law: string
action: string
proof?: File | null
}

const columns: Column[] = [
{ key: "work", label: "공정(작업)", minWidth: 50, align: "left", titleKey: "work" },
{ key: "hazard", label: "유해위험요인", minWidth: 600, align: "left", titleKey: "hazard" },
{ key: "law", label: "관련법규", minWidth: 230, align: "left", titleKey: "law" },
{ key: "action", label: "현재 안전보건조치", minWidth: 650, align: "left", titleKey: "action" },
{ key: "proof", label: "첨부파일", minWidth: 80, align: "center" }
]

const initialData: EditableRow[] = [
{ id: 1, work: "운송준비", hazard: "내부 청소 작업 시 바닥면의 분진이 재비산되면서 흡입 위험", law: "산업안전보건법 제32조(보호구의 지급 등)", action: "- 보호구 지급 및 착용", proof: null },
{ id: 2, work: "운송준비", hazard: "청소 작업 시 소음에 노출되어 난청 발생 위험", law: "산업안전보건법 제32조(보호구의 지급 등)", action: "- 보호구 지급 및 착용", proof: null },
{ id: 3, work: "운송준비", hazard: "반복 청소 작업으로 근골격계질환 위험", law: "산업안전보건법 제661조(유해성 등의 주지)", action: "- 유해요인 교육\n- 올바른 자세\n- 대체요령", proof: null },
{ id: 4, work: "운송준비", hazard: "청소 장비에 걸려 넘어짐 위험", law: "산업안전보건법 제3조(전도의 방지)", action: "- 정리정돈\n- 전도예방조치", proof: null },
{ id: 5, work: "운송준비", hazard: "제한된 공간 점검 시 충돌 위험", law: "산업안전보건법 제3조(전도의 방지)", action: "- 정리정돈\n- 전도예방조치", proof: null },
{ id: 6, work: "여객운송", hazard: "승·하선 시 넘어짐 위험", law: "산업안전보건법 제23조(가설통로의 구조)", action: "- 가설통로 설치\n- 안전난간 설치", proof: null },
{ id: 7, work: "여객운송", hazard: "점검 시 낙하 위험", law: "산업안전보건법 제47조(구명구 등)", action: "- 구명장구 비치", proof: null },
{ id: 8, work: "여객운송", hazard: "작업 공간 점검 시 낙하 위험", law: "산업안전보건법 제113조(안전난간 구조 및 설치요건)", action: "- 안전난간\n- 발끝막이판", proof: null },
{ id: 9, work: "여객운송", hazard: "기계 가동음에 의한 난청 위험", law: "산업안전보건법 제516조(청력보호구의 지급 등)", action: "- 청력보호구 지급", proof: null },
{ id: 10, work: "여객운송", hazard: "진동으로 인한 피로 증가 위험", law: "산업안전보건법 제79조(휴게시설)", action: "- 휴게시설 설치", proof: null },
{ id: 11, work: "여객운송", hazard: "정기 점검 시 기후 영향 위험", law: "산업안전보건법 제32조(보호구의 지급 등)", action: "- 보호구 지급 및 착용", proof: null },
{ id: 12, work: "여객운송", hazard: "정기 점검 시 기후 영향 위험", law: "산업안전보건법 제37조(작업 및 감장 작업 중지)", action: "- 작업 중지", proof: null },
{ id: 13, work: "여객운송", hazard: "통로 조명 부족으로 인한 사고 위험", law: "산업안전보건법 제21조(통로의 조명)", action: "- 차량 조명 확보\n- 조명 설치", proof: null },
{ id: 14, work: "여객운송", hazard: "이동 중 넘어짐 위험", law: "산업안전보건법 제3조(전도의 방지)", action: "- 정리정돈\n- 전도예방조치", proof: null }
]

export default function ThreeStep1() {
const navigate = useNavigate()
const [checkedRows, setCheckedRows] = useState<(number | string)[]>([])
const [data, setData] = useState<EditableRow[]>(initialData)
const [modalOpen, setModalOpen] = useState(false)
const [nearMissOpen, setNearMissOpen] = useState(false)
const [causeOpen, setCauseOpen] = useState(false)

const handleCellChange = (id: number, key: keyof Omit<EditableRow, "id">, val: string | File | null) => {
if (key === "action" && typeof val === "string") {
const lines = val.split("\n")
const updatedLines = lines.map((line, i) => {
if (i === 0) return line.startsWith("-") ? line : `- ${line}`
if (lines[i - 1].startsWith("-") && !line.startsWith("-")) return `- ${line}`
return line
})
val = updatedLines.join("\n")
}
if (key === "work" && typeof val === "string") {
setData(prev => prev.map(row => row.id === id ? { ...row, work: val, law: "" } : row))
} else {
setData(prev => prev.map(row => row.id === id ? { ...row, [key]: val } : row))
}
}

const dataWithEditableCells = data.map(row => ({
...row,
work: <EditableTextArea value={row.work} onChange={val => handleCellChange(row.id, "work", val)} placeholder="공정(작업) 입력" />,
hazard: <EditableTextArea value={row.hazard} onChange={val => handleCellChange(row.id, "hazard", val)} placeholder="유해위험요인 입력" />,
law: <span title={row.law}>{row.law}</span>,
action: <EditableTextArea value={row.action} onChange={val => handleCellChange(row.id, "action", val)} placeholder="현재 안전보건조치 입력" />,
proof: <label className="flex justify-center items-center cursor-pointer" role="button" tabIndex={0}><input type="file" className="hidden" onChange={e => handleCellChange(row.id, "proof", e.target.files?.[0] || null)} accept="image/*" /><Upload size={19} strokeWidth={2} /></label>
}))

const addRow = () => {
setData(prev => [...prev, { id: prev.length ? Math.max(...prev.map(r => r.id)) + 1 : 1, work: "", hazard: "", law: "", action: "", proof: null }])
}

const handleDelete = () => {
if (!checkedRows.length) {
alert("삭제할 항목을 선택하세요")
return
}
if (window.confirm("정말 삭제하시겠습니까?")) {
setData(prev => prev.filter(row => !checkedRows.includes(row.id)))
setCheckedRows([])
}
}

return (
<section className="mypage-content w-full px-3 py-1 bg-[#F8F8F8] flex flex-col min-h-screen">
<StepBar currentStep={0} />
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
<Button variant="action" onClick={() => setModalOpen(true)} className="flex items-center gap-1">
<FolderSearch size={16} /> 업종선택
</Button>
<Button variant="action" onClick={() => setNearMissOpen(true)} className="flex items-center gap-1">
<CirclePlus size={16} /> 아차사고 추가
</Button>
<Button variant="action" onClick={() => setCauseOpen(true)} className="flex items-center gap-1">
<CirclePlus size={16} /> 기인물요인 추가
</Button>
<Button variant="action" onClick={() => alert("임시저장 완료")} className="flex items-center gap-1">
<Save size={16} /> 임시저장하기
</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1">
<Trash2 size={16} /> 삭제
</Button>
</div>
</div>

<DataTable columns={columns} data={dataWithEditableCells} onCheckedChange={setCheckedRows} selectable className="flex-1 min-w-[600px] md:min-w-auto text-[15px] font-medium text-[#333639] text-left" />
<div className="mt-1 flex justify-start">
<Button variant="rowAdd" onClick={addRow} className="flex items-center gap-1 text-sm">+ 직접입력</Button>
</div>
</div>

</div>
<div className="mt-5 flex justify-end">
<Button variant="secondary" onClick={() => navigate("/risk-assessment/methods/threestep/step2")} className="py-3">
저장 후 다음으로<ChevronRight size={18} className="ml-2" />
</Button>
</div>
{modalOpen && <StepSelector isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={() => setModalOpen(false)} />}
{nearMissOpen && <NearMissImporter isOpen={nearMissOpen} onClose={() => setNearMissOpen(false)} />}
{causeOpen && <CauseImporter isOpen={causeOpen} onClose={() => setCauseOpen(false)} />}
</section>
)
}