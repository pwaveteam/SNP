import React from "react"

interface YearPickerProps {
year: string
onChange: (year: string) => void
}

const YearPicker: React.FC<YearPickerProps> = ({ year, onChange }) => {
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => (currentYear - 4 + i).toString())

return (
<select
name="year"
value={year}
onChange={e => onChange(e.target.value)}
className="border border-[#AAAAAA] rounded-[100px] px-4 text-sm md:text-[15px] text-[#666666] h-[39px] w-[110px] appearance-none pr-12"
style={{
backgroundImage: "url(\"data:image/svg+xml,%3csvg fill='%23666666' height='32' viewBox='0 0 24 24' width='32' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e\")",
backgroundRepeat: "no-repeat",
backgroundPosition: "right 10px center",
backgroundSize: "28px 30px",
}}>
{years.map(y => (<option key={y} value={y}>{y}</option>))}
</select>
)
}

export default YearPicker