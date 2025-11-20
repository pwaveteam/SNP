import React, { useMemo, useState } from "react"

type Level="매우낮음"|"낮음"|"보통"|"약간높음"|"높음"|"매우높음"
type Range=[number,number]
type Ranges=Record<Level,Range>

const RiskLevelTable5x4: React.FC = () => {
const cellHeight="h-[39px]"
const baseCellClass=`border border-gray-300 text-left ${cellHeight} font-medium px-2`
const headerBg="bg-gray-100"
const headerTextColor="text-gray-600"
const headerFontWeight="font-normal"
const headerClass=`${headerBg} ${headerTextColor} ${headerFontWeight} text-center`
const textColor="#161616"
const colors:Record<Level,string>={매우높음:"#FF3939",높음:"#FF6C00",약간높음:"#FFBB35",보통:"#FFE13E",낮음:"#C1FF1B",매우낮음:"#1EED1E"}
const order:Level[]=["매우낮음","낮음","보통","약간높음","높음","매우높음"]
const [scores,setScores]=useState<Record<Level,[string,string]>>({매우낮음:["1","2"],낮음:["3","5"],보통:["6","8"],약간높음:["9","10"],높음:["11","15"],매우높음:["16","20"]})
const toNum=(v:string)=>{const n=parseInt(v.replace(/[^0-9]/g,"")||"");if(isNaN(n))return NaN;return Math.min(20,Math.max(1,n))}
const normalized:Ranges=useMemo(()=>{const r:Partial<Ranges>={};order.forEach(l=>{let a=toNum(scores[l][0]),b=toNum(scores[l][1]);if(isNaN(a)||isNaN(b)) {a=1;b=1} if(a>b){const t=a;a=b;b=t} r[l]=[a,b]});return r as Ranges},[scores])
const getLevelByScore=(s:number,r:Ranges):Level=>{for(const l of order){const [a,b]=r[l];if(s>=a&&s<=b)return l}return "매우낮음"}
const handleScoreChange=(level:Level,index:0|1,value:string)=>{if(/^([1-9]|1[0-9]|20)?$/.test(value)){setScores(prev=>{const next=[...prev[level]] as [string,string];next[index]=value;return {...prev,[level]:next}})}}
const likeRows=[{label:"최상(5)",v:5},{label:"상(4)",v:4},{label:"중(3)",v:3},{label:"하(2)",v:2},{label:"최하(1)",v:1}]
const sevCols=[{label:"최대(4)",v:4},{label:"대(3)",v:3},{label:"중(2)",v:2},{label:"소(1)",v:1}]
return(<>
<table className="w-full border border-gray-300 rounded text-sm table-fixed mt-4" style={{borderCollapse:"collapse"}}>
<thead><tr><th className={`border border-gray-300 ${headerClass} h-[50px] px-2`} style={{width:"40%"}}>위험성 수준</th><th className={`border border-gray-300 ${headerClass} h-[50px] px-2`} style={{width:"60%"}}>관리기준</th></tr></thead>
<tbody>{[
{level:"매우낮음" as Level,standard:"현재의 안전대책 유지",bgColor:colors["매우낮음"]},
{level:"낮음" as Level,standard:"안전정보 및 주기적 안전보건교육의 제공이 필요한 위험",bgColor:colors["낮음"]},
{level:"보통" as Level,standard:"정비, 보수기간에 안전보건 대책을 수립하고 개선해야 할 위험",bgColor:colors["보통"]},
{level:"약간높음" as Level,standard:"즉시개선",bgColor:colors["약간높음"]},
{level:"높음" as Level,standard:"긴급 임시안전보건대책을 세운 후 작업 실시하고 정비, 보수기간 전에 안전보건 대책 수립 및 개선해야 할 위험",bgColor:colors["높음"]},
{level:"매우높음" as Level,standard:"즉시 작업중지 (작업 지속 시 즉시 개선 실행 위험)",bgColor:colors["매우높음"]},
].map(({level,standard,bgColor},i)=>(
<tr key={i}>
<td className="p-0" style={{width:"40%",border:"none"}}>
<table className="w-full" style={{borderCollapse:"collapse",borderSpacing:0}}>
<tbody>
<tr style={{backgroundColor:bgColor,color:textColor}}>
<td className="text-left h-[50px] px-2 whitespace-nowrap w-40" style={{borderRight:"1px solid #D1D5DB",borderBottom:"1px solid #D1D5DB",padding:0}}>
<div style={{display:"flex",justifyContent:"center",gap:6}}>
<input type="text" value={scores[level][0]} maxLength={2} onChange={e=>handleScoreChange(level,0,e.target.value)} style={{width:40,height:36,borderRadius:6,border:"1px solid #ccc",fontSize:"15px",textAlign:"center",outline:"none",backgroundColor:"#fff",color:textColor,userSelect:"text"}} inputMode="numeric"/>
<span style={{lineHeight:"36px",fontWeight:"bold"}}>~</span>
<input type="text" value={scores[level][1]} maxLength={2} onChange={e=>handleScoreChange(level,1,e.target.value)} style={{width:40,height:36,borderRadius:6,border:"1px solid #ccc",fontSize:"15px",textAlign:"center",outline:"none",backgroundColor:"#fff",color:textColor,userSelect:"text"}} inputMode="numeric"/>
</div>
</td>
<td className="text-left h-[50px] px-2 whitespace-nowrap" style={{borderBottom:"1px solid #D1D5DB"}}>{level}</td>
</tr>
</tbody>
</table>
</td>
<td className="font-medium text-left h-[50px] px-2" style={{width:"60%",border:"1px solid #D1D5DB",backgroundColor:bgColor,color:textColor}}>{standard}</td>
</tr>
))}</tbody></table>

<table className="w-full border border-gray-300 rounded text-sm table-fixed mt-6">
<thead><tr><th className={`${baseCellClass} w-28 ${headerClass}`}>가능성(빈도)</th>{sevCols.map(c=>(<th key={c.v} className={`${baseCellClass} w-16 ${headerClass}`}>{c.label}</th>))}</tr></thead>
<tbody>{likeRows.map(r=>(
<tr key={r.v}>
<td className={`${baseCellClass} text-center`}>{r.label}</td>
{sevCols.map(c=>{const score=r.v*c.v as number;const level=getLevelByScore(score,normalized);return(<td key={c.v} className={baseCellClass} style={{backgroundColor:colors[level],color:textColor}}>{`${level}(${score})`}</td>)})}
</tr>
))}</tbody>
</table>
</>)}

export default RiskLevelTable5x4