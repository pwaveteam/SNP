import jsPDF from "jspdf"
import autoTable, { RowInput, UserOptions } from "jspdf-autotable"

export type RFKeyValue={label:string;value:string}
export type RFAttendee={name:string;phone:string;signatureDataUrl?:string}
export type RFAttachment={name:string}
export type RFTableColumn<T>={header:string;accessor:(row:T)=>string}
export type RFTableSpec<T>={title?:string;columns:RFTableColumn<T>[];rows:T[]}
export type RFSectionSpec={title:string;text:string}
export type RFDocSpec={title:string;headerRightQrDataUrl?:string;keyValues:RFKeyValue[];sections:RFSectionSpec[];tables:RFTableSpec<unknown>[];attendees?:RFAttendee[];attachments?:RFAttachment[];fileName?:string}
export interface RFTemplate<Input>{key:string;map:(input:Input)=>Promise<RFDocSpec>|RFDocSpec}

type JsPdfWithAutoTable=jsPDF&{lastAutoTable?:{finalY:number}}
const mm=(v:number):number=>v
const arrayBufferToBase64=(buf:ArrayBuffer):string=>{let b="";const bytes=new Uint8Array(buf);for(let i=0;i<bytes.byteLength;i++)b+=String.fromCharCode(bytes[i]);return btoa(b)}

let fontReady:Promise<void>|null=null
const ensureFonts=():Promise<void>=>{if(fontReady)return fontReady;fontReady=(async()=>{const base=(import.meta as unknown as {env:{BASE_URL?:string}}).env?.BASE_URL??"/";const[regRes,boldRes]=await Promise.all([fetch(`${base}fonts/NotoSansKR-Regular.ttf`),fetch(`${base}fonts/NotoSansKR-Bold.ttf`)]);if(!regRes.ok||!boldRes.ok)throw new Error("폰트 로드 실패");const[regBuf,boldBuf]=await Promise.all([regRes.arrayBuffer(),boldRes.arrayBuffer()]);(ensureFonts as unknown as {reg:string}).reg=arrayBufferToBase64(regBuf);(ensureFonts as unknown as {bold:string}).bold=arrayBufferToBase64(boldBuf)})();return fontReady}
const applyFonts=(doc:jsPDF):void=>{const reg=(ensureFonts as unknown as {reg?:string}).reg??"";const bold=(ensureFonts as unknown as {bold?:string}).bold??"";doc.addFileToVFS("NotoSansKR-Regular.ttf",reg);doc.addFileToVFS("NotoSansKR-Bold.ttf",bold);doc.addFont("NotoSansKR-Regular.ttf","NotoSansKR","normal");doc.addFont("NotoSansKR-Bold.ttf","NotoSansKR","bold");doc.setFont("NotoSansKR","normal")}

const PX_TO_PT=0.75,HEADER_PT=20*PX_TO_PT,META_PT=11*PX_TO_PT,BODY_PT=13*PX_TO_PT
const COLOR_BLACK:[number,number,number]=[0,0,0],COLOR_CHARCOAL:[number,number,number]=[51,51,51]
const LINE=6

const drawHeader=(doc:jsPDF,category:string,metaRight?:{id?:string;no?:string}):number=>{
doc.setFont("NotoSansKR","bold");doc.setFontSize(HEADER_PT);doc.setTextColor(...COLOR_BLACK)
const yTitle=mm(20),xLeft=mm(20);doc.text(category,xLeft,yTitle)
const rightX=doc.internal.pageSize.getWidth()-mm(20);let yMeta=yTitle
if(metaRight?.id){doc.setFont("NotoSansKR","normal");doc.setFontSize(META_PT);doc.setTextColor(...COLOR_CHARCOAL);doc.text(`문서ID: ${metaRight.id}`,rightX,yMeta,{align:"right"})}
if(metaRight?.no){yMeta+=5;doc.text(`문서번호: ${metaRight.no}`,rightX,yMeta,{align:"right"})}
const yHr=(metaRight&&(metaRight.id||metaRight.no))?yMeta+6:yTitle+8
doc.setDrawColor(180);doc.setLineWidth(0.2);doc.line(mm(20),yHr,doc.internal.pageSize.getWidth()-mm(20),yHr)
return yHr
}

