import React from "react"
import DataTable, { Column } from "@/components/common/tables/DataTable"

export type InspectionItem = {
id: number
detailPlan: string
q1: boolean
q2: boolean
q3: boolean
q4: boolean
KPI: string
department: string
achievementRate: string
resultRemark: string
entryDate: string
}

interface Props {
items: InspectionItem[]
onChangeField: (id: number | string, field: keyof Omit<InspectionItem, "id">, value: string | boolean) => void
}

export default function InspectionTable({ items, onChangeField }: Props) {
const columns: Column[] = [
{ key: "detailPlan", label: "목표/세부추진계획", type: "input" },
{ key: "q1", label: "1분기", type: "checkbox" },
{ key: "q2", label: "2분기", type: "checkbox" },
{ key: "q3", label: "3분기", type: "checkbox" },
{ key: "q4", label: "4분기", type: "checkbox" },
{ key: "KPI", label: "성과지표", type: "input" },
{ key: "department", label: "담당부서", type: "input" },
{ key: "achievementRate", label: "달성률%", type: "percent" },
{ key: "resultRemark", label: "실적/부진사유", type: "input" },
{ key: "entryDate", label: "작성일", type: "date" }
]

return (
<DataTable
columns={columns}
data={items}
onInputChange={(id, key, value) => onChangeField(id, key as keyof Omit<InspectionItem, "id">, value)}
onToggleChange={(id, key, value) => onChangeField(id, key as keyof Omit<InspectionItem, "id">, value)}
/>
)
}