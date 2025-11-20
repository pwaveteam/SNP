import React from "react"
import Button from "@/components/common/base/Button"

interface FilterBarProps{
showDateRange?:boolean
startDate?:string
endDate?:string
onStartDate?:(date:string)=>void
onEndDate?:(date:string)=>void
keyword?:string
onKeywordChange?:(value:string)=>void
searchText?:string
onSearchText?:(value:string)=>void
educationTarget?:string
onEducationTargetChange?:(value:string)=>void
educationMethod?:string
onEducationMethodChange?:(value:string)=>void
inspectionField?:string
onInspectionFieldChange?:(value:string)=>void
inspectionKind?:string
onInspectionKindChange?:(value:string)=>void
onSearch:()=>void
}

const TEXT_CLASS="text-gray-800"
const INPUT_CLASS=`h-[36px] border border-[var(--border)] rounded-[8px] px-3 bg-white
focus:outline-none focus:ring-1 focus:ring-[var(--secondary)]
text-sm font-normal ${TEXT_CLASS} placeholder:text-gray-500`

const targetOptions=[
{value:"",label:"교육대상 선택"},
{value:"근로자 교육",label:"근로자 교육"},
{value:"관리자 교육",label:"관리자 교육"},
{value:"기타 교육",label:"기타 교육"}
]

const methodOptionsEdu=[
{value:"",label:"교육방식 선택"},
{value:"자체교육",label:"자체교육"},
{value:"온라인·집체교육",label:"온라인·집체교육"}
]

export const inspectionFieldOptions=[
{value:"",label:"점검분야 선택"},
{value:"시설물",label:"시설물"},
{value:"자산(설비)",label:"자산(설비)"},
{value:"자율점검",label:"자율점검"}
]

export const inspectionKindOptions=[
{value:"",label:"점검종류 선택"},
{value:"정기점검",label:"정기점검"},
{value:"수시점검",label:"수시점검"},
{value:"특별점검",label:"특별점검"},
{value:"일일점검",label:"일일점검"}
]

const renderSelect=(value:string,onChange:(v:string)=>void,options:{value:string;label:string}[])=>(
<select
className={`${INPUT_CLASS} w-[160px] appearance-none pr-8`}
value={value}
onChange={e=>onChange(e.target.value)}
>
{options.map(opt=>(
<option key={opt.value} value={opt.value}>{opt.label}</option>
))}
</select>
)

const FilterBar:React.FC<FilterBarProps>=({
showDateRange=true,
startDate,
endDate,
onStartDate,
onEndDate,
keyword,
onKeywordChange,
searchText,
onSearchText,
educationTarget,
onEducationTargetChange,
educationMethod,
onEducationMethodChange,
inspectionField,
onInspectionFieldChange,
inspectionKind,
onInspectionKindChange,
onSearch
})=>{
const shouldShowDate=Boolean(showDateRange&&startDate!==undefined&&endDate!==undefined&&onStartDate&&onEndDate)

return(
<section className="tbm-filter w-full flex flex-wrap items-center gap-3 px-3 py-3 mb-3 bg-white border border-[var(--border)] rounded-[10px]">
<div className="flex flex-wrap items-center gap-3 flex-grow min-w-0">

{shouldShowDate&&(
<div className="flex items-center gap-x-3 flex-shrink-0 w-full sm:w-auto min-w-[280px]">
<span className="text-sm font-medium text-gray-800 whitespace-nowrap">기간 선택</span>
<input type="date" className={`${INPUT_CLASS} w-[130px]`} value={startDate} onChange={e=>onStartDate!(e.target.value)}/>
<span className={`text-sm font-normal ${TEXT_CLASS} select-none`}>~</span>
<input type="date" className={`${INPUT_CLASS} w-[130px]`} value={endDate} onChange={e=>onEndDate!(e.target.value)}/>
</div>
)}

{educationTarget!==undefined&&educationMethod!==undefined&&onEducationTargetChange&&onEducationMethodChange&&(
<div className="flex flex-nowrap gap-3 w-full sm:w-auto flex-shrink-0">
{renderSelect(educationTarget,onEducationTargetChange,targetOptions)}
{renderSelect(educationMethod,onEducationMethodChange,methodOptionsEdu)}
</div>
)}

{(inspectionField!==undefined&&onInspectionFieldChange)||(inspectionKind!==undefined&&onInspectionKindChange)?(
<div className="flex flex-nowrap gap-3 w-full sm:w-auto flex-shrink-0">
{inspectionField!==undefined&&onInspectionFieldChange&&renderSelect(inspectionField,onInspectionFieldChange,inspectionFieldOptions)}
{inspectionKind!==undefined&&onInspectionKindChange&&renderSelect(inspectionKind,onInspectionKindChange,inspectionKindOptions)}
</div>
):null}

{(keyword!==undefined&&onKeywordChange)||(searchText!==undefined&&onSearchText)?(
<div className="flex items-center gap-x-3 flex-shrink-0 w-full sm:w-auto min-w-[300px] max-w-[360px]">
<div className="flex items-center gap-1">
<input
type="text"
className={`${INPUT_CLASS} w-[250px]`}
placeholder="검색어 입력"
value={keyword??searchText??""}
onChange={e=>{
if(onKeywordChange)onKeywordChange(e.target.value)
else if(onSearchText)onSearchText(e.target.value)
}}
/>
<Button variant="primary" className="h-[36px] px-5 text-xs md:text-sm" onClick={onSearch}>
검색
</Button>
</div>
</div>
):null}

</div>
</section>
)
}

export default FilterBar