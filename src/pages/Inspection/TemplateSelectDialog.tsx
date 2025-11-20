import React, { useMemo, useState, useCallback, useEffect } from "react"
import { Search } from "lucide-react"
import Dialog from "@/components/common/base/Dialog"
import Button from "@/components/common/base/Button"

type Category = "공통"
type CategoryAll = Category | "-전체-"
type Template = { id: number; category: Category; name: string; items: string[] }
type Props = { onClose: () => void; onConfirm: (items: string[]) => void }

const COLOR = {
text: "#333639",
headText: "#666",
border: "#CCCCCC",
headBg: "#EFEFF3",
rowHover: "#FBFBFB"
}

const TH = `text-[13px] font-semibold text-[${COLOR.headText}] bg-[${COLOR.headBg}] border-b border-[${COLOR.border}] px-3 py-2`
const TD = `text-[13px] text-[${COLOR.text}] px-3 py-2 border-b border-[${COLOR.border}]`
const LABEL_CLASS = `text-sm font-medium text-[${COLOR.text}] whitespace-nowrap`
const INPUT_CLASS = "h-[36px] border border-[#AAAAAA] rounded-[8px] px-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#B9D0F6] text-sm font-normal text-[#333639] placeholder:text-[#AAAAAA]"

const CATEGORY_OPTIONS: { label: string; value: CategoryAll }[] = [
{ label: "-전체-", value: "-전체-" },
{ label: "공통", value: "공통" }
]

const T = (id: number, name: string, items: string[]): Template => ({ id, category: "공통", name, items })

const MOCK_TEMPLATES: Template[] = [
T(1, "소방시설 외관점검표", [
"불 보이는 위치에 소화기 설치여부","불량기계 적정 설치여부","소화기 용기 변형/손상/부식 여부","가연성 물질 근처 비치 여부",
"소화기 표시사항(제조연월, 사용방법) 훼손 여부","압력게이지 정상범위 여부","사용기간 초과 여부","소화기 거치대, 받침대, 고정상태 이상 여부",
"표시사항 훼손 여부","기초사항(제조번호/제조연월/형식승인) 확인"
]),
T(2, "공용공간 점검표", [
"바닥 마감재 변형, 균열, 파손 여부","벽체 균열, 누수 흔적 여부","천장 마감재 탈락, 누수 흔적 여부","창문/출입문 개폐상태 이상 여부",
"계단 난간 흔들림 여부","복도/통로 장애물 방치 여부","비상구 표지등 점등 여부","피난통로 확보 상태","피난계단 안전상태 이상 여부",
"피난통로 및 계단의 조도 부족 여부"
]),
T(3, "횡단보도/횡방나스 점검표", [
"차량 유도선 훼손 여부","노면 균열, 파손 여부","차량 진입 방지봉 설치 상태","차량 안전시설 유지관리 상태",
"횡단보도 차선 표시 선명 여부","교통신호등 작동 여부","과속방지턱 상태","교통안전 시설물 설치 기준 적정 여부",
"보행자 통행 안전 확보 상태","보행자 신호 준수 여부"
]),
T(4, "외부공간 점검표", [
"조경수, 잔디, 가로수 관리 상태","휴게시설, 의자, 파고라 관리상태","벤치, 운동기구, 체육시설 관리상태",
"조명시설 작동 여부","CCTV 작동 여부","보행로 균열, 파손 여부","배수로 막힘 여부","기타 안전시설 관리 상태"
]),
T(5, "어린이놀이시설 및 체육시설 점검표", [
"놀이기구 설치기준 충족 여부","부품 탈락 여부","충돌 방지 매트 상태","볼트, 너트 풀림 여부","표시사항 부착 여부",
"철제시설 녹 발생 여부","기초 콘크리트 균열 여부","안전펜스 설치 상태","놀이시설 관리대장 작성 여부"
]),
T(6, "소방/전기/승강기 점검표", [
"소화전 압력 정상 여부","소화펌프 작동 여부","스프링클러 작동 여부","비상발전기 작동 여부","누전차단기 정상 동작 여부",
"분전반 차단기 접속상태 양호 여부","승강기 비상벨 작동 여부","승강기 안전센서 작동 여부","승강기 정지층 정확성 여부","승강기 표기 부착 상태"
])
]

