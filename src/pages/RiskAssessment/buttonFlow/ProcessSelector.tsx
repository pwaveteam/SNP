import { useState } from 'react'
import { Info } from 'lucide-react'
import DataTable, { Column, DataRow } from '@/components/common/tables/DataTable'
import EditableTextArea from '@/components/common/inputs/EditableTextArea'
import Tooltip from '@/components/common/base/Tooltip'

type ProcessSelectorProps = {
industry: any
selected: any
onSelect: (value: any) => void
}

const initialRows = [
{ id: 1, process: '작업장 정리', description: '내부 청소 작업 시 바닥면의 분진이 재비산되면서 흡입 위험' },
{ id: 2, process: '기계 점검', description: '청소 작업 시 청소 장비 등의 가동음에 의한 소음에 노출되어 난청 발생 위험' },
{ id: 3, process: '배선 정비', description: '운행 전 청소 작업 시 반복해서 청소 작업을 수행하여 근골격계질환 위험' },
{ id: 4, process: '폐기물 처리', description: '청소 작업 시 청소 장비 등에 의한 걸림으로 넘어짐 위험' },
{ id: 5, process: '설비 유지보수', description: '협소한 장소 및 구성된 곳 등 제한된 공간의 점검 시 충돌 사고 위험' },
{ id: 6, process: '승객 유도', description: '승·하선 및 이동 시 틈틈이 의한 넘어짐 위험' },
{ id: 7, process: '차량 이동', description: '운송수단의 운행 시 제한적인 작업공간 이동 및 점검 시 떨어지는 사고 위험' },
{ id: 8, process: '외부 점검', description: '운송수단의 운행 시 제한적인 작업공간의 이동 및 점검 시 아래로 떨어지는 사고 위험' },
{ id: 9, process: '기계실 점검', description: '여객석의 운행 시 기계실 등의 점검에 따른 기계 가동음에 노출되어 난청 발생 위험' },
{ id: 10, process: '장거리 운행', description: '운송수단의 운행 시 틈틈이로 전신 진동 등으로 근무자 스트레스, 피로도 증가 위험' }
]

export default function ProcessSelector({ industry, selected, onSelect }: ProcessSelectorProps) {
const [rows, setRows] = useState(initialRows)
const handleChange = (id: number, val: string) => setRows(prev => prev.map(row => (row.id === id ? { ...row, description: val } : row)))

const columns: Column[] = [
{ key: 'process', label: '공정(작업)', minWidth: 120, align: 'center' },
{ key: 'description', label: (
<div className="inline-flex items-center justify-center gap-1">
<span className="text-xs sm:text-xs md:text-sm">공정 설명</span>
<Tooltip content="사업장에서 일이 진척되는 과정이나 작업단계에서 어떤 일을 하는지 간단하게 작성합니다.">
<Info className="w-4 h-4 text-gray-400 cursor-pointer" />
</Tooltip>
</div>
), minWidth: 300, align: 'left', renderCell: row => (
<EditableTextArea
value={row.description as string}
onChange={val => handleChange(row.id as number, val)}
maxLength={200}
rows={2}
placeholder="공정 설명을 입력하세요"
className="text-xs sm:text-xs md:text-sm"
/>
)}
]

const data: DataRow[] = rows.map(row => ({ id: row.id, process: row.process, description: row.description }))

return (
<div className="space-y-4 text-xs sm:text-xs md:text-sm">
<DataTable columns={columns} data={data} selectable />
</div>
)
}