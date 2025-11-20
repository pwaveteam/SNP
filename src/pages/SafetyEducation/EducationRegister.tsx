"use client"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import ToggleSwitch from "@/components/common/base/ToggleSwitch"
import PageTitle from "@/components/common/base/PageTitle"
import CertificatePanel from "@/components/modules/CertificatePanel"

interface Attendee { name: string; phone: string; signature?: string }

export default function EducationRegister() {
const navigate = useNavigate()
const [attendees, setAttendees] = useState<Attendee[]>([])
const [notify, setNotify] = useState(true)
const [formData, setFormData] = useState({
category: "", course: "", eduName: "", startDate: "", endDate: "", startHour: "", startMinute: "", endHour: "", endMinute: "",
educationMethod: "", assigner: "", trainer: "", eduMaterial: "", sitePhotos: "", fileUpload: "", note: "", notifyWhen: "1주일 전"
})

const categoryOptions = ["근로자 교육", "관리자 교육", "기타 교육"]

const categoryCourseMap: Record<string, string[]> = {
"근로자 교육": [
"정기교육 (사무직 종사 근로자)", "정기교육 (판매업무 직접 종사 근로자)", "정기교육 (그 외 근로자)",
"채용 시 교육 (일용근로자·계약 1주 이하 기간제근로자)", "채용 시 교육 (계약 1주 초과~1개월 이하 기간제근로자)",
"채용 시 교육 (그 외 근로자)", "작업내용 변경 시 교육 (일용근로자·계약 1주 이하 기간제근로자)", "작업내용 변경 시 교육 (그 외 근로자)",
"특별교육 (39개 유해·위험 작업 수행 근로자 중 일용·계약 1주 이하, 타워크레인 제외)", "특별교육 (타워크레인 신호작업 근로자)", "특별교육 (그 외 근로자)"
],
"관리자 교육": [
"정기교육 (관리감독자)", "채용 시 교육 (관리감독자)", "작업내용 변경 시 교육 (관리감독자)", "특별교육 (관리감독자)",
"신규교육 (안전보건관리책임자)", "보수교육 (안전보건관리책임자)", "신규교육 (안전보건관리자)", "보수교육 (안전보건관리자)", "보수교육 (안전보건관리담당자)"
],
"기타 교육": ["최초 노무제공 시 교육 (특수형태근로종사자)"]
}

const courseHourMap: Record<string, string> = {
"정기교육 (사무직 종사 근로자)": "매반기 6시간 이상", "정기교육 (판매업무 직접 종사 근로자)": "매반기 6시간 이상", "정기교육 (그 외 근로자)": "매반기 12시간 이상",
"채용 시 교육 (일용근로자·계약 1주 이하 기간제근로자)": "1시간 이상", "채용 시 교육 (계약 1주 초과~1개월 이하 기간제근로자)": "4시간 이상",
"채용 시 교육 (그 외 근로자)": "8시간 이상", "작업내용 변경 시 교육 (일용근로자·계약 1주 이하 기간제근로자)": "1시간 이상",
"작업내용 변경 시 교육 (그 외 근로자)": "2시간 이상", "특별교육 (39개 유해·위험 작업 수행 근로자 중 일용·계약 1주 이하, 타워크레인 제외)": "2시간 이상",
"특별교육 (타워크레인 신호작업 근로자)": "8시간 이상", "특별교육 (그 외 근로자)": "16시간 이상", "건설업 기초안전보건교육 (건설업 일용근로자)": "8시간 이상",
"정기교육 (관리감독자)": "연간 16시간 이상", "채용 시 교육 (관리감독자)": "8시간 이상", "작업내용 변경 시 교육 (관리감독자)": "2시간 이상",
"특별교육 (관리감독자)": "16시간 이상", "신규교육 (안전보건관리책임자)": "6시간 이상", "보수교육 (안전보건관리책임자)": "6시간 이상",
"신규교육 (안전보건관리자)": "34시간 이상", "보수교육 (안전보건관리자)": "24시간 이상", "보수교육 (안전관리자)": "8시간 이상",
"최초 노무제공 시 교육 (특수형태근로종사자)": "2시간 이상 (단기작업 1시간 이상)"
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
const { name, value, type } = e.target
const checked = (e.target as HTMLInputElement).checked
setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value, ...(name === "category" ? { course: "" } : {}) }))
}

