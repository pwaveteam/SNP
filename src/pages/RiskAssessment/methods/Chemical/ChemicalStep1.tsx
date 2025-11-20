import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import DataTable from "@/components/common/tables/DataTable"
import Button from "@/components/common/base/Button"
import EditableTextArea from "@/components/common/inputs/EditableTextArea"
import PageTitle from "@/components/common/base/PageTitle"
import ChemicalRegister from "./ChemicalRegister"
import FilterBar from "@/components/common/base/FilterBar"
import { Eye, FileEdit, Save, Trash2, CirclePlus, Upload } from "lucide-react"
import ChemicalAction from "./ChemicalAction"

type EditableRow = { id: number; process: string; product: string; substance: string; exposure: string; toxicity: string; risk: number; action: string; image?: File | null }

const columns = [
{ key: "id", label: "번호", minWidth: 50 },
{ key: "process", label: "공정명", minWidth: 80, maxWidth: 65 },
{ key: "product", label: "제품명", minWidth: 100 },
{ key: "substance", label: "화학물질명", minWidth: 160 },
{ key: "exposure", label: "노출수준(가능성)", minWidth: 300 },
{ key: "toxicity", label: "유해성(중대성)", minWidth: 300 },
{ key: "risk", label: "위험성 수준판단", minWidth: 180 },
{ key: "action", label: "감소대책", minWidth: 90 },
{ key: "image", label: "이미지", minWidth: 60 },
{ key: "edit", label: "관리", minWidth: 80 },
]

const initialData: EditableRow[] = [
{ id: 1, process: "도장공정", product: "외장 패널", substance: "톨루엔", exposure: "흡입 가능성 높음", toxicity: "자연발화성", risk: 3, action: "국소배기장치 설치, 보호구 착용, 환기설비 보완", image: null },
{ id: 2, process: "세정공정", product: "금속 프레임", substance: "MEK", exposure: "피부접촉", toxicity: "신장독성", risk: 2, action: "", image: null },
{ id: 3, process: "혼합공정", product: "도료 원액", substance: "자일렌", exposure: "흡입 및 피부접촉", toxicity: "중추신경계 영향", risk: 1, action: "작업시간 단축", image: null },
{ id: 4, process: "경화공정", product: "합성수지", substance: "스티렌", exposure: "밀폐공간 흡입 우려", toxicity: "발암성 의심", risk: 3, action: "", image: null },
{ id: 5, process: "세척공정", product: "세정액 용기", substance: "IPA", exposure: "증기 발생", toxicity: "안구 자극", risk: 2, action: "세정 전 팬 가동, 보안경 착용", image: null },
]

