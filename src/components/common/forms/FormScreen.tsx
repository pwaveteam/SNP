// FormScreen.tsx
import React, { useState, useEffect } from "react"
import Button from "@/components/common/base/Button"
import { X, Search } from "lucide-react"
import RadioGroup from "@/components/common/base/RadioGroup"

export type Field = {
label: string | React.ReactNode
name: string
type?:
| "text"
| "select"
| "password"
| "email"
| "readonly"
| "phone"
| "custom"
| "signature"
| "date"
| "singleDatetime"
| "datetime"
| "daterange"
| "timeRange"
| "textarea"
| "fileUpload"
| "photoUpload"
| "tags"
| "quantityUnit"
| "quantity"
| "autocomplete"
| "radio"
placeholder?: string
options?: { value: string; label: string }[]
customRender?: React.ReactNode
buttonRender?: React.ReactNode
required?: boolean
showPlusOne?: boolean
disabled?: boolean
}

export type FormScreenProps = {
fields: Field[]
values: { [key: string]: string }
onChange: (
e: React.ChangeEvent<
HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>
) => void
onTagRemove?: (name: string, valueToRemove: string) => void
onEmailDomainSelect?: (domain: string) => void
onClose: () => void
onSave: () => void
onSubmit?: () => void
isModal?: boolean
notifyEnabled?: boolean
}

