import Button from '@/components/common/base/Button'
import DataTable, { Column, DataRow } from '@/components/common/tables/DataTable'

type Props = { isOpen: boolean; onClose: () => void; onSubmit?: () => void }

const initialRows = [
{ id: 1, category: '설비결함', situation: '기계 부품 파손으로 인한 충돌 위험', hazard: '돌출물 접촉으로 인한 상해' },
{ id: 2, category: '작업자 부주의', situation: '안전모 미착용으로 낙하물 충돌 위험', hazard: '머리 손상 위험' },
{ id: 3, category: '관리미흡', situation: '출입통제 미비로 위험구역 무단 진입', hazard: '고소작업 중 추락 위험' },
{ id: 4, category: '작업환경 요인', situation: '조명 부족으로 인한 시야 확보 어려움', hazard: '시야 제한에 따른 충돌 위험' },
{ id: 5, category: '보호구 미착용', situation: '화학물질 취급 중 보호안경 미착용', hazard: '화학물질 접촉으로 눈 손상' },
{ id: 6, category: '설비오작동', situation: '센서 오작동으로 인한 기계 자동 작동', hazard: '협착 및 절단 위험' },
{ id: 7, category: '불안전한 작업방법', situation: '적재물 위에서 작업 수행', hazard: '높이작업 시 낙상 위험' },
{ id: 8, category: '위험물 관리미흡', situation: '인화성 물질 밀폐 보관 미흡', hazard: '화재 및 폭발 위험' },
{ id: 9, category: '비상조치 미비', situation: '비상정지장치 접근 어려움', hazard: '비상 상황 시 즉시 대응 불가' },
{ id: 10, category: '작업자 피로누적', situation: '과로로 집중력 저하', hazard: '부주의에 의한 사고 증가' }
]

export default function CauseImporter({ isOpen, onClose, onSubmit }: Props) {
if (!isOpen) return null

const columns: Column[] = [
{ key: 'category', label: '위험분류', minWidth: 160, align: 'center' },
{ key: 'situation', label: '위험발생 상황 및 결과', minWidth: 300, align: 'left' },
{ key: 'hazard', label: '유해위험요인', minWidth: 240, align: 'left' }
]

const data: DataRow[] = initialRows.map(row => ({
id: row.id,
category: row.category,
situation: row.situation,
hazard: row.hazard
}))

return (
<div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
<div className="bg-white w-full max-w-[960px] rounded-[13px] border border-[#E5E5E5] shadow-md">
<div className="px-5 py-4 font-semibold text-base text-[#333639]">기인물요인 불러오기</div>
<div className="px-5 pt-0 pb-4 max-h-[65vh] overflow-y-auto">
<DataTable columns={columns} data={data} />
</div>
<div className="flex justify-center gap-1 px-5 pb-5">
<Button variant="primaryOutline" onClick={onClose} className="min-w-[80px] h-[36px] text-sm">닫기</Button>
<Button variant="primary" onClick={onSubmit} className="min-w-[80px] h-[36px] text-sm">확인</Button>
</div>
</div>
</div>
)
}