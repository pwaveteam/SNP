import { useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import Checkbox from "../components/common/base/Checkbox"

type FormState={id:string;pw:string;remember:boolean}
type ModalType="none"|"forgotId"|"forgotPw"

export default function Login(){
const navigate=useNavigate()
const[form,setForm]=useState<FormState>({id:"",pw:"",remember:false})
const[modal,setModal]=useState<ModalType>("none")
const onSubmit=(e:FormEvent)=>{e.preventDefault();navigate("/dashboard")}
const close=()=>setModal("none")

return(
<div className="relative min-h-screen flex flex-col bg-[url('/images/bg-industrial-navy.jpg')] bg-cover bg-center">
<div className="absolute inset-0 bg-black/60"></div>

<div className="relative flex flex-grow items-center justify-center px-3">
<div className="flex flex-col items-center">

{/* public/logo.svg 사용 */}
<img src="/logo.svg" alt="Company Logo" className="h-14 mb-6 object-contain"/>

<div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-10 md:p-12 min-h-[390px] flex flex-col">
<h2 className="text-3xl font-bold text-center text-white tracking-wide mb-8">로그인</h2>

<form onSubmit={onSubmit} className="space-y-6">
<input type="text" value={form.id} onChange={e=>setForm(s=>({...s,id:e.target.value}))} placeholder="관리자 아이디" className="w-full rounded-md px-4 py-4 bg-white/90 focus:bg-white focus:ring-2 focus:ring-[#031E36] outline-none text-gray-900"/>
<input type="password" value={form.pw} onChange={e=>setForm(s=>({...s,pw:e.target.value}))} placeholder="비밀번호" className="w-full rounded-md px-4 py-4 bg-white/90 focus:bg-white focus:ring-2 focus:ring-[#031E36] outline-none text-gray-900"/>

<div className="flex items-center justify-between">
<button type="button" onClick={()=>setForm(s=>({...s,remember:!s.remember}))} className="flex items-center gap-2 text-gray-200 text-sm select-none">
<Checkbox checked={form.remember} onChange={()=>setForm(s=>({...s,remember:!s.remember}))}/>아이디 저장
</button>

<div className="flex gap-4 text-sm font-normal">
<button type="button" onClick={()=>setModal("forgotId")} className="text-gray-500 hover:text-gray-200 transition-colors">아이디 찾기</button>
<span className="text-gray-500">|</span>
<button type="button" onClick={()=>setModal("forgotPw")} className="text-gray-500 hover:text-gray-200 transition-colors">비밀번호 찾기</button>
</div>
</div>

<button type="submit" className="w-full bg-[#031E36] hover:bg-[#05294A] text-white font-semibold rounded-md py-4 tracking-wide transition-all">로그인</button>
</form>
</div>
</div>
</div>

<footer className="relative z-10 text-center py-4 text-xs text-gray-400 tracking-wide">© Pulsewave Corp. All Rights Reserved.</footer>

{modal!=="none"&&(
<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
<div className="absolute inset-0 bg-black/70" onClick={close}></div>

<div className="relative w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl p-6 md:p-8 text-white">

{modal==="forgotId"&&(
<div className="space-y-5">
<h3 className="text-xl font-semibold text-center">관리자 아이디 찾기</h3>
<input type="text" placeholder="이름" className="w-full rounded-md px-3 py-3 bg-white/90 text-gray-900 focus:ring-2 focus:ring-[#031E36] outline-none"/>
<input type="text" placeholder="연락처" className="w-full rounded-md px-3 py-3 bg-white/90 text-gray-900 focus:ring-2 focus:ring-[#031E36] outline-none" onChange={e=>{e.target.value=e.target.value.replace(/[^0-9]/g,"")}}/>
<div className="flex gap-3">
<button type="button" onClick={close} className="flex-1 bg-white/20 hover:bg-white/30 text-white rounded-md py-3">취소</button>
<button type="button" onClick={()=>{alert("관리자 아이디가 전송되었습니다.");close()}} className="flex-1 bg-[#031E36] hover:bg-[#05294A] text-white rounded-md py-3">확인</button>
</div>
</div>
)}

{modal==="forgotPw"&&(
<div className="space-y-5">
<h2 className="text-xl font-semibold text-center">비밀번호 찾기</h2>
<input type="text" placeholder="관리자 아이디" className="w-full rounded-md px-3 py-3 bg-white/90 text-gray-900 focus:ring-2 focus:ring-[#031E36] outline-none"/>
<input type="text" placeholder="연락처" className="w-full rounded-md px-3 py-3 bg-white/90 text-gray-900 focus:ring-2 focus:ring-[#031E36] outline-none" onChange={e=>{e.target.value=e.target.value.replace(/[^0-9]/g,"")}}/>
<div className="flex gap-3">
<button type="button" onClick={close} className="flex-1 bg-white/20 hover:bg-white/30 text-white rounded-md py-3">취소</button>
<button type="button" onClick={()=>{alert("임시 비밀번호가 전송되었습니다.");close()}} className="flex-1 bg-[#031E36] hover:bg-[#05294A] text-white rounded-md py-3">확인</button>
</div>
</div>
)}
</div>
</div>
)}
</div>
)
}
