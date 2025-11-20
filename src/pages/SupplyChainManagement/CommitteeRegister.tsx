import React, { useState } from "react"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"

type Props = { isOpen: boolean; onClose: () => void; onSave: (data: any) => void }

const fields: Field[] = [
{ label:"회의일", name:"contractDate", type:"date", placeholder:"날짜 선택", required:true },
{ label:"회의시간", name:"contractTime", type:"timeRange", placeholder:"시간 선택", required:true },
{ label:"회의장소", name:"meetingPlace", type:"text", placeholder:"회의장소 입력", required:true },
{ label:"참석자(도급인)", name:"attendeeClient", type:"text", placeholder:"도급인 참석자 입력", required:false },
{ label:"참석자(수급인)", name:"attendeeSubcontractor", type:"text", placeholder:"수급인 참석자 입력", required:false },
{ label:"회의내용", name:"note", type:"textarea", placeholder:"회의내용 입력", required:true },
{ label:"회의록", name:"contractFile", type:"fileUpload", placeholder:"파일명 입력", required:true },
{ label:"현장사진", name:"fileUpload", type:"photoUpload", required:false }
]

export default function ContractDocumentRegister({ isOpen, onClose, onSave }: Props) {
const [formData, setFormData] = useState({
contractDate:"", startHour:"", startMinute:"", endHour:"", endMinute:"",
meetingPlace:"", attendeeClient:"", attendeeSubcontractor:"",
note:"", contractFile:"", fileUpload:""
})

const handleFormChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
}

const handleSubmit = () => { onSave(formData) }

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[900px] max-w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
<h2 className="text-2xl font-semibold mb-4">회의록 등록</h2>
<FormScreen
fields={fields}
values={formData}
onChange={handleFormChange}
onClose={onClose}
onSave={handleSubmit}
isModal={false}
/>
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={handleSubmit}>저장하기</Button>
</div>
</div>
</div>
)
}