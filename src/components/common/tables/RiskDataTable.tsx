import React from "react"
import Checkbox from "../base/Checkbox"

export type RiskColumn<T = RiskDataRow> = { key: string; label: string; width?: number | string; minWidth?: number | string; maxWidth?: number | string; align?: "left" | "center" | "right"; titleKey?: string; renderCell?: (row: T, col: RiskColumn<T>, rowIdx: number) => React.ReactNode; [key: string]: any }
export type RiskDataRow = { id: number | string; [key: string]: any }
export interface RiskDataTableProps<T = RiskDataRow> { columns: RiskColumn<T>[]; data: T[]; selectable?: boolean; renderCell?: (row: T, col: RiskColumn<T>, rowIdx: number) => React.ReactNode; onCheckedChange?: (checkedIds: (number | string)[]) => void; [key: string]: any }

const headerFontStyle: React.CSSProperties = { fontWeight: 600, color: "#666666", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }
const bodyFontStyle: React.CSSProperties = { fontWeight: "normal", color: "#333639", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }

const RiskDataTable = <T extends RiskDataRow = RiskDataRow>({ columns, data, renderCell, onCheckedChange }: RiskDataTableProps<T>) => {
const [checked, setChecked] = React.useState<(number | string)[]>([])
const handleCheckAll = () => setChecked(checked.length === data.length ? [] : data.map(row => row.id))
const handleCheck = (id: number | string) => setChecked(prev => prev.includes(id) ? prev.filter(num => num !== id) : [...prev, id])
React.useEffect(() => { onCheckedChange?.(checked) }, [checked, onCheckedChange])

return (
<div className="risk-table overflow-x-auto">
<style>{`.risk-table select{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-image:none;padding-right:2rem}`}</style>
<table className="w-full table-fixed border-collapse min-w-[600px] md:min-w-auto">
<thead>
<tr className="h-[33px] md:h-[45px]" style={{ background: "#F7F8FA", borderTop: "1.9px solid #161616", borderBottom: "1px solid #CCCCCC" }}>
<th className="px-3 py-0 align-middle text-xs sm:text-xs md:text-base text-center" style={{ minWidth: 60, maxWidth: 100, width: 60, borderRight: "1px solid #CCCCCC", background: "#EFEFF3", ...headerFontStyle }}>
<Checkbox checked={checked.length === data.length && data.length > 0} onChange={handleCheckAll} />
</th>
{columns.map((col, idx) => (
<th key={col.key} className="px-3 py-0 align-middle text-xs sm:text-xs md:text-base text-center" style={{ width: col.width ?? col.minWidth ?? 60, minWidth: col.minWidth ?? col.width ?? 60, maxWidth: col.maxWidth ?? 300, borderRight: idx === columns.length - 1 ? "none" : "1px solid #CCCCCC", background: "#EFEFF3", ...headerFontStyle }} title={typeof col.label === "string" ? col.label : undefined}>{col.label}</th>
))}
</tr>
</thead>
<tbody>
{data.map((row, rowIdx) => (
<tr key={row.id} className="h-9 md:h-14" style={{ background: "#fff", cursor: "default" }} onMouseEnter={e => (e.currentTarget.style.background = "#FBFBFB")} onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>
<td className="px-3 py-0 align-middle text-xs sm:text-xs md:text-base text-center" style={{ minWidth: 60, maxWidth: 100, width: 60, borderRight: "1px solid #CCCCCC", borderBottom: "1px solid #CCCCCC", ...bodyFontStyle }}>
<Checkbox checked={checked.includes(row.id)} onChange={() => handleCheck(row.id)} />
</td>
{columns.map((col, colIdx) => (
<td key={col.key} className={`px-3 py-0 align-middle text-xs sm:text-xs md:text-base ${col.align === "left" ? "text-left" : col.align === "right" ? "text-right" : "text-center"}`} style={{ width: col.width ?? col.minWidth ?? 60, minWidth: col.minWidth ?? col.width ?? 60, maxWidth: col.maxWidth ?? 300, borderRight: colIdx === columns.length - 1 ? "none" : "1px solid #CCCCCC", borderBottom: "1px solid #CCCCCC", ...bodyFontStyle }} title={col.titleKey && typeof row[col.titleKey] === "string" ? (row[col.titleKey] as string) : undefined}>
{col.renderCell ? col.renderCell(row, col, rowIdx) : renderCell ? renderCell(row, col, rowIdx) : row[col.key]}
</td>
))}
</tr>
))}
</tbody>
</table>
</div>
)
}

export default RiskDataTable