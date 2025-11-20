import React from "react"
import Checkbox from "../base/Checkbox"
import { Download, Image, Eye, Upload } from "lucide-react"
import Badge, { BadgeColor } from "../base/Badge"
import EditableCell from "@/components/common/inputs/EditableCell"
import EditableTextArea from "@/components/common/inputs/EditableTextArea"
import SitePhotoViewer from "@/components/modules/SitePhotoViewer"
import ToggleSwitch from "@/components/common/base/ToggleSwitch"

export type ColumnType =
| "text"
| "download"
| "manage"
| "photo"
| "image"
| "badge"
| "input"
| "textarea"
| "stateToggle"
| "resultView"
| "toggle"
| "detail"
| "sign"
| "date"
| "percent"
| "upload"
| "checkbox"

export type Column<T = DataRow> = {
key: string
label: string
type?: ColumnType
minWidth?: number | string
maxWidth?: number | string
align?: "left" | "center" | "right"
renderCell?: (row: T) => React.ReactNode
stateOptions?: {
left: { text: string; color: BadgeColor }
right: { text: string; color: BadgeColor }
}
}

export type DataRow = { id: number | string; [key: string]: any }

export interface DataTableProps<T = DataRow> {
columns: Column<T>[]
data: T[]
selectable?: boolean
onCheckedChange?: (checkedIds: (number | string)[]) => void
onManageClick?: (row: T) => void
onDownloadClick?: (row: T) => void
onPhotoClick?: (row: T) => void
onInputChange?: (id: number | string, key: string, value: string) => void
onStateToggleChange?: (id: number | string, newValue: string) => void
onToggleChange?: (id: number | string, key: string, value: boolean) => void
onDetailClick?: (row: T) => void
onSignClick?: (row: T) => void
onUploadChange?: (id: number | string, key: string, file: File) => void
}

