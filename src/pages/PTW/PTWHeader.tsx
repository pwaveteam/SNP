import React from "react"

interface PTWHeaderProps {
info: {
name: string
writer: string
status: string
createdAt: string
}
}

export default function PTWHeader({ info }: PTWHeaderProps): React.ReactElement {
return (
<div className="flex flex-wrap items-center justify-between bg-[#F9FAFB] rounded-lg px-4 py-3 mb-4 text-sm text-gray-700">
<div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
<span><strong>PTW명:</strong> {info.name}</span>
<span><strong>작성자:</strong> {info.writer}</span>
<span><strong>결재:</strong> {info.status}</span>
<span><strong>작성일:</strong> {info.createdAt}</span>
</div>
</div>
)
}
