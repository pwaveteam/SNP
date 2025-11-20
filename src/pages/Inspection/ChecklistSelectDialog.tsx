import React,{useCallback,useMemo,useState}from"react"
import Dialog from"@/components/common/base/Dialog"
import Button from"@/components/common/base/Button"

interface ChecklistSelectDialogProps{onClose:()=>void;onConfirm:(selected:string)=>void}
type Checklist={id:string;name:string}

const MOCK_CHECKLISTS:Checklist[]=[{id:"chk-1",name:"전기설비 정기점검표"},{id:"chk-2",name:"소방시설 점검표"},{id:"chk-3",name:"작업장 안전점검표"}]

const COLOR={text:"#333639",headText:"#666",border:"#CCCCCC",headBg:"#EFEFF3"}
const TH=`text-[13px] font-semibold text-[${COLOR.headText}] bg-[${COLOR.headBg}] border-b border-[${COLOR.border}] px-3 py-2`
const TD=`text-[13px] text-[${COLOR.text}] px-3 py-2 border-b border-[${COLOR.border}]`

const ChecklistSelectDialog:React.FC<ChecklistSelectDialogProps>=({onClose,onConfirm})=>{
const hasData=useMemo(()=>MOCK_CHECKLISTS.length>0,[])
const defaultId=useMemo(()=>hasData?MOCK_CHECKLISTS[0].id:null,[hasData])
const[selectedId,setSelectedId]=useState<string|null>(defaultId)
const selectRow=useCallback((id:string)=>{setSelectedId(id)},[])
const confirm=useCallback(()=>{if(!selectedId){alert("점검표를 선택하세요");return}const selected=MOCK_CHECKLISTS.find(chk=>chk.id===selectedId);if(!selected){alert("점검표를 찾을 수 없습니다");return}onConfirm(selected.name);onClose()},[onClose,onConfirm,selectedId])

return(<Dialog title="점검표 선택" onClose={onClose} size="lg" className="w-[96vw] !max-w-[600px]">
<div className="flex flex-col">
<div className="px-1 h-[26px] flex items-center"><div className="text-[13px] font-semibold text-[#333639]">점검표 목록</div></div>
<div className={`border border-[${COLOR.border}] rounded-xl overflow-hidden h-[360px]`}>
<div className="h-full overflow-auto">
<table className="w-full table-fixed">
<thead><tr><th className={TH}>점검표명</th></tr></thead>
<tbody>
{MOCK_CHECKLISTS.map(chk=>{const active=chk.id===selectedId;return(<tr key={chk.id} onClick={()=>selectRow(chk.id)} className={`cursor-pointer select-none ${active?"bg-[#FBFBFB]":"hover:bg-[#FBFBFB]"}`}><td className={`${TD} truncate`}>{chk.name}</td></tr>)})}
{MOCK_CHECKLISTS.length===0&&(<tr><td className={TD}>등록된 항목이 없습니다.</td></tr>)}
</tbody>
</table>
</div>
</div>
</div>
<div className="mt-4 flex justify-center"><Button variant="primary" onClick={confirm} className="min-w-[90px]">확인</Button></div>
</Dialog>)}

export default ChecklistSelectDialog