const addSectionTitle=(doc:jsPDF,text:string,y:number):void=>{doc.setFont("NotoSansKR","bold");doc.setFontSize(BODY_PT);doc.setTextColor(...COLOR_BLACK);doc.text(text,mm(20),y);doc.setFont("NotoSansKR","normal")}
const addKeyValues=(doc:jsPDF,items:RFKeyValue[],startY:number):number=>{
doc.setFont("NotoSansKR","normal");doc.setFontSize(BODY_PT);doc.setTextColor(...COLOR_CHARCOAL)
const col1X=mm(22),col2X=mm(60);let y=startY
for(const it of items){doc.text(it.label,col1X,y);doc.text(":",col1X+18,y);doc.text(it.value||"-",col2X,y,{maxWidth:doc.internal.pageSize.getWidth()-col2X-mm(20)});y+=LINE}
return y
}
const addParagraph=(doc:jsPDF,label:string,text:string,startY:number):number=>{
addSectionTitle(doc,label,startY);const y=startY+LINE-1
doc.setFont("NotoSansKR","normal");doc.setFontSize(BODY_PT);doc.setTextColor(...COLOR_CHARCOAL)
const x=mm(20),w=doc.internal.pageSize.getWidth()-mm(40)
const lines=doc.splitTextToSize(text||"-",w);doc.text(lines,x,y)
return y+lines.length*(LINE-1)+4
}
const addTable=<T,>(doc:jsPDF,spec:RFTableSpec<T>,startY:number):number=>{
if(spec.title)addSectionTitle(doc,spec.title,startY)
const y=spec.title?startY+LINE:startY
const head=spec.columns.map(c=>c.header)
const body:RowInput[]=spec.rows.map(r=>spec.columns.map(c=>c.accessor(r)) as RowInput)
const options:UserOptions={startY:y,styles:{font:"NotoSansKR",fontSize:BODY_PT as number,cellPadding:3,lineWidth:0.1,textColor:COLOR_CHARCOAL},headStyles:{fillColor:[240,240,240],textColor:COLOR_BLACK,font:"NotoSansKR",fontStyle:"bold",fontSize:BODY_PT as number},bodyStyles:{textColor:COLOR_CHARCOAL,fontSize:BODY_PT as number},margin:{left:mm(20),right:mm(20)},tableLineColor:[200,200,200],tableLineWidth:0.1,didDrawPage:data=>{if(data.pageNumber>1){doc.setFontSize(BODY_PT);doc.setTextColor(...COLOR_BLACK);doc.text(String(data.pageNumber),doc.internal.pageSize.getWidth()-mm(20),mm(15),{align:"right"})}}}
autoTable(doc,{head:[head],body,...options});const pluginDoc=doc as JsPdfWithAutoTable
return pluginDoc.lastAutoTable?pluginDoc.lastAutoTable.finalY:y
}
const addAttendees=(doc:jsPDF,rows:RFAttendee[],startY:number):number=>{
addSectionTitle(doc,"참석자 목록",startY)
const after=addTable<RFAttendee>(doc,{columns:[{header:"이름",accessor:r=>r.name},{header:"휴대폰",accessor:r=>r.phone},{header:"서명",accessor:()=>""}],rows},startY+LINE)
let y=startY+LINE*2;const x=doc.internal.pageSize.getWidth()-mm(20)-35
for(const a of rows){if(a.signatureDataUrl){if(y+18>doc.internal.pageSize.getHeight()-mm(20)){doc.addPage();y=mm(40)}doc.addImage(a.signatureDataUrl,"PNG",x,y-10,35,14);y+=LINE-1}}
return Math.max(after,y)
}
const addAttachments=(doc:jsPDF,files:RFAttachment[],startY:number):number=>{addSectionTitle(doc,"첨부목록",startY);return addKeyValues(doc,files.map(f=>({label:"첨부",value:f.name})),startY+LINE)}

type Registry=Map<string,RFTemplate<unknown>>
const registry:Registry=new Map()
const register=<I,>(tpl:RFTemplate<I>):void=>{registry.set(tpl.key,tpl as RFTemplate<unknown>)}
const has=(key:string):boolean=>registry.has(key)