export default function FormScreen({
fields,
values,
onChange,
onTagRemove,
onEmailDomainSelect,
onClose,
onSave,
isModal = false,
notifyEnabled = true,
}: FormScreenProps) {
// ============================================
// 스타일 상수 - 최상단 분리
// ============================================
// Border & Radius
const BORDER_RADIUS = "8px"
const BORDER_RADIUS_SM = "3px"
const BORDER_STYLE = { borderWidth: "1px", borderStyle: "solid" as const, borderColor: "var(--border)" }

// Font Size
const FONT_SM = "text-sm"
const FONT_BASE = "text-[15px]"
const FONT_SM_MD = "text-sm md:text-[15px]"
const FONT_BASE_MD = "text-sm md:text-base"

// Font Style Objects
const headerFont = { fontWeight: 600, color: "var(--tertiary)" }
const bodyFont = { fontWeight: 400, color: "#666" }

// Background
const BG_WHITE = "bg-white"
const BG_READONLY = "bg-gray-100"
const BG_PASSWORD = "bg-gray-50"

// Text Colors
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-600"
const TEXT_DISABLED = "text-gray-500"

// 공통 스타일 조합
const BORDER_CLASS = `rounded-[${BORDER_RADIUS}]`
const PLACEHOLDER_CLASS = `placeholder:font-normal placeholder:${TEXT_SECONDARY} placeholder:${FONT_SM_MD}`
const TEXT_BASE_CLASS = `${FONT_SM_MD} font-medium`
const INPUT_BASE_CLASS = `${BORDER_CLASS} px-2 h-[36px] w-full appearance-none ${PLACEHOLDER_CLASS} ${TEXT_BASE_CLASS}`

const INPUT_EDITABLE = `${INPUT_BASE_CLASS} ${BG_WHITE} ${TEXT_PRIMARY}`
const INPUT_READONLY = `${INPUT_BASE_CLASS} ${BG_READONLY} ${TEXT_DISABLED}`
const INPUT_PASSWORD = `${INPUT_BASE_CLASS} ${BG_PASSWORD} ${TEXT_PRIMARY}`

const TEXTAREA_CLASS = `${BORDER_CLASS} ${PLACEHOLDER_CLASS} ${TEXT_BASE_CLASS} p-2 w-full min-h-[150px] ${BG_WHITE} ${TEXT_PRIMARY}`
const FILE_WRAPPER_CLASS = `w-full h-[38px] ${BORDER_CLASS} flex items-center justify-center ${PLACEHOLDER_CLASS} ${TEXT_BASE_CLASS}`
const FILE_BTN_CLASS = `h-[30px] flex items-center px-3 bg-gray-100 rounded-[${BORDER_RADIUS_SM}] ${FONT_BASE_MD} ${TEXT_PRIMARY} cursor-pointer`
const FILE_TEXT_CLASS = `${FONT_BASE_MD} ${TEXT_SECONDARY} flex-1 truncate`
const FILE_LIST_CLASS = `rounded-md p-2 max-h-[120px] overflow-auto ${FONT_SM} ${TEXT_PRIMARY}`

const TAG_CONTAINER_CLASS = `w-full max-w-full ${BG_WHITE} px-1 py-0.5 ${BORDER_CLASS} h-[39px] flex items-center`
const TAG_ITEM_CLASS = `flex items-center ${TEXT_PRIMARY} text-[13px] md:${FONT_SM} rounded-[${BORDER_RADIUS}] px-[9px] py-[3px]`
const TAG_PLACEHOLDER_CLASS = `${FONT_SM_MD} font-normal ${TEXT_SECONDARY} select-none ml-2`

const SELECT_PADDING = "pr-8"

// ============================================
// 상태 및 로직
// ============================================
const [tagItems, setTagItems] = useState<{ value: string; label: string }[]>([])
const [tagsOpen, setTagsOpen] = useState(false)

useEffect(() => {
fetch("/api/processes")
.then(res => res.json())
.then((data: { value: string; label: string }[]) => setTagItems(data))
}, [])

const toggleTag = (name: string, v: string) => {
const existing = values[name].split(",").filter(Boolean)
const next = existing.includes(v)
? existing.filter(x => x !== v)
: [...existing, v]
onChange({
target: { name, value: next.join(",") },
} as React.ChangeEvent<HTMLInputElement>)
}

// ============================================
// 입력 요소 렌더링
// ============================================
const renderInput = (field: Field) => {
const isRO = field.type === "readonly"
const isPW = field.name === "currentPassword"
const inputClass = isPW ? INPUT_PASSWORD : isRO ? INPUT_READONLY : INPUT_EDITABLE

const isRequired =
!["fileUpload","photoUpload","tags"].includes(field.type || "") &&
field.required === true

const requiredAttrs = isRequired ? { required: true } : {}

if (field.type === "custom" && field.customRender) return field.customRender

if (field.type === "signature")
return (
<div className="py-0">
<div
className={`${BG_WHITE} p-2 ${BORDER_CLASS} w-[190px] h-[100px] flex items-center justify-center`}
style={BORDER_STYLE}
>
{values[field.name] ? (
<img
src={values[field.name]}
alt="서명 이미지"
className="max-w-full max-h-full object-contain"
/>
) : (
<span className={`${TEXT_SECONDARY} ${FONT_SM_MD}`}>서명 이미지 없음</span>
)}
</div>
</div>
)

if (field.type === "radio" && field.options) {
return (
<RadioGroup
name={field.name}
value={values[field.name] || ""}
options={field.options}
onChange={e => onChange(e as React.ChangeEvent<HTMLInputElement>)}
className=""
/>
)
}

if (field.type === "select" && field.options)
return (
<div className="relative w-full md:w-[300px]">
<select
name={field.name}
value={values[field.name]}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} ${(field.disabled || (field.name === "notifyWhen" && !notifyEnabled)) ? "cursor-not-allowed text-gray-400" : ""}`}
style={BORDER_STYLE}
{...requiredAttrs}
disabled={field.disabled || (field.name === "notifyWhen" && !notifyEnabled)}
>
{!values[field.name] && <option value="">{field.placeholder || "선택"}</option>}
{field.options.map(o => (
<option key={o.value} value={o.value}>
{o.label}
</option>
))}
</select>
</div>
)

if (field.type === "autocomplete")
return (
<div className="relative w-full">
<input
type="text"
name={field.name}
value={values[field.name]}
onChange={onChange}
placeholder={field.placeholder || "Search"}
className={`${INPUT_EDITABLE} pr-8`}
style={BORDER_STYLE}
{...requiredAttrs}
/>
<Search className={`absolute right-2 top-1/2 -translate-y-1/2 ${TEXT_DISABLED} w-5 h-5 pointer-events-none`} />
</div>
)

const renderDateInput = (name: string, value: string, required = false, disabled = false) => (
<input
type="date"
name={name}
value={value}
onChange={onChange}
className={`${disabled ? INPUT_READONLY : INPUT_EDITABLE} w-[130px] md:w-[160px]`}
style={BORDER_STYLE}
disabled={disabled}
{...(required ? { required: true } : {})}
/>
)

const renderTimeSelect = (name: string, value: string, type: 'hour' | 'minute', required = false) => (
<div className="relative w-[60px]">
<select
name={name}
value={value}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} w-full`}
style={BORDER_STYLE}
{...(required ? { required: true } : {})}
>
<option value="">{type === 'hour' ? '시' : '분'}</option>
{type === 'hour' 
? [...Array(24).keys()].map(h => <option key={h} value={h}>{h}시</option>)
: ["00", "10", "20", "30", "40", "50"].map(m => <option key={m} value={m}>{m}분</option>)
}
</select>
</div>
)

