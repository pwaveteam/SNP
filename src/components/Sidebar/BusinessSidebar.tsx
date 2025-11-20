import React,{useState,useEffect,useCallback}from"react"
import{NavLink,useNavigate}from"react-router-dom"
import{PanelRightClose}from"lucide-react"
import{HomeIcon,BuildingOffice2Icon,DocumentTextIcon,CurrencyDollarIcon,UserGroupIcon}from"@heroicons/react/24/outline"

interface SidebarProps{
isOpen:boolean
setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
factoryName?:string
userName?:string
}

const businessSubMenu=[
{label:"기본사업장관리",path:"/business-management/basic",Icon:BuildingOffice2Icon},
{label:"경영방침",path:"/business-management/policy-goal",Icon:DocumentTextIcon},
{label:"예산/목표",path:"/business-management/budget",Icon:CurrencyDollarIcon},
{label:"조직도",path:"/business-management/organization",Icon:UserGroupIcon}
]

const BusinessSidebar:React.FC<SidebarProps>=({
isOpen,
setIsOpen,
factoryName="(주)에스피에스엔에이 당진슬래그공장",
userName="인천사용자"
})=>{
const[isDesktopOpen,setIsDesktopOpen]=useState<boolean>(true)
const[date,setDate]=useState<string>("")
const[time,setTime]=useState<string>("")
const navigate=useNavigate()

const DESKTOP_W_OPEN=190
const DESKTOP_W_CLOSED=60
const AVATAR_SIZE=20
const BLUE_BORDER="#009bd9"

const handleLogout=()=>{
if(window.confirm("로그아웃 하시겠습니까?")){
alert("로그아웃되었습니다")
navigate("/login")
setIsOpen(false)
}
}

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

const STYLES={
layout:{sidebarBg:"bg-[#041620]",border:"border-slate-700"},
text:{base:"text-slate-300",hover:"hover:text-white",supportNormal:"text-[#EDEDED]"},
category:{business:"text-[#DEEBF3]",iconBusiness:"text-[#B1B1B1]"},
item:{text:"text-[#EDEDED]",icon:"text-[#B1B1B1]",hoverBg:"hover:bg-[#2C67BF]",activeBg:"bg-[#2C67BF]"},
toggle:{bg:"bg-[#333333]",hover:"hover:bg-neutral-900",active:"active:bg-neutral-800",icon:"text-white"}
}

const NavItem=(item:typeof businessSubMenu[0])=>(
<>
{item.Icon&&<item.Icon className={`w-[18px] h-[18px] min-w-[18px] ${STYLES.category.iconBusiness} group-hover:text-white`}/>}
<span className="flex-1 text-[15px] font-medium overflow-hidden whitespace-nowrap text-ellipsis min-w-0">{item.label}</span>
</>
)

const handleNavClick=()=>setIsOpen(false)

return(
<>
{isOpen&&<div onClick={()=>setIsOpen(false)} className="fixed inset-0 bg-black/40 z-[100] md:hidden"/>}

<aside className={`fixed top-[60px] left-0 ${STYLES.layout.sidebarBg} text-white border-r ${STYLES.layout.border} z-[101] transition-all duration-300 ${isOpen?"translate-x-0":"-translate-x-full"} md:translate-x-0 w-full overflow-visible`} style={{height:"calc(100vh - 60px)"}}>
<style>{`@media (min-width: 768px){aside{width:${isDesktopOpen?DESKTOP_W_OPEN:DESKTOP_W_CLOSED}px !important;}}`}</style>

<div className="hidden md:block absolute top-0 -right-4 z-10 group">
<button onClick={()=>setIsDesktopOpen(!isDesktopOpen)} className="w-9 h-9 rounded-lg bg-[#333333] flex items-center justify-center hover:bg-[#444444] transition-colors relative">
<PanelRightClose className={`w-4 h-4 text-white transition-transform duration-300 ${isDesktopOpen?"rotate-0":"rotate-180"}`} strokeWidth={2}/>
<div className="absolute left-full ml-1 px-1.5 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
{isDesktopOpen?"사이드바 닫기":"사이드바 열기"}
</div>
</button>
</div>

<div className="h-full flex flex-col overflow-hidden">

<div className={`md:hidden ${STYLES.layout.sidebarBg}`}>
<div className="flex items-start justify-between px-5 py-4 border-t" style={{borderColor:BLUE_BORDER}}>
<div className="flex-shrink-0">
<strong className="block text-white font-semibold text-base leading-tight mb-2">가디언AI 통합관제 플랫폼</strong>
<p className="text-xs text-[#B1B1B1]">{date} <span className="ml-1 text-white font-bold">{time}</span></p>
</div>
<div className="flex flex-col items-end gap-2 text-right">
<p className="text-[#CBCBCB] text-xs leading-tight max-w-[180px]">{factoryName}</p>
<div onClick={()=>{navigate("/mypage");handleNavClick()}} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
<img src="/ico/ico-avatar.svg" alt="avatar" style={{width:AVATAR_SIZE,height:AVATAR_SIZE,borderRadius:"50%"}}/>
<span className="text-xs font-semibold text-[#B1B1B1]">{userName} 님</span>
</div>
<div className="flex gap-2 mt-1">
<button onClick={()=>{navigate("/dashboard");handleNavClick()}} className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full border border-white bg-transparent text-white text-xs font-semibold whitespace-nowrap">
<HomeIcon className="w-3.5 h-3.5"/>메인으로
</button>
<button onClick={handleLogout} className="px-3 py-1.5 rounded-full bg-[#717171] text-white text-xs font-semibold whitespace-nowrap">로그아웃</button>
</div>
</div>
</div>
<div className={`border-b ${STYLES.layout.border}`}></div>
</div>

<div className="flex-1 overflow-y-auto py-6 px-3">

<section className="mb-6">
<ul className="list-none p-0 m-0">
{businessSubMenu.map(item=>(
<li key={item.path} className="mb-0.5">
<NavLink to={item.path} onClick={handleNavClick} className={({isActive})=>`group flex items-center gap-3 py-2 px-3 rounded-lg transition-colors overflow-hidden ${isActive?`${STYLES.item.activeBg} text-white`:`${STYLES.item.text} ${STYLES.text.hover} ${STYLES.item.hoverBg}`}`}>
{NavItem(item)}
</NavLink>
</li>
))}
</ul>
</section>
</div>
</div>
</aside>

<div aria-hidden className="hidden md:block shrink-0 transition-[width] duration-300" style={{width:isDesktopOpen?DESKTOP_W_OPEN:DESKTOP_W_CLOSED}}/>
</>
)
}

export default BusinessSidebar