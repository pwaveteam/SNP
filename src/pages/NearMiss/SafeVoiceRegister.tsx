import React, { useState } from "react"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import ToggleSwitch from "@/components/common/base/ToggleSwitch"

type Props = { isOpen: boolean; onClose: () => void; onSave: (data: { content: string; photo: string; anonymous: boolean }) => void }

export default function SafeVoiceRegisterModal({ isOpen, onClose, onSave }: Props) {
const [formData, setFormData] = useState({ content: "", photo: "", anonymous: false })

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
const { name, value } = e.target
setFormData(prev => ({ ...prev, [name]: value }))
}

const AnonymousToggle = (<ToggleSwitch checked={formData.anonymous} onChange={checked => setFormData(prev => ({ ...prev, anonymous: checked }))} />)

const fields: Field[] = [
{ label: "내용", name: "content", type: "textarea", placeholder: "내용을 입력하세요", required: true },
{ label: "현장사진", name: "photo", type: "photoUpload", required: false },
{ label: "익명", name: "anonymous", type: "custom", customRender: AnonymousToggle, required: false }
] 

const handleSave = () => { onSave(formData) }

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto transform transition duration-300 ease-in-out scale-100 opacity-100">
<h2 className="text-2xl font-semibold tracking-wide mb-3">안전보이스 등록</h2>
<FormScreen
fields={fields}
values={{ ...formData, anonymous: formData.anonymous ? "true" : "false" } as { [key: string]: string }}
onChange={handleChange}
onClose={onClose}
onSave={handleSave}
isModal={true}
/>
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>
)
}