if (field.type === "date")
return (
<div className="flex flex-wrap items-center gap-2">
{renderDateInput(field.name, values[field.name], field.required !== false, field.disabled)}
{field.showPlusOne !== false && (
<Button variant="action" onClick={() => {}} className="h-[36px] px-3 shrink-0">
+1일
</Button>
)}
</div>
)

if (field.type === "singleDatetime")
return (
<div className="flex flex-wrap items-center gap-4 w-full">
<div className="flex items-center gap-1 w-full md:w-auto">
{renderDateInput("startDate", values.startDate || "", true)}
</div>
<div className="flex items-center gap-1 w-full md:w-auto">
{renderTimeSelect("startHour", values.startHour || "", 'hour', true)}
{renderTimeSelect("startMinute", values.startMinute || "", 'minute', true)}
</div>
<span className={`${FONT_SM_MD} ${TEXT_PRIMARY}`}>~</span>
{renderTimeSelect("endHour", values.endHour || "", 'hour', true)}
{renderTimeSelect("endMinute", values.endMinute || "", 'minute', true)}
</div>
)

if (field.type === "timeRange") {
return (
<div className="flex flex-col gap-2 w-full">
<div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full">
{/* 시작 시간 */}
<div className="flex items-center gap-1">
<div className="relative w-[80px] md:w-[80px] shrink-0">
<select
name="startHour"
value={values.startHour || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} w-full`}
style={BORDER_STYLE}
>
<option value="">시</option>
{[...Array(19).keys()].map(h => {
const hour = h + 6
return (
<option key={hour} value={hour}>
{hour}시
</option>
)
})}
</select>
</div>

<div className="relative w-[80px] md:w-[80px] shrink-0">
<select
name="startMinute"
value={values.startMinute || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} w-full`}
style={BORDER_STYLE}
>
<option value="">분</option>
{["00", "15", "30", "45"].map(m => (
<option key={m} value={m}>
{m}분
</option>
))}
</select>
</div>
</div>

<span className={`${FONT_SM_MD} ${TEXT_PRIMARY} shrink-0 self-start md:self-center`}>~</span>

{/* 종료 시간 */}
<div className="flex items-center gap-1">
<div className="relative w-[80px] md:w-[80px] shrink-0">
<select
name="endHour"
value={values.endHour || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} w-full`}
style={BORDER_STYLE}
>
<option value="">시</option>
{[...Array(19).keys()].map(h => {
const hour = h + 6
return (
<option key={hour} value={hour}>
{hour}시
</option>
)
})}
</select>
</div>

<div className="relative w-[80px] md:w-[80px] shrink-0">
<select
name="endMinute"
value={values.endMinute || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} w-full`}
style={BORDER_STYLE}
>
<option value="">분</option>
{["00", "15", "30", "45"].map(m => (
<option key={m} value={m}>
{m}분
</option>
))}
</select>
</div>
</div>
</div>

<div className="flex items-center">
<span className="text-xs md:text-sm font-medium text-gray-600">
진행시간:&nbsp;
{(() => {
const sh = values.startHour !== "" ? Number(values.startHour) : null
const sm = values.startMinute !== "" ? Number(values.startMinute) : null
const eh = values.endHour !== "" ? Number(values.endHour) : null
const em = values.endMinute !== "" ? Number(values.endMinute) : null

if (sh === null || sm === null || eh === null || em === null) {
return "-"
}

const startTotal = sh * 60 + sm
const endTotal = eh * 60 + em
const diff = endTotal - startTotal

if (diff < 0) {
return <span className="text-red-600">⚠ 종료시간이 시작시간보다 이릅니다</span>
}

if (diff === 0) {
return <span className="text-red-600">⚠ 시작시간과 종료시간이 같습니다</span>
}

const h = Math.floor(diff / 60)
const m = diff % 60

if (h === 0) {
return `${m}분`
} else if (m === 0) {
return `${h}시간`
} else {
return `${h}시간 ${m}분`
}
})()}
</span>
</div>
</div>
)
}

