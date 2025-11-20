import React, { useState } from "react"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"

type Props = { isOpen: boolean; onClose: () => void; onSave: (data: any) => void }

export default function SiteManagementRegister({ isOpen, onClose, onSave }: Props) {
const [formData, setFormData] = useState({
inspectionDate:"", inspectionType:"", inspectionName:"",
inspectionPlace:"", inspectionResult:"", note:"",
inspector:"", fileUpload:""
})

const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
}

const fields: Field[] = [
{ label:"점검일자", name:"inspectionDate", type:"date", placeholder:"점검일자 선택", required:true },
{ label:"점검종류", name:"inspectionType", type:"select", options:[
{ value:"정기점검", label:"정기점검" },
{ value:"수시점검", label:"수시점검" },
{ value:"특별점검", label:"특별점검" },
{ value:"합동점검", label:"합동점검" },
{ value:"기타", label:"기타" }
], placeholder:"점검종류 선택", required:true },
{ label:"점검계획명", name:"inspectionName", type:"text", placeholder:"점검계획명 입력", required:true },
{ label:"점검결과", name:"inspectionResult", type:"select", options:[
{ value:"이상없음", label:"이상없음" },
{ value:"경미한 지적사항", label:"경미한 지적사항" },
{ value:"중대 위험요인", label:"중대 위험요인" },
{ value:"시정조치 완료", label:"시정조치 완료" }
], placeholder:"점검결과 선택", required:true },
{ label:"비고사항", name:"note", type:"textarea", placeholder:"비고 입력", required:false },
{ label:"점검자", name:"inspector", type:"text", placeholder:"점검자 성명 입력", required:false },
{ label:"현장사진", name:"inspectionPlace", type:"photoUpload", required:false },
{ label:"첨부자료", name:"fileUpload", type:"fileUpload", required:false }
]

const handleSubmit = () => { onSave(formData) }

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
<h2 className="text-2xl font-semibold tracking-wide mb-4">안전보건 점검 등록</h2>
<FormScreen
fields={fields}
values={formData}
onChange={handleChange}
onClose={onClose}
onSave={handleSubmit}
isModal={true}
/>
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={handleSubmit}>저장하기</Button>
</div>
</div>
</div>
)
}