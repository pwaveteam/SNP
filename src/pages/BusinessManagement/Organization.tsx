import React, { useState, useRef } from "react"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import Button from "@/components/common/base/Button"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import Pagination from "@/components/common/base/Pagination"
import OrganizationTree, { OrgNode } from "@/components/modules/OrganizationTree"
import StaffRegisterModal from "./StaffRegister"
import useTableActions from "@/hooks/tableActions"
import usePagination from "@/hooks/usePagination"
import { CirclePlus, Image, Upload, Printer, Trash2, ShieldAlert } from "lucide-react"

const TAB_LABELS = ["전체인력 목록"]
const ORG_CHART_TABS = ["시스템 조직도", "조직도 이미지"]

const columns: Column[] = [
{ key: "name", label: "이름" },
{ key: "safetyPosition", label: "안전직위" },
{ key: "department", label: "부서" },
{ key: "position", label: "직급" },
{ key: "phone", label: "연락처" },
{ key: "entryDate", label: "입사일", type: "date" },
{ key: "assignDate", label: "안전직위 지정일", type: "date" },
{ key: "manage", label: "관리", type: "manage" }
]

const initialStaffs: DataRow[] = [
{ id: 1, name: "박대표", safetyPosition: "경영책임자", department: "경영지원팀", position: "대표이사", phone: "010-1234-5678", entryDate: "-", assignDate: "2022-01-10" },
{ id: 2, name: "최책임", safetyPosition: "안전보건관리책임자", department: "생산관리팀", position: "부장", phone: "010-3333-7777", entryDate: "2021-05-10", assignDate: "2022-03-10" },
{ id: 3, name: "박안전", safetyPosition: "안전관리자", department: "안전관리팀", position: "과장", phone: "010-8888-1234", entryDate: "2020-08-15", assignDate: "2020-09-01" },
{ id: 4, name: "이보건", safetyPosition: "보건관리자", department: "보건팀", position: "주임", phone: "010-5555-4321", entryDate: "2019-11-20", assignDate: "2019-12-10" },
{ id: 5, name: "김반장", safetyPosition: "관리감독자", department: "생산1팀", position: "반장", phone: "010-1111-2222", entryDate: "2023-01-15", assignDate: "2023-02-01" },
{ id: 6, name: "조반장", safetyPosition: "관리감독자", department: "생산2팀", position: "반장", phone: "010-3333-4444", entryDate: "2022-06-12", assignDate: "2022-07-01" },
{ id: 7, name: "최반장", safetyPosition: "관리감독자", department: "품질관리팀", position: "반장", phone: "010-5555-6666", entryDate: "2021-03-18", assignDate: "2021-04-01" }
]

const orgTreeData: OrgNode[] = [
{
id: "1",
title: "경영책임자",
name: "박대표",
position: "대표이사",
children: [
{
id: "2",
title: "안전보건관리책임자",
name: "최책임",
position: "부장",
children: [
{ id: "3", title: "안전관리자", name: "박안전", position: "과장" },
{ id: "4", title: "보건관리자", name: "이보건", position: "주임" }
]
}
]
}
]

const supervisorNodes: OrgNode[] = [
{id:"5",title:"관리감독자",name:"김반장",position:"반장"},
{id:"6",title:"관리감독자",name:"조반장",position:"반장"},
{id:"7",title:"관리감독자",name:"최반장",position:"반장"}
]

export default function Organization() {
const [staffs, setStaffs] = useState<DataRow[]>(initialStaffs)
const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
const [modalOpen, setModalOpen] = useState(false)
const [orgChartTab, setOrgChartTab] = useState(0)
const [uploadedOrgChart, setUploadedOrgChart] = useState<string>("")
const fileInputRef = useRef<HTMLInputElement>(null)

const {currentPage, totalPages, currentData, onPageChange} = usePagination<DataRow>(staffs, 30)

const {handleCreate, handleDelete, handlePrint, handleImageSave} = useTableActions({
data: staffs,
checkedIds,
onCreate: () => setModalOpen(true),
onDeleteSuccess: (ids) => setStaffs(prev => prev.filter(row => !ids.includes(row.id)))
})

const handleOrgChartFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
if (e.target.files && e.target.files.length > 0) {
const file = e.target.files[0]
const fileUrl = URL.createObjectURL(file)
setUploadedOrgChart(fileUrl)
}
}

const handleSaveStaff = (staff: Partial<DataRow>) => {
setStaffs(prev => [{ id: Date.now(), ...staff }, ...prev])
setModalOpen(false)
}

return (
<section className="mypage-content w-full">
<PageTitle>전체인력관리</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={0} onTabClick={() => {}} className="mb-6" />

<div className="flex justify-between items-center mb-3">
<span className="text-gray-600 text-sm">총 {staffs.length}건</span>
<div className="flex gap-1">
<Button variant="action" onClick={handleCreate} className="flex items-center gap-1"><CirclePlus size={16} />인력추가</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Printer size={16} />인쇄</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable columns={columns} data={currentData} onCheckedChange={setCheckedIds} />
</div>

<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

<PageTitle>안전조직도</PageTitle>

<TabMenu tabs={ORG_CHART_TABS} activeIndex={orgChartTab} onTabClick={setOrgChartTab} className="mb-3" />

{orgChartTab === 0 ? (
<div>
<div className="flex justify-end gap-1 mb-3">
<Button variant="action" onClick={handleImageSave} className="flex items-center gap-1"><Image size={16} />이미지로 저장</Button>
</div>
<div className="w-full bg-white rounded-[8px] p-6 flex justify-center">
<div className="w-full max-w-[1200px] text-center">
<OrganizationTree data={orgTreeData} supervisors={supervisorNodes} />
</div>
</div>
</div>
) : (
<div>
<div className="w-full bg-white rounded-[8px] p-6 flex justify-center min-h-[200px]">
{uploadedOrgChart?(
<div className="w-full flex justify-center">
<img src={uploadedOrgChart} alt="조직도이미지" className="max-w-[800px] max-h-[600px] object-contain rounded" />
</div>
):(
<div className="flex flex-col items-center text-center text-gray-600 mt-16 mb-16">
<div className="mb-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
<ShieldAlert size={24} className="sm:w-8 sm:h-8 w-6 h-6 text-gray-500" />
</div>
<h3 className="text-sm sm:text-lg font-semibold mb-1">사업장 조직도가 등록되지 않았습니다.</h3>
<p className="text-xs sm:text-sm text-gray-500 mb-5">조직도 이미지를 업로드한 후 조직관리를 시작해보세요</p>
<Button variant="action" onClick={()=>fileInputRef.current?.click()} className="flex items-center justify-center gap-1 px-6">
<Upload size={16} className="text-gray-500" />
조직도 이미지 업로드
</Button>
<input type="file" accept=".jpg,.jpeg,.png,.pdf" ref={fileInputRef} className="hidden" onChange={handleOrgChartFileChange} />
</div>
)}
</div>
</div>

)}

<StaffRegisterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveStaff} />
</section>
)
}