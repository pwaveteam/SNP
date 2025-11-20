import React, { useState } from "react"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import Button from "@/components/common/base/Button"
import PageTitle from "@/components/common/base/PageTitle"
import ProcessRiskAccordion, { RiskItem } from "@/components/modules/ProcessRiskAccordion"
import LoadListDialog from "@/components/modules/LoadListDialog"
import AttendeePanel from "@/components/modules/AttendeePanel"

interface Attendee { name: string; phone: string; signature?: string }

const riskEvaluationTemplates = ["건설기계_2025-03-30","물리적인자_2025-03-30","터널 공사_2025-03-30","기타_2025-03-30","크레인 작업_2025-03-30"]

const defaultContent = `1. 작업내용 및 작업절차 전달:\n\n2. 위험성평가 내용 공유:\n\n3. 비상시 행동요령:\n\n4. 비상시 행동요령\n- 비상대회 경로 및 대피 후 비상집결지 안내\n- 작업위치 내 소화시설 위치 주지`
const defaultRemark = `개인보호구 착용 상태 확인(근로자간 상호 확인)\n건강 상태 확인(발열 등)\n준비운동 및 스트레칭\n작업 도구/장비 및 주변 위험요소 점검\n비상시 연락망 및 응급조치 장비 위치 확인`

export default function TBMRegisterScreen() {
const [tbmName, setTbmName] = useState("")
const [location, setLocation] = useState("")
const [date, setDate] = useState("")
const [startHour, setStartHour] = useState("")
const [startMinute, setStartMinute] = useState("")
const [endHour, setEndHour] = useState("")
const [endMinute, setEndMinute] = useState("")
const [assignee, setAssignee] = useState("")
const [content, setContent] = useState(defaultContent)
const [remark, setRemark] = useState(defaultRemark)
const [fileUpload, setFileUpload] = useState("")
const [process, setProcess] = useState("")
const [processListOpen, setProcessListOpen] = useState(false)
const [processDetails, setProcessDetails] = useState<Record<string, RiskItem[]>>({})
const [expandedProcesses, setExpandedProcesses] = useState<Record<string, boolean>>({})
const [checkedItems, setCheckedItems] = useState<Record<string, boolean[]>>({})
const [attendeesList, setAttendeesList] = useState<Attendee[]>([])
const [sitePhotos, setSitePhotos] = useState("")

const toggleExpand = (proc: string) => setExpandedProcesses(prev => ({ ...prev, [proc]: !prev[proc] }))

const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
const { name, value } = e.target
if (name === "tbmName") setTbmName(value)
else if (name === "location") setLocation(value)
else if (name === "date") setDate(value)
else if (name === "startHour") setStartHour(value)
else if (name === "startMinute") setStartMinute(value)
else if (name === "endHour") setEndHour(value)
else if (name === "endMinute") setEndMinute(value)
else if (name === "assignee") setAssignee(value)
else if (name === "content") setContent(value)
else if (name === "remark") setRemark(value)
else if (name === "sitePhotos") setSitePhotos(value)
else if (name === "fileUpload") setFileUpload(value)
}

const toggleProcessInList = (proc: string) => {
if (process === proc) {
setProcess("")
setProcessDetails(prev => { const copy = { ...prev }; delete copy[proc]; return copy })
setCheckedItems(prev => { const copy = { ...prev }; delete copy[proc]; return copy })
return
}
fetch(`/api/risk/${encodeURIComponent(proc)}`)
.then(r => r.json())
.then(data => {
setProcess(proc)
setProcessDetails({ [proc]: data })
setCheckedItems({ [proc]: new Array(data.length).fill(false) })
})
.catch(() => {
setProcess(proc)
setProcessDetails({ [proc]: [] })
setCheckedItems({ [proc]: [] })
})
setProcessListOpen(false)
}

const addRiskItem = (proc: string) => {
setProcessDetails(d => {
const items = [...(d[proc] || []), { hazard: "", countermeasure: "" }]
return { ...d, [proc]: items }
})
setCheckedItems(c => {
const arr = [...(c[proc] || []), false]
return { ...c, [proc]: arr }
})
}

