import React,{useState,useCallback}from'react'
import{Search,X}from'lucide-react'
import Button from'@/components/common/base/Button'
import{Input}from'@/components/ui/input'
import{SignatureSelectorProps}from'./types'

const MOCK_ORG_DATA=[{name:'홍길동',phone:'010-1234-5678',position:'생산반장'},{name:'김철수',phone:'010-2345-6789',position:'생산팀장'},{name:'박안전',phone:'010-4567-8901',position:'안전담당자'},{name:'최관리',phone:'010-5678-9012',position:'관리책임자'},{name:'이작업',phone:'010-9999-8888',position:'작업반장'}]

export default function SignatureSelector({value,onChange,disabled}:SignatureSelectorProps){
const[isOpen,setIsOpen]=useState(false)
const[activeTab,setActiveTab]=useState<'org'|'manual'>('org')
const[searchTerm,setSearchTerm]=useState('')
const[manualForm,setManualForm]=useState({name:'',phone:''})

const formatPhone=(v:string)=>{
const only=v.replace(/[^0-9]/g,'')
if(only.length<=3)return only
if(only.length<=7)return`${only.slice(0,3)}-${only.slice(3)}`
return`${only.slice(0,3)}-${only.slice(3,7)}-${only.slice(7,11)}`
}

const filteredOrgData=MOCK_ORG_DATA.filter(p=>p.name.includes(searchTerm))

const handleOrgSelect=useCallback((person:typeof MOCK_ORG_DATA[0])=>{
onChange({...person,source:'org'})
setIsOpen(false)
setSearchTerm('')
},[onChange])

const handleManualSubmit=useCallback(()=>{
if(!manualForm.name.trim()||!manualForm.phone.trim()){
alert('이름과 연락처를 입력해주세요')
return
}
const phoneRegex=/^010-\d{4}-\d{4}$/
if(!phoneRegex.test(manualForm.phone)){
alert('연락처 형식이 올바르지 않습니다 (예: 010-1234-5678)')
return
}
onChange({name:manualForm.name,phone:manualForm.phone,position:'',source:'manual'})
setIsOpen(false)
setManualForm({name:'',phone:''})
},[manualForm,onChange])

const handleClose=useCallback(()=>{
setIsOpen(false)
setSearchTerm('')
setManualForm({name:'',phone:''})
},[])

return(
<>
{value?(
<button onClick={()=>!disabled&&setIsOpen(true)} disabled={disabled} className="text-center py-2 w-full hover:bg-gray-50 transition cursor-pointer disabled:cursor-default disabled:hover:bg-transparent">
<div className="text-sm font-medium text-gray-800">{value.name}</div>
<div className="text-xs text-gray-500 mt-0.5">{value.phone}</div>
</button>
):(
<div className="text-center py-2">
<Button variant="action" onClick={()=>setIsOpen(true)} disabled={disabled} className="text-xs h-8">결재자 선택</Button>
</div>
)}

{isOpen&&(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-lg shadow-xl w-[500px] max-h-[600px] flex flex-col">
<div className="flex items-center justify-between p-4 border-b">
<h3 className="text-lg font-semibold text-gray-800">결재자 선택</h3>
<button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition">
<X size={20}/>
</button>
</div>

<div className="flex border-b">
<button onClick={()=>setActiveTab('org')} className={`flex-1 py-3 text-sm font-medium transition ${activeTab==='org'?'text-[var(--secondary)] border-b-2 border-[var(--secondary)]':'text-gray-500 hover:text-[var(--secondary)]'}`}>조직도 선택</button>
<button onClick={()=>setActiveTab('manual')} className={`flex-1 py-3 text-sm font-medium transition ${activeTab==='manual'?'text-[var(--secondary)] border-b-2 border-[var(--secondary)]':'text-gray-500 hover:text-[var(--secondary)]'}`}>직접 입력</button>
</div>

<div className="flex-1 overflow-auto p-4">
{activeTab==='org'?(
<div>
<div className="mb-3 relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
<Input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="이름 검색" className="pl-10"/>
</div>

<div className="max-h-[350px] overflow-auto space-y-2">
{filteredOrgData.length===0?(
<div className="text-center py-6 text-sm text-gray-400">검색 결과가 없습니다</div>
):(
filteredOrgData.map((person,index)=>(
<button key={index} onClick={()=>handleOrgSelect(person)} className="w-full p-2 border border-gray-200 rounded-lg hover:border-[var(--secondary)] hover:bg-[var(--neutral-bg)] transition text-left">
<div className="flex items-center justify-between">
<div>
<div className="font-medium text-gray-800 text-sm">{person.name}</div>
<div className="text-xs text-gray-500 mt-0.5">{person.position}</div>
</div>
<div className="text-xs text-gray-600">{person.phone}</div>
</div>
</button>
))
)}
</div>
</div>
):(
<div className="space-y-3">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1 text-left">이름</label>
<Input value={manualForm.name} onChange={e=>setManualForm({...manualForm,name:e.target.value})} placeholder="이름 입력"/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1 text-left">연락처</label>
<Input value={manualForm.phone} onChange={e=>setManualForm({...manualForm,phone:formatPhone(e.target.value)})} placeholder="010-1234-5678" maxLength={13}/>
</div>

<div className="flex justify-end gap-2 pt-1">
<Button variant="action" onClick={handleClose}>취소</Button>
<Button variant="action" onClick={handleManualSubmit}>등록</Button>
</div>
</div>
)}
</div>
</div>
</div>
)}
</>
)}