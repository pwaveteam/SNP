import React,{ useState,useEffect } from "react"

export interface EditableCellProps{
value:string
onChange:(val:string)=>void
placeholder?:string
className?:string
maxLength?:number
disabled?:boolean
}

const EditableCell:React.FC<EditableCellProps>=({
value,
onChange,
placeholder="",
className="",
maxLength=30,
disabled=false
})=>{
const [inputValue,setInputValue]=useState<string>(value)

useEffect(()=>{
setInputValue(value)
},[value])

const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
let val=e.target.value
if(val.length>maxLength) val=val.slice(0,maxLength)
setInputValue(val)
onChange(val)
}

return(
<div className="w-full py-1">
<input
type="text"
value={inputValue}
onChange={handleChange}
placeholder={placeholder}
disabled={disabled}
className={`
w-full min-w-[80px] px-2 py-1 rounded-lg border border-[var(--border)]
text-xs sm:text-sm md:text-base font-sans text-left outline-none
whitespace-nowrap overflow-hidden text-ellipsis appearance-none
${disabled ? "bg-neutral-bg cursor-not-allowed" : "bg-white"}
${className}
`}
/>
</div>
)
}

export default EditableCell
