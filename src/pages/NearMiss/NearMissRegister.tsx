import React, { useState } from "react"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"

type Props = { isOpen: boolean; onClose: () => void; onSave: (data: { content: string; place: string; photo: string }) => void }
type FormData = { content: string; place: string; photo: string }

export default function NearMissRegisterModal({ isOpen, onClose, onSave }: Props) {
const [formData, setFormData] = useState<FormData>({ content: "", place: "", photo: "" })

const fields: Field[] = [
{ label: "장소", name: "place", type: "text", placeholder: "장소 입력", required: true },
{ label: "내용", name: "content", type: "textarea", placeholder: "내용 입력", required: true },
{ label: "현장사진", name: "photos", type: "photoUpload", required: false }
]

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
}

const handleSave = () => { onSave(formData) }

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto transform transition duration-300 ease-in-out scale-100 opacity-100">
<h2 className="text-2xl font-semibold tracking-wide mb-3">아차사고 등록</h2>
<FormScreen fields={fields} values={formData} onChange={handleChange} onClose={onClose} onSave={handleSave} isModal={true} />
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>
)
}