export const ReportFormat={register,has,async generate<I>(key:string,input:I):Promise<void>{
if(!registry.has(key))throw new Error(`등록되지 않은 리포트 포맷: ${key}`)
await ensureFonts();const tpl=registry.get(key) as RFTemplate<I>;const spec=await tpl.map(input)
const docIdKV=spec.keyValues.find(k=>k.label==="문서ID");const docNoKV=spec.keyValues.find(k=>k.label==="문서번호")
const filteredKVs=spec.keyValues.filter(k=>k.label!=="문서ID"&&k.label!=="문서번호")
const doc=new jsPDF({unit:"mm",format:"a4"});applyFonts(doc)
const yHr=drawHeader(doc,spec.title,{id:docIdKV?.value,no:docNoKV?.value});let y=yHr+LINE
y=addKeyValues(doc,filteredKVs,y);for(const s of spec.sections)y=addParagraph(doc,s.title,s.text,y+LINE-1)
for(const t of spec.tables)y=addTable(doc,t,y+LINE)
if(spec.attendees&&spec.attendees.length)y=addAttendees(doc,spec.attendees,y+LINE)
if(spec.attachments&&spec.attachments.length)y=addAttachments(doc,spec.attachments,y+LINE)
const name=spec.fileName??`Report_${new Date().toISOString().slice(0,10).replace(/-/g,"")}.pdf`;doc.save(name)
}}

const makeDocUid=(prefix="TBM"):string=>{
const dt=new Date();const ymd=`${dt.getFullYear()}${String(dt.getMonth()+1).padStart(2,"0")}${String(dt.getDate()).padStart(2,"0")}`
const hms=`${String(dt.getHours()).padStart(2,"0")}${String(dt.getMinutes()).padStart(2,"0")}${String(dt.getSeconds()).padStart(2,"0")}`
const rand=Math.random().toString(36).slice(2,8).toUpperCase();return `${prefix}-${ymd}${hms}-${rand}`
}

export type RFTbmInput={
id:number|string;factory:string;tbmName:string;location:string;date:string;
eduTime?:string;startTime?:string;endTime?:string;durationText:string;
targetText:string;participantsText:string;leader:string;content:string;remark:string;
riskProcessTitle?:string;riskItems:{hazard:string;countermeasure:string}[];attendees:RFAttendee[];
qrDataUrl?:string;attachments?:RFAttachment[]
}

export const TbmTemplate:RFTemplate<RFTbmInput>={
key:"tbm",
map:(v:RFTbmInput):RFDocSpec=>{
const docUid=makeDocUid("TBM")
const dateText=new Intl.DateTimeFormat("ko-KR",{dateStyle:"long"}).format(new Date(v.date))
const timeText=v.eduTime??`${v.startTime??""}~${v.endTime??""}${v.durationText?` (${v.durationText})`:""}`
const kv:RFKeyValue[]=[
{label:"문서ID",value:docUid},
{label:"문서번호",value:String(v.id)},
{label:"공정",value:v.factory},
{label:"TBM명",value:v.tbmName},
{label:"일시",value:`${dateText} ${timeText}`},
{label:"장소",value:v.location},
{label:"대상",value:v.targetText},
{label:"참여",value:v.participantsText},
{label:"실시자",value:v.leader}
]
const sections:RFSectionSpec[]=[{title:"작업내용",text:v.content},{title:"비고",text:v.remark}]
const tables:RFTableSpec<unknown>[]=([{title:v.riskProcessTitle?`위험성평가표(${v.riskProcessTitle})`:"위험성평가표",columns:[{header:"유해·위험요인",accessor:(r:{hazard:string})=>r.hazard||"-"},{header:"대책",accessor:(r:{countermeasure:string})=>r.countermeasure||"-"}],rows:(v.riskItems.length?v.riskItems:[{hazard:"-",countermeasure:"-"}])}] as unknown) as RFTableSpec<unknown>[]
return {title:"TBM",headerRightQrDataUrl:undefined,keyValues:kv,sections,tables,attendees:v.attendees,attachments:v.attachments,fileName:`${docUid}.pdf`}
}
}
register(TbmTemplate)