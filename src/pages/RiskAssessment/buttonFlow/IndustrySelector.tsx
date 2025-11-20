import { Search } from 'lucide-react'
import Checkbox from '@/components/common/base/Checkbox'
import Button from '@/components/common/base/Button'

type IndustrySelectorProps = { searchText: string; setSearchText: (value: string) => void; selectedIndustry: any; setSelectedIndustry: (item: any) => void }

export default function IndustrySelector({ searchText, setSearchText, selectedIndustry, setSelectedIndustry }: IndustrySelectorProps) {
const mockData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, main: '광업', mid: i < 5 ? '석탄광업및채석업' : i < 10 ? '석탄, 원유 및 천연가스 광업' : i < 15 ? '비금속광물 광업' : i < 20 ? '석회석·금속·비금속광업및기타광업' : '기타 비금속광물 광업', small: i % 5 === 0 ? '갈탄광업' : i % 5 === 1 ? '유연탄광업' : i % 5 === 2 ? '아탄광업' : i % 5 === 3 ? '기타석탄광업' : '암석채굴·채취업', detail: i % 5 === 0 ? '갈탄 채굴/채취업' : i % 5 === 1 ? '유연탄 채굴/채취업' : i % 5 === 2 ? '아탄 채굴/채취업' : i % 5 === 3 ? '이탄/역청탄 등 채굴/채취업' : '벤토나이트 가공업', standardMain: '광업', standardMid: i < 10 ? '석탄 광업' : i < 20 ? '토사석 광업' : '기타 광업', standardSmall: i % 3 === 0 ? '광업 일반' : i % 3 === 1 ? '비금속 광업' : '금속 광업' }))
const handleSelect = (row: any) => setSelectedIndustry(prev => (prev?.id === row.id ? null : row))

return (
<>
<section className="w-full flex flex-wrap items-center gap-3 px-3 py-3 mb-3 bg-[#F8F8F8] border border-[#E5E5E5] rounded-[10px]">
<div className="w-full flex justify-between items-center gap-3">
<div className="flex items-center gap-x-3 min-w-[300px] max-w-[360px]">
<span className="text-xs sm:text-xs md:text-sm font-medium text-[#333639] whitespace-nowrap">검색</span>
<div className="relative w-[240px]">
<input type="text" className="h-[36px] border border-[#AAAAAA] rounded-[8px] px-3 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-[#B9D0F6] text-xs sm:text-xs md:text-sm font-normal text-[#333639] placeholder:text-[#AAAAAA] w-full" placeholder="검색어 입력" value={searchText} onChange={e => setSearchText(e.target.value)} />
<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
</div>
</div>
<div className="flex-shrink-0"><Button variant="secondary" className="min-w-[80px] h-[36px] text-xs sm:text-xs md:text-sm">검색</Button></div>
</div>
</section>

<div className="border border-[#E5E5E5] overflow-y-auto max-h-[72vh]">
<table className="min-w-[1200px] w-full border-collapse text-xs sm:text-xs md:text-sm text-[#333]">
<thead>
<tr className="h-[33px] md:h-[45px]" style={{ background: '#F7F8FA', borderTop: '1.9px solid #161616', borderBottom: '1px solid #CCCCCC' }}>
<th rowSpan={2} className="px-3 py-0 text-center align-middle" style={{ minWidth: 60, maxWidth: 100, width: 60, borderRight: '1px solid #CCCCCC', background: '#EFEFF3', fontWeight: 600, color: '#666666', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} />
<th colSpan={4} className="px-3 py-0 text-center align-middle" style={{ background: '#EFEFF3', borderRight: '1px solid #CCCCCC', fontWeight: 600, color: '#666666', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>산재업종분류</th>
<th colSpan={3} className="px-3 py-0 text-center align-middle" style={{ background: '#EFEFF3', fontWeight: 600, color: '#666666', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>표준산업분류</th>
</tr>
<tr className="h-[33px] md:h-[45px]" style={{ background: '#F7F8FA', borderBottom: '1px solid #CCCCCC' }}>
{['대분류', '중분류', '소분류', '세부작업', '대분류', '중분류', '소분류'].map((label, i) => (
<th key={i} className="px-3 py-0 text-center align-middle" style={{ minWidth: i < 4 ? 150 : 100, maxWidth: i < 4 ? 150 : 100, borderRight: i === 6 ? 'none' : '1px solid #CCCCCC', background: '#EFEFF3', fontWeight: 600, color: '#666666', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{label}</th>
))}
</tr>
</thead>
<tbody>
{mockData.map(row => (
<tr key={row.id} className="h-9 md:h-14" style={{ background: '#fff', cursor: 'default' }} onMouseEnter={e => (e.currentTarget.style.background = '#FBFBFB')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
<td className="px-3 py-0 text-center align-middle" style={{ minWidth: 60, maxWidth: 100, width: 60, borderRight: '1px solid #CCCCCC', borderBottom: '1px solid #CCCCCC', fontWeight: 'normal', color: '#333639', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
<Checkbox checked={selectedIndustry?.id === row.id} onChange={() => handleSelect(row)} />
</td>
{['main', 'mid', 'small', 'detail', 'standardMain', 'standardMid', 'standardSmall'].map((key, i) => (
<td key={i} className="px-3 py-0 text-center align-middle truncate" style={{ minWidth: i < 4 ? 150 : 100, maxWidth: i < 4 ? 150 : 100, borderRight: i === 6 ? 'none' : '1px solid #CCCCCC', borderBottom: '1px solid #CCCCCC', fontWeight: 'normal', color: '#333639', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={row[key as keyof typeof row]}>{row[key as keyof typeof row]}</td>
))}
</tr>
))}
</tbody>
</table>
</div>
</>
)}