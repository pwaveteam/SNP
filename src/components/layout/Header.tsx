import React,{useEffect,useState,useCallback}from"react"
import{useNavigate}from"react-router-dom"
import{Volume2}from"lucide-react"

type HeaderProps={
factoryName?:string
userName?:string
onMenuToggle?:()=>void
isMobileMenuOpen?:boolean
}

const Header:React.FC<HeaderProps>=({
factoryName="(주)에스피에스엔에이 당진슬래그공장",
userName="인천사용자",
onMenuToggle,
isMobileMenuOpen=false
})=>{
const navigate=useNavigate()
const[date,setDate]=useState<string>("")
const[time,setTime]=useState<string>("")

const handleLogout=()=>{if(window.confirm("로그아웃 하시겠습니까?")){alert("로그아웃되었습니다");navigate("/login")}}

const updateDateTime=useCallback(()=>{
const n=new Date()
setDate(n.toLocaleDateString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit"}))
setTime(n.toLocaleTimeString("ko-KR",{hour12:false}))
},[])

useEffect(()=>{
updateDateTime()
const i=setInterval(updateDateTime,1000)
return()=>clearInterval(i)
},[updateDateTime])

const HEADER_BG="#041620"
const HEADER_H=60
const AVATAR_SIZE=20

return(
<>
<div className="hidden md:flex" style={{height:HEADER_H,background:HEADER_BG,alignItems:"center",position:"fixed",top:0,left:0,width:"100vw",zIndex:101,padding:"0 20px"}}>
<div style={{width:190,display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer"}} onClick={()=>navigate("/dashboard")}>
<img src="/logo.svg" alt="logo" style={{height:18}}/>
</div>
<div style={{marginLeft:50,color:"#CBCBCB",fontSize:13}}>{factoryName}</div>
<div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
<strong style={{fontSize:18,color:"#fff",fontWeight:500}}>가디언AI 통합관제 플랫폼</strong>
</div>
<div style={{display:"flex",alignItems:"center",marginLeft:"auto",gap:20}}>
<button type="button" style={{display:"flex",alignItems:"center",padding:"0 14px",height:30,borderRadius:30,border:"1px solid #C6C6C6",background:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>
<Volume2 size={15} color="#fff" style={{marginRight:6}}/>소리재생
</button>
<div onClick={()=>navigate("/mypage")} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} className="hover:opacity-80 transition-opacity">
<img src="/ico/ico-avatar.svg" alt="avatar" style={{width:AVATAR_SIZE,height:AVATAR_SIZE,borderRadius:"50%"}}/>
<span style={{fontSize:13,fontWeight:600,color:"#B1B1B1"}}>{userName} 님</span>
</div>
<div style={{width:190}}>
<p style={{lineHeight:"20px",fontSize:13,color:"#B1B1B1",margin:0}}>
{date} <span style={{marginLeft:10,color:"#fff",fontWeight:700}}>{time}</span>
</p>
</div>
<div style={{paddingRight:10}}>
<button onClick={handleLogout} style={{padding:"0 13px",borderRadius:20,display:"flex",alignItems:"center",height:30,fontSize:13,fontWeight:600,color:"#fff",background:"#717171",cursor:"pointer",border:"none"}}>
로그아웃
</button>
</div>
</div>
</div>

<div className="flex md:hidden" style={{height:HEADER_H,background:HEADER_BG,alignItems:"center",position:"fixed",top:0,left:0,right:0,zIndex:101,padding:"0 20px"}}>
<button type="button" aria-label={isMobileMenuOpen?"메뉴 닫기":"메뉴 열기"} onClick={onMenuToggle} className="rounded-md text-white hover:text-slate-200" style={{transition:"all 0.2s ease-out"}}>
<div style={{position:"relative",width:24,height:24}}>
<svg className="w-6 h-6 absolute inset-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{opacity:isMobileMenuOpen?0:1,transform:isMobileMenuOpen?"translateX(-8px)":"translateX(0)",transition:"all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"}}>
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h12"/>
</svg>
<svg className="w-6 h-6 absolute inset-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{opacity:isMobileMenuOpen?1:0,transform:isMobileMenuOpen?"translateX(0)":"translateX(8px)",transition:"all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"}}>
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
</svg>
</div>
</button>
<div style={{position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
<img src="/logo.svg" alt="logo" style={{height:18,cursor:"pointer"}} onClick={()=>navigate("/dashboard")}/>
</div>
</div>
</>
)}
export default Header