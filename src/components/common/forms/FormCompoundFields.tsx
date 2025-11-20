import React from "react"
import RadioGroup from "@/components/common/base/RadioGroup"

type CompoundFieldProps = {
field: { name: string; label?: string }
values: Record<string, any>
onChange: (e: React.ChangeEvent<any>) => void
}

const TEXT = "text-sm md:text-[15px] font-medium"
const FIELD_TITLE = `min-w-[120px] md:min-w-[160px] shrink-0 text-[#666666] ${TEXT}`
const INPUT = `h-[39px] px-2 border border-[#AAAAAA] rounded-[8px] ${TEXT}`
const SELECT = `w-full h-[39px] px-2 pr-8 border border-[#AAAAAA] rounded-[8px] appearance-none ${TEXT}`

export default function FormCompoundFields({ field, values, onChange }: CompoundFieldProps) {
const groupClass = `flex items-center gap-[6px] flex-nowrap ${TEXT}`

if (field.name === "percentCompound") {
return (
<div className="flex flex-col gap-[10px]">
<div className={groupClass}>
<span className={FIELD_TITLE}>물질구분 :</span>
<RadioGroup name="materialType" value={values.materialType} options={[{ value: "단일물질", label: "단일물질" }, { value: "혼합물질", label: "혼합물질" }]} onChange={onChange} />
</div>
<div className={groupClass}>
<span className={FIELD_TITLE}>하루취급량 :</span>
<input name="dailyAmount" value={values.dailyAmount || ""} onChange={onChange} placeholder="하루취급량" className={`w-[190px] ${INPUT}`} />
<div className="relative w-[100px]">
<select name="dailyAmountUnit" value={values.dailyAmountUnit || ""} onChange={onChange} className={SELECT}>
<option value="">단위</option>
<option value="kg">kg</option>
<option value="g">g</option>
<option value="mg">mg</option>
<option value="L">L</option>
<option value="mL">mL</option>
</select>
</div>
</div>
<div className={groupClass}>
<span className={FIELD_TITLE}>함유량 :</span>
<input name="containRatio" value={values.containRatio || ""} onChange={onChange} placeholder="함유량" className={`w-[190px] ${INPUT}`} />
<span className={`${TEXT} text-[#666]`}>%</span>
</div>
</div>
)
}

if (field.name === "volatilityInput") {
return (
<div className="flex flex-col gap-[6px]">
<div className={groupClass}>
<span className={FIELD_TITLE}>사용 온도 :</span>
<input name="useTemp" value={values.useTemp || ""} onChange={onChange} placeholder="사용 온도" className={`w-[300px] ${INPUT}`} />
</div>
<div className={groupClass}>
<span className={FIELD_TITLE}>끓는점 :</span>
<input name="boilingPoint" value={values.boilingPoint || ""} onChange={onChange} placeholder="끓는점" className={`w-[300px] ${INPUT}`} />
</div>
</div>
)
}

if (field.name === "tripleInput") {
return (
<div className="flex flex-col gap-[6px]">
<div className={groupClass}>
<span className={FIELD_TITLE}>발암성(C)값 :</span>
<input name="cmrC" value={values.cmrC || ""} onChange={onChange} placeholder="발암성" className={`w-[300px] ${INPUT}`} />
</div>
<div className={groupClass}>
<span className={FIELD_TITLE}>생식세포변이원성(M)값 :</span>
<input name="cmrM" value={values.cmrM || ""} onChange={onChange} placeholder="생식세포변이원성" className={`w-[300px] ${INPUT}`} />
</div>
<div className={groupClass}>
<span className={FIELD_TITLE}>생식독성(R)값 :</span>
<input name="cmrR" value={values.cmrR || ""} onChange={onChange} placeholder="생식독성" className={`w-[300px] ${INPUT}`} />
</div>
</div>
)
}

if (field.name === "measuredInput") {
return (
<div className="flex gap-[6px] w-full items-center">
<div className={groupClass}>
<input name="twaPpm" value={values.twaPpm || ""} onChange={onChange} placeholder="PPM" className={`w-[130px] ${INPUT}`} />
<span className={`${TEXT} text-[#666]`}>ppm</span>
</div>
<div className={groupClass}>
<input name="twaMg" value={values.twaMg || ""} onChange={onChange} placeholder="㎎" className={`w-[130px] ${INPUT}`} />
<span className={`${TEXT} text-[#666]`}>mg/m³</span>
</div>
</div>
)
}

if (field.name === "textSelect") {
return (
<div className={groupClass}>
<input name="hcodeValue" value={values.hcodeValue || ""} onChange={onChange} placeholder="값 입력" className={`w-[130px] ${INPUT}`} />
<div className="relative w-[80px]">
<select name="hcodeGrade" value={values.hcodeGrade || ""} onChange={onChange} className={SELECT}>
<option value="">등급</option>
<option value="1등급">1등급</option>
<option value="2등급">2등급</option>
<option value="3등급">3등급</option>
<option value="4등급">4등급</option>
</select>
</div>
</div>
)
}

return null
}