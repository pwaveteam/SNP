import React, { useState } from "react"
import { Download } from "lucide-react"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import Checkbox from "@/components/common/base/Checkbox"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import PageTitle from "@/components/common/base/PageTitle"

type Props = { isOpen: boolean; onClose: () => void; onSubmit?: () => void }

type ChecklistSection = { title: string; items?: string[]; type?: "table" | "form"; className?: string; downloadKey?: string }

const checklistData: ChecklistSection[] = [
{ title: "물질 유해성", downloadKey: "hazardous-substance", items: [ "현재 취급하고 있는 물질보다 독성이 적은 물질(노출 기준 수치가 높은)로 대체 가능한가?", "현재 물질의 물리적 성질을 고려하고 있다면 비발염성 물질로 대체가 가능한가?", "현재 유해물질 취급 공정의 폐쇄가 가능한가?" ] },
{ title: "물질노출 가능성", downloadKey: "exposure-possibility", items: [ "현재 사용하고 있는 화학물질의 사용량을 줄일 수 있는가?", "물질 또는 교체된 공정의 누출 가능성이 줄어들었는가?", "대상 유해물질을 공정 내 밀폐화가 가능한가?", "유해물질 취급 시점에서의 재질이적이 최소화가 가능한가?", "국소배기장치/후드 설치를 통한 유해물질 노출이 감소가 가능한가?", "기존의 국소배기장치/후드 배출점보다 배출점의 설치위치를 좀 더 가까이 설치 가능한가?", "직업환경 관리자의 정기적인 점검이 잘 이루어지고 있는가?" ] },
{ title: "작업방법", downloadKey: "work-method", items: [ "유해물질 취급 공정을 인근 공정 및 작업장소와 격리하여 작업할 수 있는가?", "유해물질 취급 공정과 인근 작업장소 사이의 공기 이동을 차단하기 위한 차단벽 설치가 가능한가?", "현재 유해물질 취급 작업을 자동화 또는 반자동화로 공정 변경이 가능한가?", "유해물질 용기를 별도의 저장장소에 보관 가능한가?", "유해물질 취급전 적절히 점검이 되고 있는가?" ] },
{ title: "관리방안", downloadKey: "management-plan", items: [ "특수건강검진을 정기적으로 실시하고 있는가?", "작업환경측정을 정기적으로 실시하고 있는가?", "해당 화학물질에 대해 근로자 교육을 실시하는가?", "개인보호용품 등을 보호구가 적정하게 지급되는가?", "근로자 작업 중 호흡을 보호구를 착용하고 있는가?" ] },
{ title: "기타 개선내역", type: "form" }
]

const etcFields: Field[] = [
{ label: "1. 작업환경 관리실태 평가내용", name: "evaluationDetail", type: "text", placeholder: "내용을 입력하세요" },
{ label: "2. 작업환경 개선대책", name: "improvementPlan", type: "textarea", placeholder: "내용을 입력하세요" }
]

export default function WorkplaceChecklistModal({ isOpen, onClose, onSubmit }: Props) {
const [checkedIds, setCheckedIds] = useState<(string | number)[]>([])
const [formValues, setFormValues] = useState({ evaluationDetail: "", improvementPlan: "" })

const handleDownloadExample = (key: string) => {
const fileMap: Record<string, string> = {
"hazardous-substance": "/downloads/평가기준예시_물질유해성.pdf",
"exposure-possibility": "/downloads/평가기준예시_물질노출가능성.pdf",
"work-method": "/downloads/평가기준예시_작업방법.pdf",
"management-plan": "/downloads/평가기준예시_관리방안.pdf"
}
const fileUrl = fileMap[key]
if (fileUrl) {
const link = document.createElement("a")
link.href = fileUrl
link.download = decodeURIComponent(fileUrl.split("/").pop() || "평가기준예시.pdf")
document.body.appendChild(link)
link.click()
document.body.removeChild(link)
}
}

if (!isOpen) return null

return (
<>
<style>{`.no-checkbox th:first-child, .no-checkbox td:first-child { display: none; }`}</style>
<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
<div className="w-full max-w-[960px] bg-white rounded-[13px] border border-[#E5E5E5] shadow-md overflow-hidden">
<PageTitle className="px-6 pt-6">직업환경 관리상태 체크리스트</PageTitle>
<div className="max-h-[70vh] overflow-y-auto text-[#111] px-6 py-6 space-y-8">
{checklistData.map((section, sIdx) => {
const ActionButton = section.downloadKey && (
<Button variant="secondaryOutline" className="min-w-[100px] h-[30px] text-xs gap-1" onClick={() => handleDownloadExample(section.downloadKey!)}>
<Download size={16} /> 평가기준예시
</Button>
)
if (section.type === "form") {
return (
<div key={sIdx}>
<div className="flex justify-between items-center mb-1">
<PageTitle className="text-base sm:text-lg">{section.title}</PageTitle>
</div>
<div className="mt-1">
<FormScreen className="text-xs sm:text-sm" fields={etcFields} values={formValues} onChange={e => setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }))} onClose={onClose} onSave={onSubmit || (() => {})} isModal notifyEnabled={false} />
</div>
</div>
)
}
const data: DataRow[] = (section.items || []).map((text, i) => ({ id: `${sIdx}-${i}`, text, index: i + 1 }))
const columns: Column[] = [
{ key: "rowNum", label: "번호", minWidth: 30, align: "center", renderCell: row => <span>{row.index}</span> },
{ key: "text", label: "작업환경 관리상태 평가 내용", minWidth: 300, align: "left" },
{ key: "check", label: "✓", minWidth: 30, align: "center", renderCell: row => <Checkbox checked={checkedIds.includes(row.id)} onChange={() => setCheckedIds(prev => prev.includes(row.id) ? prev.filter(id => id !== row.id) : [...prev, row.id])} /> }
]
return (
<div key={sIdx}>
<div className="flex justify-between items-center mb-1">
<PageTitle className="text-base sm:text-lg">{section.title}</PageTitle>
{ActionButton}
</div>
<div className="no-checkbox">
<DataTable columns={columns} data={data} />
</div>
</div>
)
})}
</div>
<div className="flex justify-center gap-1 px-6 py-4">
<Button variant="primaryOutline" onClick={onClose} className="min-w-[80px] h-[36px] text-sm">닫기</Button>
<Button variant="primary" onClick={onSubmit} className="min-w-[80px] h-[36px] text-sm">확인</Button>
</div>
</div>
</div>
</>
)
}