const NotifyToggle = (
<ToggleSwitch checked={notify} onChange={checked => setNotify(checked)} />
)

const hourText = formData.course && courseHourMap[formData.course]

const fields: Field[] = [
{ label: "교육대상", name: "category", type: "select", options: categoryOptions.map(v => ({ value: v, label: v })), required: true },

{
label: "교육과정",
name: "course",
type: "custom",
required: true,
customRender: (
<div className="flex items-center gap-2 w-full">
<div className="relative w-full md:w-[300px]">
<select
name="course"
value={formData.course}
onChange={handleChange}
className="border border-[#AAAAAA] rounded-[8px] px-2 h-[39px] w-full appearance-none bg-white text-[#333639] pr-8 text-sm md:text-[15px] font-medium"
>
<option value="">선택</option>
{(categoryCourseMap[formData.category] || []).map(course => (
<option key={course} value={course}>{course}</option>
))}
</select>
</div>
{hourText && (
<span className="text-sm md:text-[15px] font-medium text-[#6D808E] whitespace-nowrap">
교육시간: {hourText}
</span>
)}
</div>
)
},

{ label: "교육명", name: "eduName", type: "text", required: true },
{ label: "교육기간", name: "educationPeriod", type: "daterange", required: true },
{ label: "교육시간", name: "educationTime", type: "timeRange", required: true },

{ label: "교육방식", name: "educationMethod", type: "select", options: [
{ value: "자체교육", label: "자체교육" },
{ value: "온라인·집체교육", label: "온라인·집체교육" }
], required: false
},

{ label: "교육담당자", name: "assigner", type: "text", required: false },
{ label: "강사", name: "trainer", type: "text", required: false },
{ label: "교육자료", name: "eduMaterial", type: "fileUpload", required: false },
{ label: "현장사진", name: "sitePhotos", type: "photoUpload", required: false },
{ label: "첨부파일", name: "fileUpload", type: "fileUpload", required: false },
{ label: "비고", name: "note", type: "textarea", required: false },

{ label: "알림 전송여부", name: "notify", type: "custom", customRender: NotifyToggle, required: false },

{ label: "알림 발송시점", name: "notifyWhen", type: "select", options: [
{ value: "1일 전", label: "1일 전" },
{ value: "1주일 전", label: "1주일 전" },
{ value: "1개월 전", label: "1개월 전" }
], disabled: !notify, required: false
}
]

const handleSave = () => {
console.log("저장 데이터:", { ...formData, notify }, attendees)
navigate("/safety-education")
}

const handleAddAttendee = (att: Attendee) => setAttendees(prev => [...prev, att])
const handleRemoveAttendee = (idx: number) => setAttendees(prev => prev.filter((_, i) => i !== idx))

return (
    <section className="w-full relative" style={{ minHeight: "900px", paddingBottom: "200px" }}>
      <PageTitle>안전보건교육 등록</PageTitle>
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="w-full lg:w-[45%] border border-[#F3F3F3] rounded-[16px] p-3" style={{ minHeight: "700px" }}>
          <FormScreen fields={fields} values={formData} onChange={handleChange} onSave={handleSave} onClose={() => navigate("/safety-education")} notifyEnabled={notify} />
        </div>
        <aside className="w-full lg:flex-1 lg:min-w-[500px] flex flex-col gap-6" style={{ minHeight: "700px" }}>
          <PageTitle className="block lg:hidden">참석자 목록</PageTitle>
          <CertificatePanel targets={attendees} onAdd={handleAddAttendee} onRemove={handleRemoveAttendee} />
        </aside>
      </div>
      <div className="absolute right-4 bottom-4 lg:static lg:mt-8 flex justify-end">
        <Button variant="primary" onClick={handleSave}>저장하기</Button>
      </div>
    </section>
  )
}