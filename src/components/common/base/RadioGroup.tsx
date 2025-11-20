import React from "react"

interface Option{value:string;label:string}
interface RadioGroupProps{
  name:string
  value:string
  options:Option[]
  onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void
  className?:string
}

export default function RadioGroup({name,value,options,onChange,className}:RadioGroupProps){
  return(
    <div className={`flex items-center gap-3 pl-1 ${className||""}`}>
      {options.map(opt=>(
        <label key={opt.value} className="flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value===opt.value}
            onChange={onChange}
            className="h-3 w-3"
            style={{accentColor:"var(--secondary)"}}
          />
          <span className="text-[15px]">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}