if (field.type === "daterange")
return (
<div className="flex flex-wrap items-center gap-2 w-full">
{renderDateInput("startDate", values.startDate || "")}
<span className={`${FONT_SM_MD} ${TEXT_PRIMARY}`}>~</span>
{renderDateInput("endDate", values.endDate || "")}
</div>
)
if (field.type === "phone")
return (
<div className="flex items-center gap-2 w-full overflow-x-auto md:overflow-visible">
<div className="relative w-[80px] md:w-[130px] shrink-0">
<select
name="phonePrefix"
value={values.phonePrefix || "010"}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} w-full ${FONT_SM_MD}`}
style={BORDER_STYLE}
{...requiredAttrs}
>
{(field.options || [{ value: "010", label: "010" }]).map(o => (
<option key={o.value} value={o.value}>
{o.label}
</option>
))}
</select>
</div>

<span className={`${FONT_SM_MD} ${TEXT_PRIMARY}`}>-</span>

<input
type="text"
name="phoneMiddle"
value={values.phoneMiddle || ""}
onChange={onChange}
maxLength={4}
inputMode="numeric"
pattern="[0-9]*"
className={`${inputClass} w-[80px] md:w-[130px] shrink-0 ${FONT_SM_MD}`}
style={BORDER_STYLE}
onKeyDown={e => {
if (
!/[0-9]/.test(e.key) &&
!["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)
) {
e.preventDefault()
}
}}
/>

<span className={`${FONT_SM_MD} ${TEXT_PRIMARY}`}>-</span>

<input
type="text"
name="phoneLast"
value={values.phoneLast || ""}
onChange={onChange}
maxLength={4}
inputMode="numeric"
pattern="[0-9]*"
className={`${inputClass} w-[80px] md:w-[130px] shrink-0 ${FONT_SM_MD}`}
style={BORDER_STYLE}
onKeyDown={e => {
if (
!/[0-9]/.test(e.key) &&
!["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)
) {
e.preventDefault()
}
}}
/>
</div>
)

if (field.type === "email")
return (
<div className="flex items-center gap-2 w-full">
<input
type="text"
name="emailId"
value={values.emailId || ""}
onChange={onChange}
className={`${inputClass} w-[100px] md:w-[180px] shrink-0`}
style={BORDER_STYLE}
/>

<span className={`${FONT_SM_MD} ${TEXT_PRIMARY} shrink-0`}>@</span>

<div className="flex items-center gap-2 shrink-0">
<select
name="emailDomainSelect"
value={values.emailDomainSelect || ""}
onChange={e => onEmailDomainSelect?.(e.target.value)}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} w-[130px] md:w-[180px]`}
style={BORDER_STYLE}
>
<option value="">이메일 선택</option>
<option value="gmail.com">gmail.com</option>
<option value="naver.com">naver.com</option>
<option value="hanmail.net">hanmail.net</option>
<option value="nate.com">nate.com</option>
<option value="__custom">직접입력</option>
</select>

{values.emailDomainSelect === "__custom" && (
<input
type="text"
name="emailDomain"
value={values.emailDomain || ""}
onChange={onChange}
placeholder="도메인 입력"
className={`${inputClass} w-[120px] md:w-[170px]`}
style={BORDER_STYLE}
/>
)}
</div>
</div>
)

if (field.type === "textarea")
return (
<textarea
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder ?? `${field.label} 입력`}
className={`${TEXTAREA_CLASS} ${FONT_BASE_MD} placeholder:${FONT_BASE_MD}`}
style={BORDER_STYLE}
/>
)

