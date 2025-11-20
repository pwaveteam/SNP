import { useState } from 'react'
import IndustrySelector from './IndustrySelector'
import ProcessSelector from './ProcessSelector'
import Button from '@/components/common/base/Button'

type StepSelectorProps = {
isOpen: boolean
onClose: () => void
onSubmit: (data: { industry: any; process: any }) => void
}

export default function StepSelector({ isOpen, onClose, onSubmit }: StepSelectorProps) {
const [step, setStep] = useState(1)
const [searchText, setSearchText] = useState('')
const [selectedIndustry, setSelectedIndustry] = useState<any>(null)
const [selectedProcess, setSelectedProcess] = useState<any>(null)

const handleNext = () => { if (selectedIndustry) setStep(2); else alert('업종을 선택해주세요') }
const handleBack = () => { setStep(1); setSelectedProcess(null) }
const handleConfirm = () => { if (selectedIndustry && selectedProcess) { onSubmit({ industry: selectedIndustry, process: selectedProcess }); handleClose() } }
const handleClose = () => { onClose(); setStep(1); setSearchText(''); setSelectedIndustry(null); setSelectedProcess(null) }
if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 bg-black/30 px-3 flex items-center justify-center">
<div className="bg-white w-full h-auto max-h-[80vh] rounded-[12px] p-4 text-sm shadow-lg flex flex-col md:w-[80vw] md:h-[80vh] md:p-6 md:text-base">
<h2 className="text-lg md:text-xl font-semibold text-[#333] mb-4">{step === 1 ? '업종 선택' : '공정 선택'}</h2>
<div className="flex-1 overflow-y-auto">{step === 1 ? (<IndustrySelector searchText={searchText} setSearchText={setSearchText} selectedIndustry={selectedIndustry} setSelectedIndustry={setSelectedIndustry} />) : (<ProcessSelector industry={selectedIndustry} selected={selectedProcess} onSelect={setSelectedProcess} />)}</div>
<div className="mt-4 flex justify-center gap-1 flex-wrap shrink-0">
<Button variant="primaryOutline" onClick={handleClose}>닫기</Button>
{step === 1 && <Button variant="primary" onClick={handleNext}>다음으로</Button>}
{step === 2 && (<><Button variant="primaryOutline" onClick={handleBack}>이전</Button><Button variant="primary" onClick={handleConfirm} disabled={!selectedProcess}>확인</Button></>)}
</div>
</div>
</div>
)
}