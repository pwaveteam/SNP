import React from "react"
import DataTable, { Column } from "@/components/common/tables/DataTable"

export type BudgetItem = {
id: number
year: string
itemName: string
category: string
budget: string
spent: string
remaining: string
carryOver: boolean
attachment: File | null
author: string
entryDate: string
}

interface Props {
items: BudgetItem[]
onChangeField: (id: string | number, field: keyof Omit<BudgetItem, "id" | "year">, value: string | boolean | File) => void
}

export default function BudgetTable({ items, onChangeField }: Props) {
const columns: Column[] = [
{ key: "itemName", label: "항목명", type: "input" },
{ key: "category", label: "구분", type: "input", maxWidth: 250 },
{ key: "budget", label: "예산액", type: "input", maxWidth: 110 },
{ key: "spent", label: "집행액", type: "input", maxWidth: 110 },
{ key: "remaining", label: "남은예산", type: "input", maxWidth: 110 },
{ key: "carryOver", label: "이월여부", type: "toggle" },
{ key: "attachment", label: "첨부파일", type: "upload" },
{ key: "author", label: "작성자", type: "input", maxWidth: 80 },
{ key: "entryDate", label: "작성일", type: "date" }
]

return (
<DataTable
columns={columns}
data={items}
onInputChange={(id, key, value) => onChangeField(id, key as any, value)}
onToggleChange={(id, key, value) => onChangeField(id, key as any, value)}
onUploadChange={(id, key, file) => onChangeField(id, key as any, file)}
/>
)
}