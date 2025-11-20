import React, { useState } from "react"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import RadioGroup from "@/components/common/base/RadioGroup"
import FormCompoundFields from "@/components/common/forms/FormCompoundFields"

type Props = { isOpen: boolean; onClose: () => void; onSave: (data: any) => void }

export default function ChemicalRegister({ isOpen, onClose, onSave }: Props) {
const [formData, setFormData] = useState({ processName: "", productName: "", chemicalName: "", casNo: "", aliasName: "", exposureLimitValue: "", exposureLimitUnit: "", dailyUsageValue: "", dailyUsageUnit: "", storageAmountValue: "", storageAmountUnit: "", healthCheck: "예", occupationalDisease: "예", environmentSurvey: "예", corrosive: "예", toxicity: "", adverseReaction: "", registrationDate: "", inspectionCycle: "", nonAcidic: "", msds: null as File | null, note: "", notify: false, notifyWhen: "1일 전", cmrC: "", cmrM: "", cmrR: "", twaPpm: "", twaMg: "", hcodeValue: "", hcodeGrade: "", materialType: "", dailyAmount: "", dailyAmountUnit: "", containRatio: "", useTemp: "", boilingPoint: "", ventilationStatus: "" })

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
const { name, value, type, checked, files } = e.target as HTMLInputElement
if (name.endsWith("Value") && value !== "" && !/^\d*\.?\d*$/.test(value)) return
if (type === "checkbox") setFormData(prev => ({ ...prev, [name]: checked }))
else if (type === "file") setFormData(prev => ({ ...prev, msds: files?.[0] || null }))
else setFormData(prev => ({ ...prev, [name]: value }))
}

const concentrationUnits = [ { value: "ppb", label: "ppb" }, { value: "ppm", label: "ppm" }, { value: "mg/m³", label: "mg/m³" }, { value: "µg/m³", label: "µg/m³" }, { value: "mg/L", label: "mg/L" }, { value: "µg/L", label: "µg/L" } ]
const usageUnits = [ { value: "µL", label: "µL" }, { value: "mL", label: "mL" }, { value: "L", label: "L" }, { value: "cm³", label: "cm³" }, { value: "m³", label: "m³" }, { value: "µg", label: "µg" }, { value: "mg", label: "mg" }, { value: "g", label: "g" }, { value: "kg", label: "kg" } ]
const storageUnits = [ { value: "ng", label: "ng" }, { value: "µg", label: "µg" }, { value: "mg", label: "mg" }, { value: "g", label: "g" }, { value: "kg", label: "kg" }, { value: "t", label: "t" }, { value: "µL", label: "µL" }, { value: "mL", label: "mL" }, { value: "L", label: "L" }, { value: "cm³", label: "cm³" }, { value: "m³", label: "m³" } ]
const inspectionCycleOptions = [ { value: "상시", label: "상시" }, { value: "주간", label: "주간" }, { value: "월간", label: "월간" }, { value: "분기", label: "분기" }, { value: "연간", label: "연간" } ]
const alertTimingOptions = [ { value: "1일 전", label: "1일 전" }, { value: "1주일 전", label: "1주일 전" }, { value: "1개월 전", label: "1개월 전" } ]
const nonAcidicOptions = [ { value: "해당 없음", label: "해당 없음" }, { value: "비산성 (측정결과 없음)", label: "비산성 (측정결과 없음)" } ]

const upperFields: Field[] = [
{ label: "공정명", name: "processName", type: "text", placeholder: "공정명 입력", required: false },
{ label: "제품명", name: "productName", type: "text", placeholder: "제품명 입력", required: false },
{ label: "화학물질명", name: "chemicalName", type: "autocomplete", placeholder: "화학물질명 입력 또는 검색" },
{ label: "CAS No", name: "casNo", type: "autocomplete", placeholder: "CAS NO 입력 또는 검색", required: false },
{ label: "평가일자", name: "registrationDate", type: "date", placeholder: "평가일자 선택", required: false, showPlusOne: false }
]

