import React, { useState } from "react"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import FilterBar from "@/components/common/base/FilterBar"
import BudgetTable, { BudgetItem } from "@/components/modules/BudgetTable"
import InspectionTable, { InspectionItem } from "@/components/modules/InspectionTable"
import Button from "@/components/common/base/Button"
import { Trash2 } from "lucide-react"
import useFilterBar from "@/hooks/useFilterBar"
import useTableActions from "@/hooks/tableActions"

const TAB_LABELS = ["안전보건 목표 및 추진계획", "안전보건예산"]

const INITIAL_INSP_ITEMS: InspectionItem[] = [
{ id: 1, detailPlan: "정기 위험성평가", q1: true, q2: false, q3: false, q4: false, KPI: "1회/년 이상", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 2, detailPlan: "수시 위험성평가", q1: false, q2: false, q3: false, q4: false, KPI: "수시", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 3, detailPlan: "고위험 개선", q1: false, q2: false, q3: false, q4: false, KPI: "개선이행 100%", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 4, detailPlan: "아차사고수집", q1: false, q2: false, q3: false, q4: false, KPI: "1건/월/인당", department: "안전", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 5, detailPlan: "안전보건교육(정기)", q1: false, q2: false, q3: false, q4: false, KPI: "12시간/반기", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 6, detailPlan: "안전보건교육(관리감독자)", q1: false, q2: false, q3: false, q4: false, KPI: "16시간/반기", department: "안전", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 7, detailPlan: "안전보건교육(특별안전교육)", q1: false, q2: false, q3: false, q4: false, KPI: "16시간/반기(크레인,유해물질취급자)", department: "안전", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 8, detailPlan: "안전보건교육(신규채용시)", q1: false, q2: false, q3: false, q4: false, KPI: "8시간/년간(채용시)", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 9, detailPlan: "안전보건교육(MSDS)", q1: false, q2: false, q3: false, q4: false, KPI: "2시간/년간(유해물질취급자)", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 10, detailPlan: "산업안전보건위원회", q1: false, q2: false, q3: false, q4: false, KPI: "1회/분기", department: "안전", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 11, detailPlan: "소방시설 정기점검", q1: false, q2: false, q3: false, q4: false, KPI: "1회/월", department: "안전", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 12, detailPlan: "합동안전점검", q1: false, q2: false, q3: false, q4: false, KPI: "1회/월", department: "안전", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 13, detailPlan: "일반 건강검진", q1: false, q2: false, q3: false, q4: false, KPI: "관리직1회/2년, 현장직1회/1년", department: "안전", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 14, detailPlan: "특수 건강검진", q1: false, q2: false, q3: false, q4: false, KPI: "1회/년(현장직1회/년)", department: "안전", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 15, detailPlan: "배치전 건강검진", q1: false, q2: false, q3: false, q4: false, KPI: "해당시", department: "안전", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 16, detailPlan: "비상조치훈련", q1: false, q2: false, q3: false, q4: false, KPI: "1회/분기(화재, 누출, 대피, 구조)", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 17, detailPlan: "작업허가서 발부", q1: false, q2: false, q3: false, q4: false, KPI: "단위 작업별", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 18, detailPlan: "TBM 실시", q1: false, q2: false, q3: false, q4: false, KPI: "단위 작업별", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 19, detailPlan: "안전관리제도 운영", q1: false, q2: false, q3: false, q4: false, KPI: "1건/월/인당", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 20, detailPlan: "안전보건 예산 집행", q1: false, q2: false, q3: false, q4: false, KPI: "수립예산 이행", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 21, detailPlan: "성과측정 및 모니터링", q1: false, q2: false, q3: false, q4: false, KPI: "1회/반기", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" },
{ id: 22, detailPlan: "시정조치 이행", q1: false, q2: false, q3: false, q4: false, KPI: "수시", department: "전부서", achievementRate: "", resultRemark: "", entryDate: "" }
]

const INITIAL_BUDGET_ITEMS: BudgetItem[] = [
{ id: 1, year: "2025", itemName: "밀폐공간 진입 안전교육", category: "작업 전 밀폐공간 위험요인 교육", budget: "50000000", spent: "20000000", remaining: "30000000", carryOver: false, attachment: null, author: "김안전", entryDate: "" },
{ id: 2, year: "2025", itemName: "고소작업 장비 점검", category: "안전대 및 보호장비 정기점검 실시", budget: "30000000", spent: "15000000", remaining: "15000000", carryOver: false, attachment: null, author: "이설비", entryDate: "" },
{ id: 3, year: "2025", itemName: "비상대응 시나리오 훈련", category: "전사 비상대응 매뉴얼 체계적 훈련", budget: "25000000", spent: "10000000", remaining: "15000000", carryOver: false, attachment: null, author: "박교육", entryDate: "" },
{ id: 4, year: "2025", itemName: "화학물질 취급 교육", category: "유해물질 안전취급 절차 심화교육", budget: "20000000", spent: "8000000", remaining: "12000000", carryOver: false, attachment: null, author: "최장비", entryDate: "" },
{ id: 5, year: "2025", itemName: "현장 순찰 보안 강화", category: "주간 및 야간 순찰 보안 점검 강화", budget: "15000000", spent: "5000000", remaining: "10000000", carryOver: false, attachment: null, author: "정안전", entryDate: "" }
]

export default function Budget() {
const [activeTab, setActiveTab] = useState<number>(0)
const [inspItems, setInspItems] = useState<InspectionItem[]>(INITIAL_INSP_ITEMS)
const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(INITIAL_BUDGET_ITEMS)
const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])