const handleRiskItemChange = (proc: string, index: number, key: "hazard"|"countermeasure", value: string) => {
setProcessDetails(prev => {
const items = prev[proc] ? [...prev[proc]] : []
if (items[index]) items[index] = { ...items[index], [key]: value }
return { ...prev, [proc]: items }
})
}

const fields: Field[] = [
    { label: "TBM 장소", name: "location", type: "text", placeholder: "장소 입력", required: true },
    { label: "TBM 일자", name: "date", type: "date", required: true },
    { label: "진행시간", name: "timeRange", type: "timeRange", required: true },
    { label: "작업명", name: "tbmName", type: "text", placeholder: "작업명 입력", required: true },
  
    {
      label: "위험성평가표",
      name: "processes",
      type: "tags",
      required: false,
      buttonRender: (
        <>
          <Button variant="action" onClick={() => setProcessListOpen(true)}>위험성평가표 불러오기</Button>
          {processListOpen && (
            <LoadListDialog
              isOpen={processListOpen}
              items={riskEvaluationTemplates.map(p => ({ id: p, name: p }))}
              selectedId={process}
              singleSelect
              onChangeSelected={selected => {
                if (selected == null) return
                if (Array.isArray(selected)) {
                  const v = selected[0]
                  if (v != null) toggleProcessInList(String(v))
                } else {
                  toggleProcessInList(String(selected))
                }
              }}
              onClose={() => setProcessListOpen(false)}
            />
          )}
        </>
      ),
    },
  
    { label: "작업내용", name: "content", type: "textarea", required: false },
    { label: "비고", name: "remark", type: "textarea", required: false },
    { label: "현장사진", name: "sitePhotos", type: "photoUpload", required: false },
    { label: "첨부파일", name: "fileUpload", type: "fileUpload", required: false },
  ]
  

const values = { tbmName, location, date, startHour, startMinute, endHour, endMinute, assignee, content, remark, fileUpload, processes: process, sitePhotos }

const handleSubmit = () => {
console.log({ tbmName, location, date, startHour, startMinute, endHour, endMinute, assignee, content, remark, processes: process, attendeesList, processDetails, checkedItems, sitePhotos, fileUpload })
}

const handleAddAttendee = (att: Attendee) => setAttendeesList(prev => [...prev, att])
const handleRemoveAttendee = (idx: number) => setAttendeesList(prev => prev.filter((_, i) => i !== idx))

return (
<section className="w-full relative" style={{ minHeight: "900px", paddingBottom: "200px" }}>
<PageTitle>TBM 등록</PageTitle>
<div className="flex flex-col lg:flex-row gap-4 items-start">
<div className="w-full lg:w-[50%] border border-[#F3F3F3] rounded-[16px] p-3" style={{ minHeight: "700px" }}>
<FormScreen fields={fields} values={values} onChange={handleChange} onTagRemove={(n, t) => { if (n === "processes" && t === process) { setProcess(""); setProcessDetails({}); setCheckedItems({}) } }} onSubmit={handleSubmit} onClose={() => {}} onSave={() => {}} />
{process && (
<ProcessRiskAccordion
key={process}
process={process}
items={processDetails[process] ?? [{ hazard: "", countermeasure: "" }]}
expanded={expandedProcesses[process] ?? true}
toggleExpand={() => toggleExpand(process)}
handleChangeHazard={(i, val) => handleRiskItemChange(process, i, "hazard", val)}
handleChangeCounter={(i, val) => handleRiskItemChange(process, i, "countermeasure", val)}
addRiskItem={() => addRiskItem(process)}
/>
)}
</div>
<aside className="w-full lg:flex-1 lg:min-w-[400px] flex flex-col gap-6" style={{ minHeight: "700px" }}>
<PageTitle className="block lg:hidden">참석자 목록</PageTitle>
<div className="w-full">
<AttendeePanel attendees={attendeesList} onAdd={handleAddAttendee} onRemove={handleRemoveAttendee} />
</div>
</aside>
</div>
<div className="absolute right-4 bottom-4 lg:static lg:mt-8 flex justify-end">
<Button onClick={handleSubmit}>저장하기</Button>
</div>
</section>
)
}