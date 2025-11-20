// src/components/common/base/Dialog.tsx
import React from "react"
import { X } from "lucide-react"

type Size="sm"|"md"|"lg"
type DialogProps={title?:string;onClose:()=>void;children:React.ReactNode;size?:Size;className?:string}
const sz:Record<Size,string>={sm:"max-w-sm",md:"max-w-md",lg:"max-w-lg"}

const Dialog:React.FC<DialogProps>=({title,onClose,children,size="md",className=""})=>(
<div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" role="dialog" aria-modal="true" onClick={onClose}>
<div className={`bg-white w-full ${sz[size]} rounded-[16px] shadow-lg relative border border-[#E0E6EA] p-6 ${className}`} onClick={e=>e.stopPropagation()}>
<button type="button" aria-label="닫기" onClick={onClose} className="absolute top-4 right-4 inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus-visible:ring-1 focus-visible:ring-gray-300 transition"><X size={19}/></button>
{title&&<div className="flex items-center justify-between mb-4 border-b pb-2"><h2 className="text-lg font-semibold text-gray-900">{title}</h2></div>}
{children}
</div>
</div>
)

export default Dialog