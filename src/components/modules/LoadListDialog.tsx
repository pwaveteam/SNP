import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"

interface Item {
id: string | number
name: string
}

interface LoadListDialogProps {
isOpen: boolean
items: Item[]
selectedId?: string | number | null
selectedIds?: (string | number)[]
onChangeSelected: (selected: (string | number)[] | string | number | null) => void
onClose: () => void
singleSelect?: boolean
}

export default function LoadListDialog({
isOpen,
items,
selectedId = null,
selectedIds = [],
onChangeSelected,
onClose,
singleSelect = false,
}: LoadListDialogProps) {
const [localSelected, setLocalSelected] = useState<(string | number)[]>([])
const [localSelectedSingle, setLocalSelectedSingle] = useState<string | number | null>(null)

useEffect(() => {
if (!isOpen) return
if (singleSelect) setLocalSelectedSingle(selectedId)
else setLocalSelected(selectedIds)
}, [isOpen, selectedId, selectedIds, singleSelect])

const toggleSelect = (id: string | number) => {
if (singleSelect) {
setLocalSelectedSingle(id)
onChangeSelected(id)
onClose()
} else {
setLocalSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
}
}

if (!isOpen) return null

const columns: Column[] = [
{ key: "id", label: "등록일", minWidth: 150 },
{ key: "title", label: "제목", minWidth: 400 },
]

const sampleDates = ["25/05/26 19:45", "25/05/26 19:46", "25/05/26 19:47", "25/05/26 19:48", "25/05/26 19:49"]
const data: DataRow[] = items.map((item, idx) => ({ id: sampleDates[idx] ?? sampleDates[0], title: item.name }))

return (
<>
<div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
<div onClick={e => e.stopPropagation()} className="fixed top-1/6 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-[16px] min-w-[700px] max-h-[90vh] overflow-auto shadow-lg z-50 flex flex-col">
<button type="button" onClick={onClose} aria-label="닫기" className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"><X size={19} /></button>
<h3 className="text-xl font-bold mb-4 text-gray-900">위험성평가표 불러오기</h3>
<div className="text-red-600 text-right mb-4 text-sm">* 완료된, '승인완료' 상태의 위험성평가표를 불러옵니다.</div>
<style>{`.no-checkbox th:first-child, .no-checkbox td:first-child { display: none; }`}</style>
<div className="flex-grow overflow-y-auto no-checkbox">
<DataTable
columns={columns}
data={data}
selectable={false}
renderCell={(row, col) => (
<span onClick={() => toggleSelect(col.key === "title" ? String(row.title) : row.id)} className="block px-2 py-1 transition-colors duration-200 hover:text-[#1C56D3] cursor-pointer" style={{ fontSize: 15 }}>
{col.key === "id" ? row.id : row[col.key]}
</span>
)}
/>
</div>
</div>
</>
)
}