export default function ChemicalStep1() {
const [checkedRows, setCheckedRows] = useState<(number | string)[]>([])
const [data, setData] = useState<EditableRow[]>(initialData)
const [isRegisterOpen, setIsRegisterOpen] = useState(false)
const [editItem, setEditItem] = useState<EditableRow | null>(null)
const [isActionModalOpen, setIsActionModalOpen] = useState(false)
const [currentActionId, setCurrentActionId] = useState<number | null>(null)
const [searchText, setSearchText] = useState("")
const navigate = useNavigate()

const handleCellChange = (id: number, key: keyof EditableRow, val: any) => setData(prev => prev.map(row => (row.id === id ? { ...row, [key]: val } : row)))
const openActionModal = (id: number) => { setCurrentActionId(id); setIsActionModalOpen(true) }
const handleActionSave = (value: string) => { if (currentActionId !== null) setData(prev => prev.map(row => (row.id === currentActionId ? { ...row, action: value } : row))); setIsActionModalOpen(false); setCurrentActionId(null) }
const handleEdit = (row: EditableRow) => { setEditItem(row); setIsRegisterOpen(true) }

const dataWithEditableCells = data.map(row => ({
...row,
process: <span>{row.process}</span>,
product: <span>{row.product}</span>,
substance: <span>{row.substance}</span>,
exposure: <EditableTextArea value={row.exposure} onChange={val => handleCellChange(row.id, "exposure", val)} placeholder="노출 가능성" />,
toxicity: <EditableTextArea value={row.toxicity} onChange={val => handleCellChange(row.id, "toxicity", val)} placeholder="유해성" />,
risk: (<div className="flex justify-center gap-3">{[3,2,1].map(level => { const color = level === 3 ? "#FF3939" : level === 2 ? "#FFE13E" : "#1EED1E"; const text = level === 3 ? "상" : level === 2 ? "중" : "하"; return (<div key={level} className="flex items-center gap-1 cursor-pointer" onClick={() => handleCellChange(row.id, "risk", level)}><div className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ border: `1px solid ${color}` }}>{row.risk === level && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}</div><span className="text-xs md:text-base font-medium text-[#333639]">{text}({level})</span></div>) })}</div>),
action: (<div className="flex justify-center items-center"><button onClick={() => openActionModal(row.id)} className={`h-9 px-2 rounded-lg flex items-center gap-1 text-xs md:text-sm font-medium ${row.action ? "bg-[#F3F4F6] text-[#6B7280] border border-[#D1D5DB]" : "bg-[#D0E3F8] text-[#1A4FA3] border border-[#B7CCE3]"}`}>{row.action ? (<><Eye size={16} />감소대책 보기</>) : (<><FileEdit size={16} />감소대책 수립</>)}</button></div>),
image: (<button type="button" onClick={() => alert("이미지 첨부")}><Upload size={18} /></button>),
edit: (<button style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }} onClick={() => handleEdit(row)} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>자세히보기/편집</button>)
}))

const handleDelete = () => { if (checkedRows.length === 0) return alert("삭제할 항목을 선택하세요"); if (window.confirm("정말 삭제하시겠습니까?")) { setData(prev => prev.filter(row => !checkedRows.includes(row.id))); setCheckedRows([]) } }
const handleRegisterSave = (formData: any) => { if (editItem) setData(prev => prev.map(row => (row.id === editItem.id ? { ...row, ...formData } : row))); else setData(prev => [...prev, { id: prev.length ? Math.max(...prev.map(r => r.id)) + 1 : 1, ...formData }]); setEditItem(null); setIsRegisterOpen(false) }

return (
<section className="mypage-content w-full px-3 py-1 bg-[#F8F8F8] flex flex-col min-h-screen">
<div className="flex justify-center w-full">
<div className="border border-[#DDDDDD] bg-white rounded-[13px] p-8 mt-3 w-full flex flex-col">
<PageTitle>위험성평가 실시(화학물질 평가법)</PageTitle>
<FilterBar startDate="" endDate="" onStartDate={() => {}} onEndDate={() => {}} searchText={searchText} onSearchText={setSearchText} onSearch={() => {}} />
<div className="flex justify-end mt-1 mb-3 gap-1">
<Button variant="action" onClick={() => { setEditItem(null); setIsRegisterOpen(true) }} className="flex items-center gap-1"><CirclePlus size={16} />물질추가</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
</div>
<DataTable columns={columns} data={dataWithEditableCells} onCheckedChange={setCheckedRows} selectable className="flex-1 min-w-[600px] md:min-w-auto text-[15px] font-medium text-[#333639] text-left" />
</div>
</div>
<div className="mt-5 flex justify-end">
<Button variant="secondary" onClick={() => { if (window.confirm("작성한 평가내용을 저장하시겠습니까?")) alert("저장되었습니다") }}><Save size={18} className="mr-1" />저장완료</Button>
</div>
<ChemicalRegister isOpen={isRegisterOpen} onClose={() => { setIsRegisterOpen(false); setEditItem(null) }} onSave={handleRegisterSave} initialData={editItem} />
<ChemicalAction isOpen={isActionModalOpen} onClose={() => setIsActionModalOpen(false)} onSave={handleActionSave} />
</section>
)
}