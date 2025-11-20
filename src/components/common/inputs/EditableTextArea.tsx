import React,{ useState,useEffect } from "react"

export interface EditableTextAreaProps{
value:string
onChange:(val:string)=>void
placeholder?:string
className?:string
maxLength?:number
disabled?:boolean
rows?:number
}

const EditableTextArea:React.FC<EditableTextAreaProps>=({
value,
onChange,
placeholder="",
className="",
maxLength=100,
disabled=false,
rows=3
})=>{
const [textValue,setTextValue]=useState<string>(value)

useEffect(()=>{
setTextValue(value)
},[value])

const handleChange=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
let val=e.target.value
if(val.length>maxLength) val=val.slice(0,maxLength)
setTextValue(val)
onChange(val)
}

return(
<div className="w-full py-1">
<textarea
value={textValue}
onChange={handleChange}
placeholder={placeholder}
disabled={disabled}
rows={rows}
className={`
w-full min-w-[80px] px-2 py-1 rounded-lg border border-[var(--border)]
text-xs sm:text-sm md:text-base text-left outline-none resize-none appearance-none leading-tight
${disabled ? "bg-neutral-bg cursor-not-allowed" : "bg-white"}
${className}
`}
/>
</div>
)
}

export default EditableTextArea