const TemplateSelectDialog: React.FC<Props> = ({ onClose, onConfirm }) => {
const [category, setCategory] = useState<CategoryAll>("-전체-")
const [keyword, setKeyword] = useState("")
const [query, setQuery] = useState("")
const [selectedId, setSelectedId] = useState<number | null>(MOCK_TEMPLATES[0]?.id ?? null)

const list = useMemo(() => {
const base = category === "-전체-" ? MOCK_TEMPLATES : MOCK_TEMPLATES.filter(t => t.category === category)
const q = query.trim().toLowerCase()
if (!q) return base
return base.filter(t => t.name.toLowerCase().includes(q) || t.items.some(s => s.toLowerCase().includes(q)))
}, [category, query])

useEffect(() => {
setSelectedId(list[0]?.id ?? null)
}, [list])

const selected = useMemo(() => list.find(t => t.id === selectedId) ?? null, [list, selectedId])

const onChangeCategory = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
setCategory(e.target.value as CategoryAll)
}, [])

const handleSearch = useCallback(() => setQuery(keyword), [keyword])
const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") handleSearch() }, [handleSearch])

const confirm = useCallback(() => {
if (!selected) { alert("점검표를 선택하세요"); return }
onConfirm(selected.items)
}, [onConfirm, selected])

return (
<Dialog title="점검표(체크리스트) 등록" onClose={onClose} size="lg" className="w-[96vw] !max-w-[1200px] xl:!max-w-[1280px]">
<div className="w-full flex flex-wrap items-center gap-3 pb-2">
<div className="relative flex items-center gap-x-3 min-w-[200px]">
<label htmlFor="category" className={LABEL_CLASS}>분류</label>
<select id="category" value={category} onChange={onChangeCategory} className={`${INPUT_CLASS} w-[220px] appearance-none pr-8`}>
{CATEGORY_OPTIONS.map(opt => (<option key={opt.label} value={opt.value}>{opt.label}</option>))}
</select>
</div>
<div className="flex items-center flex-shrink-0 w-full sm:w-auto">
<span className={`${LABEL_CLASS} mr-3`}>검색</span>
<div className="flex items-center gap-2 min-w-[300px] max-w-[360px]">
<div className="relative w-[240px]">
<input type="text" className={`${INPUT_CLASS} w-full pr-10`} placeholder="검색어 입력" value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={handleKeyDown}/>
<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
</div>
<Button variant="secondary" className="flex-shrink-0 text-xs md:text-sm h-[30px] md:h-[36px] min-w-[80px]" onClick={handleSearch}>검색</Button>
</div>
</div>
</div>

<div className="grid grid-cols-[3.5fr_6.5fr] gap-5">

<div className="flex flex-col">
<div className="px-1 h-[26px] flex items-center">
<div className="text-[13px] font-semibold text-[#333639]">점검표 목록</div>
</div>
<div className={`border border-[${COLOR.border}] rounded-xl overflow-hidden h-[480px]`}>
<div className="h-full overflow-auto">
<table className="w-full table-fixed">
<thead><tr><th className={TH}>점검표명</th></tr></thead>
<tbody>
{list.map(t => {
const active = t.id === selectedId
return (
<tr key={t.id} onClick={() => setSelectedId(t.id)} className={`cursor-pointer select-none ${active ? `bg-[${COLOR.rowHover}]` : `hover:bg-[${COLOR.rowHover}]`}`}>
<td className={`${TD} truncate`}>{t.name}</td>
</tr>
)
})}
{list.length === 0 && (<tr><td className={TD}>등록된 항목이 없습니다.</td></tr>)}
</tbody>
</table>
</div>
</div>
</div>

<div className="flex flex-col">
<div className="px-1 h-[26px] flex items-center">
<div className="text-[13px] font-semibold text-[#333639]">세부 항목</div>
</div>
<div className={`border border-[${COLOR.border}] rounded-xl overflow-hidden h-[480px]`}>
<div className="h-full overflow-auto">
<table className="w-full table-fixed">
<colgroup><col className="w-[55px]" /><col /></colgroup>
<thead><tr><th className={TH}>번호</th><th className={TH}>점검세부내용</th></tr></thead>
<tbody>
{!selected && (<tr><td className={TD} colSpan={2}>등록된 항목이 없습니다.</td></tr>)}
{selected?.items.map((txt, i) => (
<tr key={i} className={`hover:bg-[${COLOR.rowHover}]`}>
<td className={`${TD} text-center`}>{i + 1}</td>
<td className={TD}>{txt}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</div>
</div>

<div className="mt-4 flex justify-center">
<Button variant="primary" onClick={confirm} className="min-w-[92px]">확인</Button>
</div>
</Dialog>
)
}

export default TemplateSelectDialog