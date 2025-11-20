import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import Checkbox from "@/components/common/base/Checkbox"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import RiskLevelTable3x3 from "@/components/modules/RiskLevelTable3x3"
import RiskLevelTable5x4 from "@/components/modules/RiskLevelTable5x4"
import Spinner from "@/components/common/base/Spinner"

type Props = { onClose: () => void }

const PreEvaluation: React.FC<Props> = ({ onClose }) => {
const navigate = useNavigate()
const [checked, setChecked] = useState<number[]>([])
const [isLoading, setIsLoading] = useState(false)
const [formValues, setFormValues] = useState({ riskAssessmentName: "", evaluationType: "", evaluationMethod: "", scale: "", regulationFile: null as File | null })

const items = [
{ no: 1, content: ["다음 항목이 포함된 위험성평가 실시 규정 작성", "평가의 목적 및 방법", "평가담당자 및 책임자의 역할", "평가기준 및 절차", "근로자에 대한 참여·공유방법 및 유의사항", "결과의 기록·보존"] },
{ no: 2, content: ["위험성의 수준과 그 수준을 판단하는 기준", "허용 가능한 위험성의 수준 (법에서 정한 기준 이상으로 위험성의 수준을 정하여야 함)"] },
{ no: 3, content: ["안전보건정보 사전 조사", "기계·기구·설비 사양서 MSDS 유해·위험요인 정보", "공정흐름과 작업 환경 정보", "법 제63조 작업 여부와 장소 정보", "재해사례·통계 정보", "작업환경측정결과·건강진단 결과", "그 밖의 참고자료"] },
]

const handleCheck = (id: number) => { setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]) }

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
const { name, value, type } = e.target
if (type === "file") {
const file = (e.target as HTMLInputElement).files?.[0] ?? null
setFormValues(prev => ({ ...prev, [name]: file }))
} else {
setFormValues(prev => ({ ...prev, [name]: value }))
}
}

const columns: Column[] = [
{ key: "no", label: "항목", minWidth: 60 },
{ key: "content", label: "내용", minWidth: 300 },
{ key: "check", label: "✓", minWidth: 80, renderCell: row => (<Checkbox checked={checked.includes(row.id as number)} onChange={() => handleCheck(row.id as number)} />) },
]

const data: DataRow[] = items.map(item => ({
id: item.no,
no: item.no,
content: (
<div className="py-3">
{item.content.map((line, i) => (
<p key={i} className="text-sm text-left pl-1">{line}</p>
))}
</div>
),
check: null,
}))      

const baseFields: Field[] = [
{ label: "위험성평가명", name: "riskAssessmentName", type: "text", required: true, placeholder: "위험성평가명 입력" },
{ label: "평가구분", name: "evaluationType", type: "select", required: true, options: [ { value: "최초평가", label: "최초평가" }, { value: "정기평가", label: "정기평가" }, { value: "수시평가", label: "수시평가" }, { value: "상시평가", label: "상시평가" } ] },
{ label: "평가방법", name: "evaluationMethod", type: "select", required: true, options: [ { value: "빈도·강도법", label: "빈도·강도법" }, { value: "위험성수준 3단계 판단법", label: "위험성수준 3단계 판단법" }, { value: "화학물질 평가법", label: "화학물질 평가법" }, { value: "체크리스트법", label: "체크리스트법" } ] },
{ label: "실시규정", name: "regulationFile", type: "fileUpload", required: true },
]

const additionalFields: Field[] = formValues.evaluationMethod === "빈도·강도법" ? [{ label: "평가척도", name: "scale", type: "radio", options: [ { value: "3x3", label: "3×3" }, { value: "5x4", label: "5×4" } ] }] : []

const fields: Field[] = [...baseFields.slice(0, 3), ...additionalFields, ...baseFields.slice(3)]

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white w-full max-w-[860px] rounded-xl p-6 m-4 shadow-lg pre-checklist overflow-y-auto max-h-[90vh]">
<style>{`.pre-checklist .data-table th:first-child,.pre-checklist .data-table td:first-child {display: none;}.formscreen-reset table th {background-color: #EFEFF3 !important;}`}</style>
<h3 className="font-semibold text-lg mb-1">위험성평가 사전 체크리스트</h3>
<div className="data-table"><DataTable columns={columns} data={data} selectable /></div>
<div className="flex justify-end gap-1 mt-1">
<Button variant="secondaryOutline">안전보건정보 조사표 내려받기</Button>
<Button variant="secondaryOutline">위험성평가 실시규정 예시 내려받기</Button>
</div>
<div className="mt-6">
<h3 className="font-semibold text-lg mb-1">사전평가정보 입력</h3>
<div className="formscreen-reset">
<FormScreen fields={fields} values={{ ...formValues, regulationFile: formValues.regulationFile?.name || "" }} onChange={handleChange} onClose={onClose} onSave={() => {}} />
{formValues.evaluationMethod === "빈도·강도법" && formValues.scale === "3x3" && (<RiskLevelTable3x3 />)}
{formValues.evaluationMethod === "빈도·강도법" && formValues.scale === "5x4" && (<RiskLevelTable5x4 />)}
</div>
</div>
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline" onClick={onClose}>닫기</Button>

{isLoading && (
<div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
<Spinner />
</div>
)}

<Button
variant="primary"
disabled={isLoading}
onClick={async () => {
if (!formValues.evaluationMethod) {
alert("평가방법을 선택해주세요.")
return
}
setIsLoading(true)
await new Promise((r) => setTimeout(r, 1500))
await onClose()
switch (formValues.evaluationMethod) {
case "빈도·강도법":
navigate("/risk-assessment/methods/frequency/step1")
break
case "체크리스트법":
alert("준비중입니다.")
setIsLoading(false)
return
case "위험성수준 3단계 판단법":
navigate("/risk-assessment/methods/threestep/step1")
break
case "화학물질 평가법":
navigate("/risk-assessment/methods/chemical/step1")
break
}
}}
>
위험성평가 실시
</Button>

</div>
</div>
</div>
)
}

export default PreEvaluation