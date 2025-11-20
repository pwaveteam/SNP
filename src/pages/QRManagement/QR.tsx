import React, { useState } from "react"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import sampleQR from "@/assets/QRImages/sample-qr.jpg"

const columns: Column[] = [
{ key: "qrName", label: "QR항목", type: "text" },
{ key: "link", label: "간편 연결", type: "text" },
{ key: "qrCode", label: "QR코드", type: "image" },
{ key: "imgDownload", label: "이미지 저장", type: "download" },
{ key: "useStatus", label: "사용여부", type: "toggle" }
]

const initialItems = [
{ id: 1, qrName: "근로자 앱 설치 QR", link: "안드로이드/iOS 다운로드 링크", useStatus: true },
{ id: 2, qrName: "관리자 페이지 접속 QR", link: "관리자용 웹페이지 링크", useStatus: true },
{ id: 3, qrName: "종사자 의견청취 QR", link: "설문/건의 등 의견 수렴 폼 링크", useStatus: true },
{ id: 4, qrName: "관리자 사용 가이드 QR", link: "관리자용 사용 설명서", useStatus: true },
{ id: 5, qrName: "근로자 앱 사용 가이드 QR", link: "근로자용 사용법 안내", useStatus: true }
]

export default function QRManagement() {
const [items, setItems] = useState(initialItems)

const handleToggleChange = (id: number | string, key: string, value: boolean) => {
setItems(prev =>
prev.map(item =>
item.id === id ? { ...item, [key]: value } : item
)
)
}

const data: DataRow[] = items.map(v => ({
id: v.id,
qrName: v.qrName,
link: v.link,
qrCode: { src: sampleQR, alt: v.qrName, images: [sampleQR] },
imgDownload: true,
useStatus: v.useStatus
}))

return (
<section className="qr-management-content w-full bg-white">
<PageTitle>QR관리</PageTitle>
<TabMenu tabs={["QR 관리"]} activeIndex={0} onTabClick={() => {}} className="mb-6" />
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px]">총 {data.length}건</span>
</div>
<div className="overflow-x-auto bg-white mt-4">
<style>{`.qr-management-content table tbody tr>td{height:60px}`}</style>
<DataTable 
columns={columns} 
data={data} 
onToggleChange={handleToggleChange}
/>
</div>
</section>
)
}