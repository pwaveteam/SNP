import React from "react"

type ToggleSwitchProps={
  checked:boolean
  onChange:(checked:boolean)=>void
}

export default function ToggleSwitch({checked,onChange}:ToggleSwitchProps){
  return(
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={e=>{e.stopPropagation();onChange(!checked)}}
      className={`ml-0.5 relative inline-flex items-center h-6 w-10 rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${
        checked ? "bg-[var(--secondary)]" : "bg-gray-300"
      }`}
      style={{opacity:0.9}}
    >
      <span
        className={`flex items-center justify-center self-center w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${
          checked ? "translate-x-[18px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  )
}