const headerFont = { fontWeight: 600, color: "var(--tertiary)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }
const bodyFont = { fontWeight: "normal", color: "#666", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }
const padFirst = { padding: "11px 13px 11px 19px" }
const padMid = { padding: "11px 13px" }
const padLast = { padding: "11px 19px 11px 13px" }
const btnBase = { background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer", font: "inherit", lineHeight: "inherit" }
const inputBaseClass = "border border-[var(--border)] rounded-lg px-2 py-1 text-sm outline-none"

function DataTable<T extends DataRow = DataRow>({ columns, data, onCheckedChange, onManageClick, onDownloadClick, onPhotoClick, onInputChange, onStateToggleChange, onToggleChange, onDetailClick, onSignClick, onUploadChange }: DataTableProps<T>) {
const [checked, setChecked] = React.useState<(number | string)[]>([])
const [viewerOpen, setViewerOpen] = React.useState(false)
const [viewerImages, setViewerImages] = React.useState<string[]>([])
const [viewerIndex, setViewerIndex] = React.useState(0)

const checkAll = () => setChecked(checked.length === data.length ? [] : data.map(r => r.id))
const checkOne = (id: number | string) => setChecked(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]))

React.useEffect(() => {
onCheckedChange?.(checked)
}, [checked])

const safeBadgeColor = (c: any): BadgeColor => {
const ok: BadgeColor[] = ["gray", "red", "yellow", "blue", "sky", "green", "orange", "bgRed"]
return ok.includes(c) ? c : "gray"
}

const openPhotoViewer = (row: T) => {
const imgs = row.sitePhotos || row.photos || row.images || []
if (!Array.isArray(imgs) || imgs.length === 0) return
setViewerImages(imgs)
setViewerIndex(0)
setViewerOpen(true)
onPhotoClick?.(row)
}

const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({})

const openUploadDialog = (row: T, col: Column<T>) => {
const key = `${row.id}-${col.key}`
const ref = fileInputRefs.current[key]
if (ref) ref.click()
}

const renderCell = (col: Column<T>, row: T) => {
if (col.renderCell) {
return col.renderCell(row)
}

if (col.type === "image") {
const v = row[col.key]
return (
<div className="flex justify-center items-center p-0 m-0">
<img src={v?.src} alt={v?.alt} className="w-[39px] h-[39px] object-contain" />
</div>
)
}

if (col.type === "download") return (
<span role="button" tabIndex={0} onClick={() => onDownloadClick?.(row)} className="flex justify-center items-center cursor-pointer">
<Download size={19} />
</span>
)

if (col.type === "upload") {
return (
<div className="flex items-center justify-center gap-1">
<span role="button" tabIndex={0} onClick={() => {
const input = document.createElement("input")
input.type = "file"
input.style.display = "none"
input.onchange = e => {
const file = (e.target as HTMLInputElement).files?.[0]
if (file) onUploadChange?.(row.id, col.key, file)
document.body.removeChild(input)
}
document.body.appendChild(input)
input.click()
}} className="flex justify-center items-center cursor-pointer">
<Upload size={18} />
</span>
{row[col.key]?.name && (
<span className="text-[11px] text-gray-500 max-w-[90px] truncate">
{row[col.key].name}
</span>
)}
</div>
)
}

if (col.type === "photo") return (
<span role="button" tabIndex={0} onClick={() => openPhotoViewer(row)} className="flex justify-center items-center cursor-pointer">
<Image size={19} />
</span>
)

if (col.type === "manage") return (
<button onClick={() => onManageClick?.(row)} className="px-3 py-1 text-[13px] rounded-lg bg-[var(--secondary)] text-white hover:opacity-80 whitespace-nowrap">
자세히보기/편집
</button>
)

if (col.type === "resultView") return (
<button onClick={() => onManageClick?.(row)} style={{ ...btnBase, color: "var(--tertiary)", display: "inline-flex", alignItems: "center", gap: "4px" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
<Eye size={14} />
결과보기
</button>
)

if (col.type === "detail") return (
<button onClick={() => onDetailClick?.(row)} className="px-3 py-1 text-[13px] rounded-lg bg-[var(--secondary)] text-white hover:opacity-80 whitespace-nowrap">
상세보기
</button>
)

if (col.type === "sign") {
const signed = row[col.key] === "done"
return (
<button onClick={() => !signed && onSignClick?.(row)} className={`px-3 py-1 text-[13px] rounded-lg border ${signed ? "border-gray-300 text-gray-400 bg-gray-50 cursor-default" : "border-[var(--primary)] text-[var(--primary)] hover:opacity-80"}`}>
{signed ? "서명완료" : "서명하기"}
</button>
)
}

if (col.type === "badge") {
const v = row[col.key]
return <Badge color={safeBadgeColor(v?.color)}>{v?.text || ""}</Badge>
}

if (col.type === "stateToggle") {
const opt = col.stateOptions
if (!opt) return null
const cur = row[col.key]
const is = (v: string) => cur === v
const click = (v: string) => {
if (cur === v) return
if (v === opt.left.text) {
if (!window.confirm("'채택'으로 변경 시 미처리 사유는 삭제되고 '채택 완료'로 처리됩니다.\n변경하시겠습니까?")) return
onStateToggleChange?.(row.id, opt.left.text)
} else onStateToggleChange?.(row.id, opt.right.text)
}
return (
<div className="inline-flex select-none" role="group">
<button type="button" onClick={() => click(opt.left.text)} className={`mr-1 px-1 py-1 rounded font-semibold cursor-pointer ${is(opt.left.text) ? "text-sky-500" : "text-gray-300"}`}>
<Badge color={opt.left.color} className={is(opt.left.text) ? "" : "opacity-30"}>{opt.left.text}</Badge>
</button>
<button type="button" onClick={() => click(opt.right.text)} className={`px-1 py-1 rounded font-semibold cursor-pointer ${is(opt.right.text) ? "text-red-500" : "text-gray-300"}`}>
<Badge color={opt.right.color} className={is(opt.right.text) ? "" : "opacity-30"}>{opt.right.text}</Badge>
</button>
</div>
)
}

if (col.type === "input") return <EditableCell value={row[col.key] ?? ""} onChange={v => onInputChange?.(row.id, col.key, v)} disabled={false} />

if (col.type === "textarea") return <EditableTextArea value={row[col.key] ?? ""} onChange={v => onInputChange?.(row.id, col.key, v)} disabled={false} />

if (col.type === "toggle") return (
<div className="flex justify-center">
<ToggleSwitch checked={!!row[col.key]} onChange={v => onToggleChange?.(row.id, col.key, v)} />
</div>
)

if (col.type === "checkbox") {
return (
<div className="flex justify-center">
<Checkbox checked={!!row[col.key]} onChange={() => onToggleChange?.(row.id, col.key, !row[col.key])} />
</div>
)
}

if (col.type === "date") return (
<div className="flex justify-center">
<input type="date" value={row[col.key] || ""} onChange={e => onInputChange?.(row.id, col.key, e.target.value)} className={`${inputBaseClass} w-32`} />
</div>
)

if (col.type === "percent") {
const raw = row[col.key]?.toString().replace("%", "") || ""
return (
<div className="flex justify-end items-center gap-1">
<input type="number" value={raw} onChange={e => onInputChange?.(row.id, col.key, e.target.value + "%")} className={`${inputBaseClass} w-16 text-right`} />
<span>%</span>
</div>
)
}

return row[col.key]
}

const resolveAlign = (col: Column<T>) => {
if (col.type === "date") return "center"
if (col.type === "percent") return "right"
if (col.type === "upload") return "center"
if (["download", "manage", "photo", "image", "badge", "input", "textarea", "stateToggle", "resultView", "toggle", "detail", "sign", "checkbox"].includes(col.type || "")) return "center"
if (col.key === "id") return "center"
return col.align || "left"
}

return (
<>
<div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
<table className="w-full border-collapse min-w-[450px]">
<thead>
<tr className="h-[33px] md:h-[45px]" style={{ background: "#FFF", borderBottom: `2.3px solid var(--tertiary)` }}>
<th className="text-center text-xs md:text-base align-middle" style={{ width: 60, ...headerFont, ...padFirst }}>
<Checkbox checked={checked.length === data.length && data.length > 0} onChange={checkAll} />
</th>
{columns.map((col, i) => {
const pad = i === columns.length - 1 ? padLast : padMid
return (
<th key={col.key} className={`text-${resolveAlign(col)} text-xs md:text-base align-middle`} style={{ minWidth: col.minWidth || 60, maxWidth: col.maxWidth || 300, ...headerFont, ...pad }}>
{col.label}
</th>
)
})}
</tr>
</thead>

<tbody>
{data.map((row, rowIdx) => (
<tr key={row.id} style={{ background: rowIdx % 2 === 0 ? "#FFF" : "var(--neutral-bg)" }}>
<td className="text-center text-xs md:text-base align-middle" style={{ width: 60, ...bodyFont, ...padFirst }}>
<Checkbox checked={checked.includes(row.id)} onChange={() => checkOne(row.id)} />
</td>
{columns.map((col, i) => {
const pad = i === columns.length - 1 ? padLast : padMid
return (
<td key={col.key} className={`text-${resolveAlign(col)} text-xs md:text-base align-middle`} style={{ minWidth: col.minWidth || 60, maxWidth: col.maxWidth || 300, ...bodyFont, ...pad }}>
{renderCell(col, row)}
</td>
)
})}
</tr>
))}
</tbody>
</table>
</div>

<SitePhotoViewer open={viewerOpen} images={viewerImages} index={viewerIndex} onClose={() => setViewerOpen(false)} onPrev={() => setViewerIndex(prev => (prev > 0 ? prev - 1 : prev))} onNext={() => setViewerIndex(prev => (prev < viewerImages.length - 1 ? prev + 1 : prev))} />
</>
)
}

export default DataTable