if (field.type === "fileUpload") {
return (
<div className="flex flex-col gap-2 w-full">
<label className={`${FILE_WRAPPER_CLASS} relative p-[3px] space-x-[6px]`} style={BORDER_STYLE}>
<span className={FILE_BTN_CLASS} style={BORDER_STYLE}>
파일 선택
</span>
<span className={FILE_TEXT_CLASS}>
{values[field.name] && values[field.name].trim()
? `${values[field.name].split(",").map(f => f.trim()).filter(Boolean).length}개 파일 선택됨`
: "선택된 파일 없음"}
</span>
<input
type="file"
name={field.name}
multiple
accept=".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.pdf,.doc,.docx,.hwp,.xls,.xlsx,.ppt,.pptx,.txt"
className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
onChange={e => {
const files = Array.from((e.target as HTMLInputElement).files || [])
const allowed = /\.(jpg|jpeg|png|gif|bmp|svg|webp|pdf|doc|docx|hwp|xls|xlsx|ppt|pptx|txt)$/i
const validFiles = files.filter(f => allowed.test(f.name))
if (validFiles.length !== files.length) {
alert("이미지 및 문서 파일만 업로드할 수 있습니다.")
return
}
const existingFiles = values[field.name] ? values[field.name].split(",").map(f => f.trim()).filter(Boolean) : []
const newFileNames = validFiles.map(f => f.name)
const combinedFiles = [...existingFiles, ...newFileNames]
if (combinedFiles.length > 5) {
alert("최대 5개 파일까지만 업로드할 수 있습니다.")
return
}
const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0)
const maxSize = 50 * 1024 * 1024
if (totalSize > maxSize) {
alert("전체 파일 용량이 50MB를 초과합니다.")
return
}
onChange({ target: { name: field.name, value: combinedFiles.join(",") } } as any)
e.target.value = ""
}}
/>
</label>
{values[field.name] && values[field.name].trim() && (
<ul className={FILE_LIST_CLASS} style={BORDER_STYLE}>
{values[field.name].split(",").map(f => f.trim()).filter(Boolean).map((fname: string, idx: number) => (
<li key={idx} className="flex items-center justify-between gap-2">
<span className="truncate flex-1">• {fname}</span>
<button
type="button"
onClick={() => {
const files = values[field.name].split(",").map(f => f.trim()).filter(Boolean)
files.splice(idx, 1)
onChange({ target: { name: field.name, value: files.join(",") } } as any)
}}
className="text-gray-400 hover:text-gray-600 shrink-0"
>
<X size={14} />
</button>
</li>
))}
</ul>
)}
</div>
)
}

if (field.type === "photoUpload") {
return (
<div className="flex flex-col gap-2 w-full">
<label className={`${FILE_WRAPPER_CLASS} relative p-[3px] space-x-[6px]`} style={BORDER_STYLE}>
<span className={FILE_BTN_CLASS} style={BORDER_STYLE}>
사진 선택
</span>
<span className={FILE_TEXT_CLASS}>
{values[field.name] && values[field.name].trim()
? `${values[field.name].split(",").map(f => f.trim()).filter(Boolean).length}개 파일 선택됨`
: "선택된 파일 없음"}
</span>
<input
type="file"
name={field.name}
multiple
accept="image/*"
className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
onChange={e => {
const files = Array.from((e.target as HTMLInputElement).files || [])
const existingFiles = values[field.name] ? values[field.name].split(",").map(f => f.trim()).filter(Boolean) : []
const newFileNames = files.map(f => f.name)
const combinedFiles = [...existingFiles, ...newFileNames]
if (combinedFiles.length > 10) {
alert("최대 10개 파일까지만 업로드할 수 있습니다.")
return
}
const totalSize = files.reduce((sum, file) => sum + file.size, 0)
const maxSize = 100 * 1024 * 1024
if (totalSize > maxSize) {
alert("전체 파일 용량이 100MB를 초과합니다.")
return
}
onChange({ target: { name: field.name, value: combinedFiles.join(",") } } as any)
e.target.value = ""
}}
/>
</label>
{values[field.name] && values[field.name].trim() && (
<ul className={FILE_LIST_CLASS} style={BORDER_STYLE}>
{values[field.name].split(",").map(f => f.trim()).filter(Boolean).map((fname: string, idx: number) => (
<li key={idx} className="flex items-center justify-between gap-2">
<span className="truncate flex-1">• {fname}</span>
<button
type="button"
onClick={() => {
const files = values[field.name].split(",").map(f => f.trim()).filter(Boolean)
files.splice(idx, 1)
onChange({ target: { name: field.name, value: files.join(",") } } as any)
}}
className="text-gray-400 hover:text-gray-600 shrink-0"
>
<X size={14} />
</button>
</li>
))}
</ul>
)}
</div>
)
}

