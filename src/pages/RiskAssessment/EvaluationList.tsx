import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/RiskDataTable"
import PageTitle from "@/components/common/base/PageTitle"
import Badge from "@/components/common/base/Badge"
import FilterBar from "@/components/common/base/FilterBar"
import Pagination from "@/components/common/base/Pagination"
import InfoBox from "@/components/common/base/InfoBox"
import { DownloadIcon, Trash2, FilePen, PencilLine } from "lucide-react"

const PAGE_SIZE = 10

const columns: Column[] = [
{ key: "id", label: "번호", width: 50, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center">{row.id}</div> },
{ key: "year", label: "년도", width: 60, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center">{row.year}</div> },
{ key: "title", label: "위험성평가명", width: 180, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center">{row.title}</div> },
{ key: "type", label: "평가구분", width: 110, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center">{row.type}</div> },
{ key: "method", label: "평가방법", width: 150, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center">{row.method}</div> },
{ key: "regulation", label: "실시규정", width: 120, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center">{row.regulation}</div> },
{ key: "registered", label: "등록일", width: 110, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center">{row.registered}</div> },
{ key: "modified", label: "최종수정일", width: 110, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center">{row.modified}</div> },
{ key: "completed", label: "완료일", width: 110, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center">{row.completed}</div> },
{ key: "status", label: "진행상태", width: 90, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center"><Badge color={row.status === "진행" ? "green" : "blue"}>{row.status}</Badge></div> },
{ key: "result", label: "평가결과", width: 90, renderCell: row => <div className="h-[38px] w-full flex items-center justify-center">{row.completed && (<button aria-label="평가 결과 다운로드" className="text-gray-600 hover:text-gray-900" onClick={() => alert(`ID ${row.id} 평가결과 다운로드`)}><DownloadIcon size={18} /></button>)}</div> }
]

const initialData: DataRow[] = [
{ id: 30, year: 2025, title: "금속 절삭 작업 위험성 평가", type: "정기평가", method: "빈도·강도법", regulation: "산안법 제37조", registered: "2025-06-01", modified: "2025-06-02", completed: "2025-06-10", status: "완료" },
{ id: 29, year: 2025, title: "분진 취급 공정 위험평가", type: "수시평가", method: "체크리스트법", regulation: "산안법 제37조", registered: "2025-06-03", modified: "2025-06-05", completed: "", status: "진행" },
{ id: 28, year: 2025, title: "레이저 절단기 작업 평가", type: "최초평가", method: "화학물질 평가법", regulation: "산안법 제37조", registered: "2025-06-06", modified: "2025-06-07", completed: "2025-06-08", status: "완료" },
{ id: 27, year: 2025, title: "용광로 작업장 평가", type: "정기평가", method: "위험성수준 3단계 판단법", regulation: "산안법 제37조", registered: "2025-05-28", modified: "2025-05-30", completed: "2025-06-01", status: "완료" },
{ id: 26, year: 2025, title: "연마 작업장 위험성 평가", type: "정기평가", method: "체크리스트법", regulation: "산안법 제37조", registered: "2025-05-25", modified: "2025-05-26", completed: "2025-05-27", status: "완료" },
{ id: 25, year: 2024, title: "화학물질 보관소 위험평가", type: "수시평가", method: "정성적 평가", regulation: "산안법 제37조", registered: "2024-12-01", modified: "2024-12-03", completed: "", status: "진행" },
{ id: 24, year: 2024, title: "제철소 고온작업 평가", type: "정기평가", method: "빈도·강도법", regulation: "산안법 제37조", registered: "2024-11-10", modified: "2024-11-12", completed: "2024-11-14", status: "완료" },
{ id: 23, year: 2024, title: "지게차 운전 평가", type: "최초평가", method: "체크리스트법", regulation: "산안법 제37조", registered: "2024-10-01", modified: "2024-10-03", completed: "2024-10-05", status: "완료" },
{ id: 22, year: 2024, title: "전기 설비 위험성 평가", type: "수시평가", method: "정량적 평가", regulation: "산안법 제37조", registered: "2024-09-12", modified: "2024-09-13", completed: "2024-09-15", status: "완료" },
{ id: 21, year: 2024, title: "가스 누출 점검 평가", type: "수시평가", method: "정성적 평가", regulation: "산안법 제37조", registered: "2024-08-30", modified: "2024-09-01", completed: "", status: "진행" },
{ id: 20, year: 2024, title: "플랜트 해체 작업 위험평가", type: "정기평가", method: "체크리스트법", regulation: "산안법 제37조", registered: "2024-08-10", modified: "2024-08-12", completed: "2024-08-14", status: "완료" },
{ id: 19, year: 2024, title: "압력용기 취급 평가", type: "최초평가", method: "정량적 평가", regulation: "산안법 제37조", registered: "2024-07-22", modified: "2024-07-23", completed: "2024-07-25", status: "완료" },
{ id: 18, year: 2024, title: "유해화학물질 취급 평가", type: "정기평가", method: "화학물질 평가법", regulation: "산안법 제37조", registered: "2024-07-10", modified: "2024-07-12", completed: "2024-07-14", status: "완료" },
{ id: 17, year: 2024, title: "냉매 가스 취급 작업 평가", type: "수시평가", method: "정성적 평가", regulation: "산안법 제37조", registered: "2024-06-30", modified: "2024-07-01", completed: "2024-07-03", status: "완료" },
{ id: 16, year: 2024, title: "가공기계 위험성 평가", type: "정기평가", method: "위험성수준 3단계 판단법", regulation: "산안법 제37조", registered: "2024-06-15", modified: "2024-06-16", completed: "", status: "진행" },
{ id: 15, year: 2024, title: "야간 작업 평가", type: "수시평가", method: "빈도·강도법", regulation: "산안법 제37조", registered: "2024-06-01", modified: "2024-06-02", completed: "2024-06-03", status: "완료" },
{ id: 14, year: 2024, title: "고소작업 위험성 평가", type: "최초평가", method: "정성적 평가", regulation: "산안법 제37조", registered: "2024-05-12", modified: "2024-05-13", completed: "2024-05-15", status: "완료" },
{ id: 13, year: 2024, title: "중장비 작업 평가", type: "정기평가", method: "정량적 평가", regulation: "산안법 제37조", registered: "2024-05-01", modified: "2024-05-02", completed: "2024-05-04", status: "완료" },
{ id: 12, year: 2024, title: "컨베이어벨트 점검 평가", type: "수시평가", method: "체크리스트법", regulation: "산안법 제37조", registered: "2024-04-20", modified: "2024-04-21", completed: "", status: "진행" },
{ id: 11, year: 2024, title: "수출 포장 작업 평가", type: "정기평가", method: "정량적 평가", regulation: "산안법 제37조", registered: "2024-04-01", modified: "2024-04-02", completed: "2024-04-04", status: "완료" },
{ id: 10, year: 2023, title: "야적장 적재 평가", type: "정기평가", method: "빈도·강도법", regulation: "산안법 제37조", registered: "2023-12-01", modified: "2023-12-02", completed: "2023-12-05", status: "완료" },
{ id: 9, year: 2023, title: "산소용접 작업 평가", type: "최초평가", method: "체크리스트법", regulation: "산안법 제37조", registered: "2023-11-11", modified: "2023-11-12", completed: "2023-11-14", status: "완료" },
{ id: 8, year: 2023, title: "가연성 액체 취급 평가", type: "수시평가", method: "정성적 평가", regulation: "산안법 제37조", registered: "2023-10-05", modified: "2023-10-07", completed: "", status: "진행" },
{ id: 7, year: 2023, title: "산업용 로봇 작업 평가", type: "정기평가", method: "정량적 평가", regulation: "산안법 제37조", registered: "2023-09-18", modified: "2023-09-19", completed: "2023-09-21", status: "완료" },
{ id: 6, year: 2023, title: "건축 해체 작업 위험평가", type: "수시평가", method: "위험성수준 3단계 판단법", regulation: "산안법 제37조", registered: "2023-09-01", modified: "2023-09-02", completed: "2023-09-04", status: "완료" },
{ id: 5, year: 2023, title: "용접 후 가스 제거 평가", type: "최초평가", method: "정성적 평가", regulation: "산안법 제37조", registered: "2023-08-12", modified: "2023-08-14", completed: "2023-08-15", status: "완료" },
{ id: 4, year: 2023, title: "이동형 크레인 작업 평가", type: "정기평가", method: "체크리스트법", regulation: "산안법 제37조", registered: "2023-07-01", modified: "2023-07-02", completed: "2023-07-03", status: "완료" },
{ id: 3, year: 2023, title: "컨테이너 하역 평가", type: "정기평가", method: "정성적 평가", regulation: "산안법 제37조", registered: "2023-06-20", modified: "2023-06-21", completed: "", status: "진행" },
{ id: 2, year: 2023, title: "공장 내 피난동선 점검", type: "수시평가", method: "정량적 평가", regulation: "산안법 제37조", registered: "2023-06-01", modified: "2023-06-02", completed: "2023-06-04", status: "완료" },
{ id: 1, year: 2023, title: "정전기 발생 위험성 평가", type: "정기평가", method: "화학물질 평가법", regulation: "산안법 제37조", registered: "2023-05-10", modified: "2023-05-11", completed: "2023-05-13", status: "완료" }
]


export default function EvaluationList() {
const navigate = useNavigate()
const sortedData = [...initialData].sort((a, b) => a.id - b.id)
const [data, setData] = useState<DataRow[]>(sortedData)
const [checked, setChecked] = useState<(number | string)[]>([])
const [searchText, setSearchText] = useState("")
const [currentPage, setCurrentPage] = useState(1)
const totalPages = Math.ceil(data.length / PAGE_SIZE)
const paginatedData = data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

const handleDelete = () => {
if (checked.length === 0) return alert("삭제할 항목을 선택하세요")
if (window.confirm("정말 삭제하시겠습니까?")) {
const updated = data.filter(row => !checked.includes(row.id))
setData(updated)
setChecked([])
if ((currentPage - 1) * PAGE_SIZE >= updated.length) setCurrentPage(prev => Math.max(1, prev - 1))
}
}

const handleStartEvaluation = () => {
navigate("/risk-assessment/list", { state: { showChecklist: true } })
}

return (
<section className="mypage-content w-full px-3 py-1 bg-[#F8F8F8] flex flex-col min-h-screen">
<div className="flex justify-center w-full">
<div className="border border-[#DDDDDD] bg-white rounded-[13px] p-8 mt-3 w-full flex flex-col">
<PageTitle>위험성평가 목록</PageTitle>
<InfoBox message="평가결과 다운로드 시 위험성평가지 양식으로 자동변환됩니다" />
<div className="mb-3">
<FilterBar
startDate=""
endDate=""
onStartDate={() => {}}
onEndDate={() => {}}
searchText={searchText}
onSearchText={setSearchText}
onSearch={() => console.log("검색:", searchText)}
/>
</div>
<div className="flex justify-between items-center mb-3">
<span className="text-gray-600 text-sm">총 {data.length}건</span>
<div className="flex justify-end gap-1">
<Button variant="action" onClick={handleStartEvaluation} className="flex items-center gap-1">
<FilePen size={16} />
위험성평가 실시
</Button>
<Button variant="action" onClick={() => alert("평가 수정 페이지로 이동")} className="flex items-center gap-1">
<PencilLine size={16} />
위험성평가 수정
</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1">
<Trash2 size={16} />
삭제
</Button>
</div>
</div>
<div className="overflow-x-auto bg-white">
<div className="min-w-[1020px] md:min-w-auto">
<DataTable columns={columns} data={paginatedData} onCheckedChange={setChecked} />
</div>
</div>
<div className="flex justify-center">
<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
</div>
</div>
</div>
</section>
)
}