const detailFields: Field[] = [
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">특수건강검진 결과<br />직업병유소견자 유무</span>, name: "healthCheck", type: "custom", customRender: (<RadioGroup name="healthCheck" value={formData.healthCheck} options={[{ value: "유", label: "유" }, { value: "무", label: "무" }]} onChange={handleChange} />) },
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">직업환경 측정 유무</span>, name: "environmentSurvey", type: "custom", customRender: (<RadioGroup name="environmentSurvey" value={formData.environmentSurvey} options={[{ value: "유", label: "유" }, { value: "무", label: "무" }]} onChange={handleChange} />) },
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">성상</span>, name: "corrosive", type: "custom", customRender: (<RadioGroup name="corrosive" value={formData.corrosive} options={[{ value: "고체/흄/분진", label: "고체/흄/분진" }, { value: "액체/가스/증기/미스트", label: "액체/가스/증기/미스트" }]} onChange={handleChange} />) },
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">측정값<br /><span className="text-[#999999]">(측정결과있는 경우)</span></span>, name: "measuredInput", type: "custom", required: false, customRender: (<FormCompoundFields field={{ name: "measuredInput" }} values={formData} onChange={handleChange} />) },
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">첨부파일 (MSDS)</span>, name: "msds", type: "fileUpload", required: false },
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">함유량%<br /><span className="text-[#999999]">(측정결과 없는경우)</span></span>, name: "percentCompound", type: "custom", required: false, customRender: (<FormCompoundFields field={{ name: "percentCompound" }} values={formData} onChange={handleChange} />) },
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">비산성<br /><span className="text-[#999999]">(측정결과 없는 경우)</span></span>, name: "nonAcidic", type: "select", required: false, options: [
{ value: "1. 부스러지지 않는 고체로 취급 중에 거의 먼지가 보이지 않음 (저)", label: "1. 부스러지지 않는 고체로 취급 중에 거의 먼지가 보이지 않음 (저)" },
{ value: "2. 결정형 입상으로 취급 시 먼지가 보이나 쉽게 가라앉음 (중)", label: "2. 결정형 입상으로 취급 시 먼지가 보이나 쉽게 가라앉음 (중)" },
{ value: "3. 미세하고 가벼운 분말로 취급 시 먼지 구름 생성 (고)", label: "3. 미세하고 가벼운 분말로 취급 시 먼지 구름 생성 (고)" }
], placeholder: "선택" },
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">휘발성 정보<br /><span className="text-[#999999]">(측정결과 없는 경우)</span></span>, name: "volatilityInput", type: "custom", required: false, customRender: (<FormCompoundFields field={{ name: "volatilityInput" }} values={formData} onChange={handleChange} />) },
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">밀폐·환기상태<br /><span className="text-[#999999]">(측정결과 없는 경우)</span></span>, name: "ventilationStatus", type: "custom", required: false, customRender: (<RadioGroup name="ventilationStatus" value={formData.ventilationStatus} options={[{ value: "해당없음", label: "해당없음" }, { value: "원격조작/완전밀폐", label: "원격조작/완전밀폐" }, { value: "국소배기장치", label: "국소배기장치" }]} onChange={handleChange} />) }
]


const hazardFields: Field[] = [
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">CMR</span>, name: "tripleInput", type: "custom", required: false, customRender: (<FormCompoundFields field={{ name: "tripleInput" }} values={formData} onChange={handleChange} />) },
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">노출기준(TWA값)</span>, name: "measuredInput", type: "custom", required: false, customRender: (<FormCompoundFields field={{ name: "measuredInput" }} values={formData} onChange={handleChange} />) },
{ label: <span className="inline-block min-w-[110px] md:min-w-[130px]">유해-위험문구<br /><span className="text-[#999999]">(H-Code)</span></span>, name: "textSelect", type: "custom", required: false, customRender: (<FormCompoundFields field={{ name: "textSelect" }} values={formData} onChange={handleChange} />) }
]


if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[900px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
<h2 className="text-2xl font-semibold tracking-wide mb-3">화학물질 등록</h2>
<div className="mb-6 border-b pb-4"><p className="text-lg font-semibold mb-1">화학물질 추가 및 위험성평가 실시</p><FormScreen fields={upperFields} values={formData} onChange={handleChange} isModal /></div>
<div className="pt-1"><p className="text-lg font-semibold mb-1">노출수준</p><FormScreen fields={detailFields} values={formData} onChange={handleChange} isModal /></div>
<div className="border-t pt-6 mt-6"><p className="text-lg font-semibold mb-1">유해성</p><FormScreen fields={hazardFields} values={formData} onChange={handleChange} isModal /></div>
<div className="mt-6 flex justify-center gap-1"><Button variant="primaryOutline" onClick={onClose}>닫기</Button><Button variant="primary" onClick={() => onSave(formData)}>저장하기</Button></div>
</div>
</div>
)
}