if (field.type === "quantity") {
return (
<div className="flex items-center gap-2 w-full">
<div className="basis-1/5 w-full md:w-auto">
<input
type="number"
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder || ""}
className={`${INPUT_EDITABLE} w-full`}
style={BORDER_STYLE}
min={0}
/>
</div>
</div>
)
}

if (field.type === "quantityUnit") {
return (
<div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full">
<input
type="number"
name={field.name + "_value"}
placeholder={field.placeholder || "값 입력"}
className={`${INPUT_EDITABLE} basis-1/5 w-full md:w-auto flex-none`}
style={BORDER_STYLE}
onChange={onChange}
/>
<div className="relative basis-1/5 flex-none w-full md:w-auto">
<select
name={field.name + "_unit"}
value={values[field.name + "_unit"]}
onChange={onChange}
className={`${INPUT_EDITABLE} w-full ${SELECT_PADDING}`}
style={BORDER_STYLE}
>
<option value="">단위 선택</option>
{field.options?.map(o => (
<option key={o.value} value={o.value}>
{o.label}
</option>
))}
</select>
</div>
</div>
)
}

if (field.type === "tags") {
const tags = values[field.name].split(",").filter(Boolean)
return (
<section className={TAG_CONTAINER_CLASS} style={BORDER_STYLE}>
<div className="relative flex flex-wrap items-center gap-1 w-full">
{tags.length === 0 ? (
<span className={TAG_PLACEHOLDER_CLASS}>
선택된 태그가 없습니다
</span>
) : (
tags.map(t => (
<span
key={t}
className={TAG_ITEM_CLASS}
style={{ backgroundColor: "var(--neutral-bg)", ...BORDER_STYLE }}
>
{t}
<button
className={`ml-1 ${TEXT_SECONDARY} hover:${TEXT_PRIMARY}`}
onClick={() => onTagRemove?.(field.name, t)}
type="button"
>
<X size={11} />
</button>
</span>
))
)}
</div>
</section>
)
}

if (isRO)
return (
<input
type="text"
name={field.name}
value={values[field.name] || ""}
disabled
className={INPUT_READONLY}
style={BORDER_STYLE}
/>
)

return (
<input
type={field.type || "text"}
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder}
className={inputClass}
style={BORDER_STYLE}
/>
)
}

const inputWrapperClass = isModal ? "w-full p-[8px]" : "w-full md:w-[65%] p-[8px]"

return (
<section className={`w-full max-w-full bg-white ${FONT_BASE_MD}`}>
<div className="overflow-x-auto">
<table
  className="w-full border-collapse"
  style={{ borderTop: "2.3px solid var(--tertiary)" }}
>
<tbody>
{fields.map(f => (
<tr key={f.name} style={{ borderBottom: "1px solid var(--border)" }}>
<th
className={`w-[120px] md:w-[160px] py-[8px] md:py-[11px] px-[8px] md:px-[13px] font-semibold text-left ${FONT_BASE_MD} ${
f.type === "textarea" ? "align-top pt-3 md:pt-4" : "align-middle"
}`}
style={{ 
...headerFont, 
backgroundColor: "var(--neutral-bg)",
borderRight: "1px solid var(--border)"
}}
>
{f.label}
{!["fileUpload","photoUpload","tags"].includes(f.type || "") &&
f.required === true && (
<span className="text-red-600 ml-1">*</span>
)}
</th>
<td
className={`px-0 bg-white ${FONT_BASE_MD} align-middle`}
style={{ 
...bodyFont,
borderLeft: "1px solid var(--border)"
}}
>
<div className="flex items-center h-full">
<div className={inputWrapperClass}>{renderInput(f)}</div>
{f.buttonRender && (
<div className="w-[35%] px-1 flex items-center justify-start">
{f.buttonRender}
</div>
)}
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
</section>
)
}