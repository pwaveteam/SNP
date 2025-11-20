import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"

type PathMap = Record<string, string>
type ActionMap = Record<string, string>
type Crumb = { url: string; name: string }

const pathNameMap: PathMap = {
"/dashboard": "대시보드",
"/business-management": "사업장관리",
"/business-management/basic": "기본사업장관리",
"/business-management/policy-goal": "경영방침",
"/business-management/budget": "안전보건 목표 및 추진계획",
"/business-management/organization": "조직도",
"/risk-assessment": "위험성평가",
"/risk-assessment/chemical": "화학물질평가",
"/risk-assessment/risk": "위험평가",
"/risk-assessment/list": "평가목록",
"/tbm": "TBM",
"/inspection": "안전점검",
"/inspection/checklist": "점검표(체크리스트)",
"/inspection/plan": "점검일정",
"/inspection/results": "점검결과",
"/nearmiss": "아차사고",
"/nearmiss/safevoice": "안전보이스",
"/safety-education": "안전보건교육",
"/asset-management": "자산관리",
"/asset-management/machine": "위험기계/기구/설비",
"/asset-management/hazard": "유해/위험물질",
"/safety-work-permit": "안전작업허가서",
"/supply-chain-management": "도급협의체관리",
"/supply-chain-management/partners": "수급업체 관리",
"/supply-chain-management/evaluation": "안전보건수준 평가",
"/supply-chain-management/committee": "도급안전보건 협의체",
"/supply-chain-management/siteaudit": "안전보건 점검",
"/supply-chain-management/training": "안전보건 교육/훈련",
"/response-manual": "대응매뉴얼",
"/notice-board": "공지/게시판",
"/notice-board/notice": "공지사항",
"/notice-board/resources": "자료실",
"/notice-board/law": "중대재해처벌법",
"/approval-box": "결재함",
"/approval-box/received": "받은결재함",
"/approval-box/sent": "보낸결재함",
"/qr-management": "QR관리",
"/mypage": "마이페이지",
"/support": "1:1 지원",
"/user-guide": "사용가이드",
"/ptw": "PTW",
"/ptw/list": "PTW",
"/ptw/work-permit": "위험작업허가서 관리",
"/ptw/jsa": "작업위험분석(JSA) 관리",
"/ptw/site-evaluation": "현장 위험성평가(JSA) 관리",
"/ptw/tbm": "TBM 관리"
}

const actionNameMap: ActionMap = {
register: "등록",
detail: "상세"
}

const Breadcrumb: React.FC = () => {
const location = useLocation()
const navigate = useNavigate()
const pathnames: string[] = location.pathname.split("/").filter(Boolean)

const findParentName = (url: string): string => {
if (pathNameMap[url]) return pathNameMap[url]
const segments: string[] = url.split("/")
while (segments.length > 1) {
segments.pop()
const parentUrl: string = segments.join("/") || "/"
if (pathNameMap[parentUrl]) return pathNameMap[parentUrl]
}
return ""
}

const crumbs: Crumb[] = pathnames.map((_, idx) => {
const url: string = "/" + pathnames.slice(0, idx + 1).join("/")
const seg: string = pathnames[idx]
const name: string = actionNameMap[seg] ?? findParentName(url)
return { url, name }
})

const deduped: Crumb[] = []
for (const c of crumbs) {
if (c.name && (deduped.length === 0 || deduped[deduped.length - 1].name !== c.name)) {
deduped.push(c)
}
}

return (
<nav aria-label="breadcrumb" className="flex items-center gap-1 mb-3 whitespace-nowrap text-[13px] leading-tight">
<button
onClick={() => navigate("/")}
className="font-semibold hover:underline focus:outline-none"
type="button"
aria-label="홈으로 이동"
style={{ color: "#333639", fontSize: 13 }}
>
홈
</button>
{deduped.map((crumb, idx) => (
<React.Fragment key={`${crumb.url}-${idx}`}>
<ChevronRight size={13} strokeWidth={2} color="#999999" className="select-none" />
<span className="font-normal" style={{ color: "#999999", userSelect: "none", fontSize: 13 }}>
{crumb.name}
</span>
</React.Fragment>
))}
</nav>
)
}

export default Breadcrumb