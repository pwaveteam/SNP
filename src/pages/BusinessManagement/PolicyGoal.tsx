import React,{useState,useRef} from "react"
import FormScreen from "@/components/common/forms/FormScreen"
import Button from "@/components/common/base/Button"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import YearPicker from "@/components/common/inputs/YearPicker"
import { Upload, Download, Printer, Trash2, Save, X } from "lucide-react"
import { Document, Packer, Paragraph, TextRun } from "docx"
import { saveAs } from "file-saver"

type Field={label:string,name:string,type:"text"|"textarea"|"custom",placeholder?:string,style?:React.CSSProperties,customRender?:React.ReactNode}

const PolicyGoal:React.FC=()=>{
const[values,setValues]=useState<{[key:string]:string}>({
year:"2025",
goalTitle:"현장 위험요인 실시간 식별 및 제거",
content:`(주)***은 경영활동 전반에 전 사원의 안전과 보건을 기업의 최우선 가치로 인식하고,
법규 및 기준을 준수하는 안전보건관리체계를 구축하여 전 직원이 안전하고 쾌적한 환경에서 근무할 수 있도록 최선을 다한다.

이를 위해 다음과 같은 안전보건활동을 통해 지속적으로 안전보건환경을 개선한다.

1. 경영책임자는 '근로자의 생명 보호'와 '안전한 작업환경 조성'을 기업경영활동의 최우선 목표로 삼는다.
2. 경영책임자는 사업장에 안전보건관리체계를 구축하여 사업장의 위험요인 제거·통제를 위한 충분한 인적·물적 자원을 제공한다.
3. 안전보건 목표를 설정하고, 이를 달성하기 위한 세부적인 실행계획을 수립하여 이행한다.
4. 안전보건 관계 법령 및 관련 규정을 준수하는 내부규정을 수립하여 충실히 이행한다.
5. 근로자의 참여를 통해 위험요인을 파악하고, 파악된 위험요인은 반드시 개선하고, 교육을 통해 공유한다.
6. 모든 구성원이 자신의 직무와 관련된 위험요인을 알도록 하고, 위험요인 제거·대체 및 통제기법에 관해 교육·훈련을 실시한다.
7. 모든 공급자와 계약자가 우리의 안전보건 방침과 안전 요구사항을 준수하도록 한다.
8. 모든 구성원은 안전보건활동에 대한 책임과 의무를 성실히 준수토록 한다.`,
uploadedFile:""
})
const fileInputRef=useRef<HTMLInputElement|null>(null)
const[uploadedFileUrl,setUploadedFileUrl]=useState<string>("")

const handleChange=(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>{const{name,value}=e.target;setValues(prev=>({...prev,[name]:value}))}
const handleSave=()=>{alert("저장되었습니다.\n"+JSON.stringify(values,null,2))}
const handlePrint=()=>{window.print()}
const handleDelete=()=>{alert("삭제 버튼 클릭됨")}
const openFileDialog=()=>{fileInputRef.current?.click()}
const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
if(e.target.files&&e.target.files.length>0){
const file=e.target.files[0]
const fileName=file.name
const fileUrl=URL.createObjectURL(file)
setValues(prev=>({...prev,uploadedFile:fileName}))
setUploadedFileUrl(fileUrl)
}
}
const handleFileDownload=()=>{
if(uploadedFileUrl){
const link=document.createElement("a")
link.href=uploadedFileUrl
link.download=values.uploadedFile
link.click()
}
}
const handleFileRemove=()=>{
setValues(prev=>({...prev,uploadedFile:""}))
setUploadedFileUrl("")
if(fileInputRef.current)fileInputRef.current.value=""
}
const downloadDocx=()=>{const doc=new Document({sections:[{children:[new Paragraph({children:[new TextRun({text:`${values.year} 경영방침 양식`,bold:true,size:32})]}),new Paragraph({text:""}),new Paragraph({children:[new TextRun({text:`방침목표명: ${values.goalTitle}`,size:24})]}),new Paragraph({children:[new TextRun({text:`내용:\n${values.content}`,size:24})]})]}]});Packer.toBlob(doc).then(blob=>{saveAs(blob,"경영방침_양식.docx")})}

const fields:Field[]=[
{label:"방침목표명",name:"goalTitle",type:"text",placeholder:"방침목표명을 입력하세요"},
{
label:"내용",
name:"content",
type:"custom",
customRender:(
<textarea
name="content"
value={values.content}
onChange={handleChange}
placeholder="내용을 입력하세요"
className="border border-[#AAAAAA] rounded-[8px] p-2 w-full text-sm md:text-[15px] font-medium placeholder:font-normal placeholder:text-[#86939A] placeholder:text-sm md:placeholder:text-[15px] bg-white text-[#333639] h-[150px] md:h-[330px]"
/>
)
},
{
label:"양식 내려받기",
name:"downloadTemplate",
type:"custom",
customRender:(
<a href="/downloads/안전보건 경영방침.hwp" download className="inline-block">
<Button variant="action" style={{minWidth:120}} className="flex items-center gap-1">
<Download size={18}/>경영방침 양식
</Button>
</a>
)
},   
{
label:"경영방침 업로드",
name:"uploadFile",
type:"custom",
customRender:(
<div className="flex items-center gap-3">
<Button variant="action" onClick={openFileDialog} style={{minWidth:120}} className="flex items-center gap-1">
<Upload size={18}/>경영방침 업로드
</Button>
<input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".hwp,.doc,.docx,.pdf,.jpg,.jpeg,.png,.gif"/>
{values.uploadedFile&&(
<div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
<button onClick={handleFileDownload} className="text-sm font-medium hover:underline" style={{color:"var(--secondary)"}}>
{values.uploadedFile}
</button>
<button onClick={handleFileRemove} className="text-gray-400 hover:text-gray-600">
<X size={14}/>
</button>
</div>
)}
</div>
)
}
]

return (
<section className="mypage-content w-full">
<section>
<PageTitle>경영방침</PageTitle>
<TabMenu tabs={["경영방침 목록"]} activeIndex={0} onTabClick={()=>{}} className="mb-6" />
<div className="flex justify-between items-center mb-3">
<YearPicker year={values.year} onChange={year=>setValues(prev=>({...prev,year}))}/>
<div className="flex justify-end gap-1">
<Button variant="action" onClick={downloadDocx} className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>
<FormScreen fields={fields} values={values} onChange={handleChange} onClose={()=>{}} onSave={handleSave} />
<div className="flex justify-end mt-3">
<Button variant="primary" onClick={handleSave}>저장하기</Button>
</div>
</section>
</section>
)
}
export default PolicyGoal