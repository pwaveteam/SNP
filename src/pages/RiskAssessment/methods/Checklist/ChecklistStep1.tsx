import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import StepBar from "@/components/modules/StepBar"
import DataTable from "@/components/common/tables/DataTable"
import Button from "@/components/common/base/Button"
import EditableTextArea from "@/components/common/inputs/EditableTextArea"
import PageTitle from "@/components/common/base/PageTitle"
import { ChevronRight, Upload, Save, Trash2, FolderSearch, CirclePlus } from "lucide-react"

type EditableRow = {
id: number
task: string
hazard: string
law: string
action: string
proof?: File | null
}

const columns = [
{ key: "task", label: "작업내용", minWidth: 120 },
{ key: "hazard", label: "유해위험요인", minWidth: 600 },
{ key: "law", label: "관련법규", minWidth: 230 },
{ key: "action", label: "안전보건조치", minWidth: 650 },
{ key: "proof", label: "첨부파일", minWidth: 80 },
]

const initialData: EditableRow[] = [
{
id: 1,
task: "고소작업대 점검",
hazard: "작업 중 추락 위험",
law: "산업안전보건법 제34조(추락방지 조치)",
action: "- 안전대 착용\n- 작업 전 장비 점검",
proof: null,
},
{
id: 2,
task: "사다리 이용",
hazard: "사다리 미끄러짐으로 인한 전도",
law: "산업안전보건기준에 관한 규칙 제38조",
action: "- 미끄럼 방지 고무 부착\n- 수평 유지 확인",
proof: null,
},
]

export default function ChecklistStep1() {
const [checkedRows, setCheckedRows] = useState<(number | string)[]>([])
const [currentStep] = useState(0)
const [data, setData] = useState<EditableRow[]>(initialData)
const navigate = useNavigate()

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
setData(prev => prev.map(row => (row.id === id ? { ...row, [key]: val } : row)))
}

const dataWithEditableCells = data.map(row => ({
...row,
task: (
<EditableTextArea value={row.task} onChange={val => handleCellChange(row.id, "task", val)} placeholder="작업내용 입력" />
),
hazard: (
<EditableTextArea value={row.hazard} onChange={val => handleCellChange(row.id, "hazard", val)} placeholder="유해위험요인 입력" />
),
law: <span>{row.law}</span>,
action: (
<EditableTextArea value={row.action} onChange={val => handleCellChange(row.id, "action", val)} placeholder="조치내용 입력" />
),
proof: (
<label className="flex justify-center items-center cursor-pointer" role="button" tabIndex={0}>
<input type="file" className="hidden" onChange={e => handleCellChange(row.id, "proof", e.target.files?.[0] || null)} accept="image/*" />
<Upload size={19} strokeWidth={2} />
</label>
),
}))

const addRow = () => {
setData(prev => [
...prev,
{ id: prev.length ? Math.max(...prev.map(r => r.id)) + 1 : 1, task: "", hazard: "", law: "", action: "", proof: null },
])
}

const handleDelete = () => {
if (checkedRows.length === 0) {
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
<StepBar currentStep={currentStep} />
<div className="flex justify-center w-full">
<div className="border border-[#DDDDDD] bg-white rounded-[13px] p-5 w-full flex flex-col">
<PageTitle>체크리스트 기반 위험요인 입력</PageTitle>
<div className="flex items-center justify-between mt-1 mb-1">
<div className="text-base">
<span className="font-medium">작업 구분: </span>
<span className="font-normal">일반 작업 / 고소작업 / 전기작업 등</span>
</div>
<div className="flex gap-1">
<Button variant="action" onClick={() => alert("체크리스트 항목 선택")} className="flex items-center gap-1">
<FolderSearch size={16} /> 항목 선택
</Button>
<Button variant="action" onClick={() => alert("기준자료 추가")} className="flex items-center gap-1">
<CirclePlus size={16} /> 기준자료 추가
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
<Button variant="rowAdd" onClick={addRow} />
</div>
</div>
</div>
<div className="mt-5 flex justify-end">
<Button variant="secondary" icon={<ChevronRight size={18} />} onClick={() => navigate("/risk-assessment/methods/checklist/step2")}>
저장 후 다음으로
</Button>
</div>
</section>
)
}
