import React, {useCallback, useMemo, useState} from "react"
import Button from "@/components/common/base/Button"
import FormScreen, {Field} from "@/components/common/forms/FormScreen"
import ToggleSwitch from "@/components/common/base/ToggleSwitch"
import MachineAutocomplete from "@/components/common/inputs/MachineAutocomplete"
import Checkbox from "@/components/common/base/Checkbox"

type AlertWhen="1일 전"|"1주일 전"|"1개월 전"
type Props={isOpen:boolean;onClose:()=>void;onSave:(data:FormDataState)=>void}
type FormDataState={
name:string;capacityValue:string;capacityUnit:string;quantity:string;location:string;inspectionCycle:string;inspectionDate:string;purpose:string;proof:string;notify:boolean;notifyWhen:AlertWhen;repeat: boolean;
}

type Option={value:string;label:string}
const unitOptions:Option[]=[
{value:"bar",label:"bar"},
{value:"kg",label:"kg"},
{value:"ton",label:"ton"},
{value:"m³",label:"m³"},
{value:"L",label:"L"}
]
const inspectionCycleOptions:Option[]=[
{value:"상시",label:"상시"},
{value:"주간",label:"주간"},
{value:"월간",label:"월간"},
{value:"분기",label:"분기"},
{value:"연간",label:"연간"}
]
const alertTimingOptions:Option[]=[
{value:"1일 전",label:"1일 전"},
{value:"1주일 전",label:"1주일 전"},
{value:"1개월 전",label:"1개월 전"}
]

export default function AssetMachineRegister({isOpen,onClose,onSave}:Props):React.ReactElement|null{
const [formData,setFormData]=useState<FormDataState>({name:"",capacityValue:"",capacityUnit:"bar",quantity:"",location:"",inspectionCycle:"상시",inspectionDate:"",purpose:"",proof:"",notify:false,notifyWhen:"1주일 전",repeat: false})
const numericNames=useMemo(()=>new Set(["quantity","capacity_value"]),[])

const handleChange=useCallback((e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>):void=>{
const {name,value,type,checked}=e.target as HTMLInputElement
if(numericNames.has(name)&&value!==""&&!/^\d*\.?\d*$/.test(value))return
if(type==="checkbox"){setFormData(prev=>({...prev,[name]:checked}));return}
if(name==="fileUpload"){setFormData(prev=>({...prev,proof:value}));return}
if(name==="capacity_value"){setFormData(prev=>({...prev,capacityValue:value}));return}
if(name==="capacity_unit"){setFormData(prev=>({...prev,capacityUnit:value}));return}
setFormData(prev=>({...prev,[name]:value}))
},[numericNames])

const fields: Field[] = [
{
label: "기계/기구/설비명",
name: "name",
type: "custom",
required: true,
customRender: (
<MachineAutocomplete
id="machineName"
value={formData.name}
placeholder="기계명 입력 또는 선택"
onChange={v => setFormData(prev => ({ ...prev, name: v }))}
onSelect={opt => setFormData(prev => ({ ...prev, name: opt.label }))}
className="w-full"
/>
)
},

{
label: "용량/단위",
name: "capacity",
type: "quantityUnit",
placeholder: "용량 입력",
options: unitOptions,
required: true
},

{
label: "수량",
name: "quantity",
type: "quantity",
placeholder: "수량 입력",
required: true
},

{ label: "설치/작업장소", name: "location", type: "text", placeholder: "장소 입력", required: false },

{ label: "점검일", name: "inspectionDate", type: "date", placeholder: "점검일 선택", required: false },

{ label: "용도", name: "purpose", type: "text", placeholder: "용도 입력", required: false },

{
label: "점검주기",
name: "inspectionCycle",
type: "custom",
required: false,
customRender: (
<div className="flex items-center gap-3 w-full">
<select
name="inspectionCycle"
value={formData.inspectionCycle}
onChange={e => {
const v = e.target.value
setFormData(p => ({
...p,
inspectionCycle: v,
repeat: v === "상시" ? false : p.repeat
}))
}}
className="h-[36px] border border-[#AAAAAA] rounded-[8px] px-3 bg-white text-sm text-[#333639]"
>
{inspectionCycleOptions.map(opt => (
<option key={opt.value} value={opt.value}>
{opt.label}
</option>
))}
</select>

<span className="text-sm text-[#333639]">반복여부</span>

<Checkbox
checked={formData.repeat}
onChange={() => setFormData(p => ({ ...p, repeat: !p.repeat }))}
/>
</div>
)
},

{
label: "알림 전송여부",
name: "notify",
type: "custom",
required: false,
customRender: (
<ToggleSwitch
checked={formData.notify}
onChange={checked => setFormData(prev => ({ ...prev, notify: checked }))}
/>
)
},

{
label: "알림 발송시점",
name: "notifyWhen",
type: "select",
required: false,
options: alertTimingOptions,
placeholder: "알림 발송시점 선택"
},

{
label: "첨부파일",
name: "fileUpload",
type: "fileUpload",
required: false
}
]

if(!isOpen)return null

const valuesForForm:{[key:string]:string}={
name:formData.name,
capacity_value:formData.capacityValue,
capacity_unit:formData.capacityUnit,
quantity:formData.quantity,
location:formData.location,
inspectionDate:formData.inspectionDate,
purpose:formData.purpose,
inspectionCycle:formData.inspectionCycle,
fileUpload:formData.proof,
notify:formData.notify?"true":"",
notifyWhen:formData.notifyWhen
}

return(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
<h2 className="text-2xl font-semibold tracking-wide mb-3">위험기계/기구/설비 등록</h2>
<FormScreen
fields={fields}
values={valuesForForm}
onChange={handleChange}
onClose={onClose}
onSave={()=>onSave(formData)}
isModal
notifyEnabled={formData.notify}
/>
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={()=>onSave(formData)}>저장하기</Button>
</div>
</div>
</div>
)
}