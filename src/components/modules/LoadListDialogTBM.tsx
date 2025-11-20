import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"

interface Item {
id: string | number
registrationDate: string
siteName: string
tbmName: string
attendeeCount: number
attendeeList: string
}

interface LoadListDialogProps {
isOpen: boolean
items: Item[]
selectedId?: string | number | null
onChangeSelected: (selected: string | number | null) => void
onClose: () => void
}

export default function LoadListDialogTBM({
isOpen,
items,
selectedId = null,
onChangeSelected,
onClose,
}: LoadListDialogProps) {
const [localSelected, setLocalSelected] = useState<string | number | null>(null)

useEffect(() => {
if (!isOpen) return
setLocalSelected(selectedId)
}, [isOpen, selectedId])

const onSelect = (id: string | number) => {
if (localSelected === id) return
setLocalSelected(id)
onChangeSelected(id)
onClose()
}

if (!isOpen) return null

const columns: Column[] = [
{ key: "registrationDate", label: "등록일", minWidth: 120 },
{ key: "siteName", label: "현장명", minWidth: 150 },
{ key: "tbmName", label: "TBM명", minWidth: 150 },
{ key: "attendeeCount", label: "참석수", minWidth: 80 },
{ key: "attendeeList", label: "참석자명단", minWidth: 250 },
]

const data: DataRow[] = items.map(item => ({
id: item.id,
registrationDate: item.registrationDate,
siteName: item.siteName,
tbmName: item.tbmName,
attendeeCount: item.attendeeCount,
attendeeList: item.attendeeList,
}))

return (
<>
<style>{`.no-checkbox th:first-child, .no-checkbox td:first-child { display: none; }`}</style>
<div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
<div onClick={e => e.stopPropagation()} className="fixed top-1/6 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-[16px] min-w-[700px] max-h-[90vh] overflow-auto shadow-lg z-50 flex flex-col">
<button type="button" onClick={onClose} aria-label="닫기" className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"><X size={19} /></button>
<h3 className="text-xl font-bold mb-4 text-gray-900">TBM 내역 불러오기</h3>
<div className="text-gray-600 mb-4 text-sm">* 이전에 저장한 TBM 내역을 불러올 수 있습니다.</div>
<div className="flex-grow overflow-y-auto no-checkbox">
<DataTable
columns={columns}
data={data}
selectable={false}
renderCell={(row, col) => {
const cellContent = row[col.key]
const isSelected = localSelected === row.id
return (
<span
onClick={() => onSelect(row.id)}
className={`block px-2 py-1 cursor-pointer transition-colors duration-200 ${isSelected ? "text-white bg-[#1C56D3] rounded" : "hover:text-[#1C56D3]"}`}
style={{ fontSize: 15 }}
>
{cellContent}
</span>
)
}}
/>
</div>
</div>
</>
)
}