import React, { useState } from "react"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import Button from "@/components/common/base/Button"
import PageTitle from "@/components/common/base/PageTitle"

export default function MyPage() {
const [values, setValues] = useState<Record<string, string>>({
userId: "samho003",
name: "박관리",
safetyRole: "경영책임자",
phonePrefix: "010",
phoneMiddle: "",
phoneLast: "",
emailId: "",
emailDomain: "",
emailDomainSelect: "",
currentPassword: "",
newPassword: "",
confirmPassword: "",
signature: "/images/sample-signature.png"
})

const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
const { name, value } = e.target
setValues(prev => ({ ...prev, [name]: value }))
}

const handleDomainSelect = (domain: string) => {
setValues(prev => ({ ...prev, emailDomain: domain, emailDomainSelect: domain }))
}

const handleSubmit = () => {
console.log("폼 제출", values)
}

const fields: Field[] = [
{ label: "아이디", name: "userId", type: "readonly", required: false },
{ label: "이름", name: "name", type: "readonly", required: false },
{ label: "안전직위", name: "safetyRole", type: "readonly", required: false },

{ label: "현재 비밀번호", name: "currentPassword", type: "password", required: true },

{ label: "새 비밀번호", name: "newPassword", type: "password", required: false },
{ label: "비밀번호 확인", name: "confirmPassword", type: "password", required: false, buttonRender: <Button variant="action">비밀번호 확인</Button> },

{ label: "휴대전화번호", name: "phone", type: "phone", required: true, buttonRender: <Button variant="action">인증하기</Button> },

{ label: "이메일", name: "email", type: "email", required: false },

{ label: "서명", name: "signature", type: "signature", required: false }
]

return (
<section className="mypage-content w-full">
<PageTitle>마이페이지</PageTitle>

<FormScreen
fields={fields}
values={values}
onChange={handleChange}
onEmailDomainSelect={handleDomainSelect}
onSubmit={handleSubmit}
onClose={() => {}}
onSave={() => {}}
/>

<div className="flex justify-end mt-5">
<Button variant="primary" onClick={handleSubmit}>저장하기</Button>
</div>
</section>
)
}