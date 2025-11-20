import Button from '@/components/common/base/Button'
import DataTable, { Column, DataRow } from '@/components/common/tables/DataTable'

type Props = { isOpen: boolean; onClose: () => void; onSubmit?: () => void }

const initialRows = [
{ id: 1, process: '물류 하역 작업', hazard: '하역 중 적재물 낙하로 인한 부상 위험', action: '적재물 고정 상태 점검 및 하역 시 2인 1조 작업' },
{ id: 2, process: '기계 유지보수', hazard: '방호장치 해체 후 손 끼임 위험', action: '정비 전 전원 차단 및 방호장치 설치 상태 확인' },
{ id: 3, process: '용접 작업', hazard: '불꽃 비산으로 인한 화상 위험', action: '방염포 설치 및 보호구 착용' },
{ id: 4, process: '지게차 운행', hazard: '협소 구역에서 충돌 위험', action: '후진 시 유도자 배치 및 경고음 작동 확인' },
{ id: 5, process: '화학약품 이송', hazard: '용기 누출로 인한 피부 접촉 위험', action: '밀폐용기 사용 및 이송 전 외관 점검' },
{ id: 6, process: '고소 작업', hazard: '작업 중 추락 위험', action: '이동식 작업대 고정 및 안전벨트 착용' },
{ id: 7, process: '절단기 사용', hazard: '날카로운 절단날에 의한 베임 위험', action: '작업 전 안전커버 작동 여부 확인' },
{ id: 8, process: '전기 설비 점검', hazard: '감전 위험', action: '절연 장갑 착용 및 차단기 확인 후 작업' },
{ id: 9, process: '도장 작업', hazard: '밀폐 공간 내 유증기 흡입 위험', action: '송풍기 설치 및 유기용제 사용 기준 준수' },
{ id: 10, process: '운반 작업', hazard: '과중 하중 취급 시 근골격계 부담', action: '운반 보조구 사용 및 적정 중량 유지' }
]

export default function NearMissImporter({ isOpen, onClose, onSubmit }: Props) {
if (!isOpen) return null

const columns: Column[] = [
{ key: 'process', label: '공정(작업)', minWidth: 180, align: 'center' },
{ key: 'hazard', label: '유해위험요인', minWidth: 400, align: 'left' },
{ key: 'action', label: '현재 안전보건조치', minWidth: 280, align: 'left' }
]

const data: DataRow[] = initialRows.map(row => ({
id: row.id,
process: row.process,
hazard: row.hazard,
action: row.action
}))

return (
<div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
<div className="bg-white w-full max-w-[1120px] rounded-[13px] border border-[#E5E5E5] shadow-md">
<div className="px-5 py-4 font-semibold text-base text-[#333639]">아차사고 불러오기</div>
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