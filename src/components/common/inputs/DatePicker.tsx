import React from "react"

interface DatePickerProps {
value: string
onChange: (date: string) => void
placeholder?: string
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder }) => {
return (
<input
type="date"
value={value}
onChange={e => onChange(e.target.value)}
placeholder={placeholder}
className={`
border border-[#A0B3C9] rounded-lg px-[8px] py-[6px] w-[136px]
text-[13px] md:text-[15px] font-sans outline-none appearance-none
`}
/>
)
}

export default DatePicker