const { startDate, endDate, setStartDate, setEndDate } = useFilterBar()

const handleInspAdd = () => {
const nextId = Math.max(...inspItems.map(i => i.id), 0) + 1
setInspItems(prev => [...prev, {
id: nextId,
detailPlan: "",
q1: false,
q2: false,
q3: false,
q4: false,
KPI: "",
department: "",
achievementRate: "",
resultRemark: "",
entryDate: new Date().toISOString().slice(0, 10)
}])
}

const handleBudgetAdd = () => {
const nextId = Math.max(...budgetItems.map(i => i.id), 0) + 1
setBudgetItems(prev => [...prev, {
id: nextId,
year: startDate.slice(0, 4) || new Date().getFullYear().toString(),
itemName: "",
category: "",
budget: "0",
spent: "0",
remaining: "0",
carryOver: false,
attachment: null,
author: "",
entryDate: new Date().toISOString().slice(0, 10)
}])
}

const inspActions = useTableActions({
data: inspItems,
checkedIds,
onAdd: handleInspAdd,
onSave: () => {},
onDeleteSuccess: (ids) => setInspItems(prev => prev.filter(item => !ids.includes(item.id))),
saveMessage: "목표 및 추진계획이 저장되었습니다"
})

const budgetActions = useTableActions({
data: budgetItems,
checkedIds,
onAdd: handleBudgetAdd,
onSave: () => {},
onDeleteSuccess: (ids) => setBudgetItems(prev => prev.filter(item => !ids.includes(item.id))),
saveMessage: "안전보건예산이 저장되었습니다"
})

const currentActions = activeTab === 0 ? inspActions : budgetActions
const currentItems = activeTab === 0 ? inspItems : budgetItems

const handleInspChange = (id: number | string, field: keyof Omit<InspectionItem, "id">, value: string | boolean) => {
setInspItems(items => items.map(item => item.id === id ? { ...item, [field]: value } : item))
}

const handleBudgetChange = (id: number | string, field: keyof Omit<BudgetItem, "id" | "year">, value: string | boolean | File) => {
setBudgetItems(items => items.map(item => {
if (item.id !== id) return item
const next = { ...item, [field]: value }
if (field === "budget" || field === "spent") {
const b = parseInt(next.budget.replace(/[^0-9]/g, ""), 10) || 0
const s = parseInt(next.spent.replace(/[^0-9]/g, ""), 10) || 0
next.remaining = Math.max(0, b - s).toString()
if (next.remaining === "0") next.carryOver = false
}
return next
}))
}

return (
<section className="mypage-content w-full bg-white">
<PageTitle>{TAB_LABELS[activeTab]}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={activeTab} onTabClick={setActiveTab} className="mb-6" />

<div className="mb-3">
<FilterBar
startDate={startDate}
endDate={endDate}
onStartDate={setStartDate}
onEndDate={setEndDate}
onSearch={() => {}}
/>
</div>

<div className="flex justify-between items-center mb-3">
<span className="text-gray-600 text-sm">총 {currentItems.length}건</span>
<div className="flex gap-1">
<Button variant="action" onClick={currentActions.handleDelete} className="flex items-center gap-1">
<Trash2 size={16} />삭제
</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
{activeTab === 0 ? (
<InspectionTable items={inspItems} onChangeField={handleInspChange} />
) : (
<BudgetTable items={budgetItems} onChangeField={handleBudgetChange} />
)}
</div>
</section>
)
}