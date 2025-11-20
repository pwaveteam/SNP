import React,{useEffect,useState}from"react"
import{ShieldCheckIcon,FlagIcon}from"@heroicons/react/24/solid"
import Dialog from "@/components/common/base/Dialog"

type Policy={id:number;title:string;btnText:string;content:string}
const policies:Policy[]=[{id:1,title:"안전보건경영방침",btnText:"안전보건경영방침",content:`경영방침 불러오기`},{id:2,title:"안전보건목표",btnText:"안전보건목표",content:`목표 불러오기`}]

const DashboardPolicy:React.FC=()=>{
const[open,setOpen]=useState(false)
const[selected,setSelected]=useState<Policy|null>(null)
const[isMobile,setIsMobile]=useState(false)
useEffect(()=>{const onResize=()=>setIsMobile(window.innerWidth<=767);onResize();window.addEventListener("resize",onResize);return()=>window.removeEventListener("resize",onResize)},[])
const openDialog=(p:Policy)=>{setSelected(p);setOpen(true)}
const closeDialog=()=>{setOpen(false);setSelected(null)}
const IconFor=(id:number)=>id===1?ShieldCheckIcon:FlagIcon

return(<>
{isMobile?(<div className="flex gap-3">{policies.map(p=>(<button key={p.id} className="flex-1 inline-flex items-center justify-center text-sm font-medium rounded-lg h-[50px] px-4 bg-[#031E36] text-white hover:bg-black transition-colors" onClick={()=>openDialog(p)} type="button">{p.btnText}</button>))}</div>):(policies.map(p=>{const Icon=IconFor(p.id);return(<article key={p.id} className="rounded-[16px] bg-white shadow-sm border border-[#E0E6EA] px-4 py-4"><div className="grid grid-cols-10 items-center min-h-[90px]"><div className="col-span-7 min-w-0 h-full flex flex-col justify-center"><h3 className="text-base md:text-lg font-semibold text-gray-800 leading-tight">{p.title}</h3><button className="mt-1 inline-flex items-center rounded-lg whitespace-nowrap text-xs sm:text-sm transition-colors duration-300 bg-[#031E36] text-white px-6 py-3 hover:bg-black" onClick={()=>openDialog(p)} type="button">{p.btnText} 확인하기</button></div><div className="col-span-3 h-full flex items-center justify-end"><div className="w-10 h-10 rounded-md bg-[#F4F7FA] ring-1 ring-[#E6EDF2] flex items-center justify-center"><Icon className="w-5 h-5 text-[#031E36]"/></div></div></div></article>)}) )}
{open&&selected&&(<Dialog title={selected.title} onClose={closeDialog} size="lg" className="max-h-[90vh] min-h-[500px] overflow-y-auto"><p className="mt-4 whitespace-pre-wrap text-left leading-relaxed text-sm md:text-base text-gray-700" style={{lineHeight:1.5}} dangerouslySetInnerHTML={{__html:selected.content}}/></Dialog>)}
</>)}

export default DashboardPolicy