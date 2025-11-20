// src/components/modules/ApprovalDetail.tsx
import React from "react"
import Button from "@/components/common/base/Button"
import Badge from "@/components/common/base/Badge"
import Dialog from "@/components/common/base/Dialog"

export type ReceivedDetail={date:string;type:string;content:string;drafter:string;status:string}
export type SentDetail={date:string;document:string;status:string;progress:string;finalApprover:string}
type Props={variant:"received";row:ReceivedDetail;onClose:()=>void}|{variant:"sent";row:SentDetail;onClose:()=>void}

const renderStatus=(variant:"received"|"sent",status:string)=>{
if(variant==="received"){
if(status==="결재완료")return<Badge color="gray">결재완료</Badge>
if(status==="결재대기")return<Badge color="orange">결재대기</Badge>
return<Badge color="gray">{status}</Badge>
}
if(status==="진행")return<Badge color="green">진행</Badge>
if(status==="완료")return<Badge color="gray">완료</Badge>
if(status==="대기")return<Badge color="orange">대기</Badge>
return<Badge color="gray">{status}</Badge>
}

const ApprovalDetail:React.FC<Props>=({variant,row,onClose})=>{
const isSigned=variant==="received"&&row.status==="결재완료"
const isPending=variant==="received"&&row.status==="결재대기"

return(
<Dialog title="결재 상세 정보" onClose={onClose} size="md">
{variant==="received"?(
<div className="grid grid-cols-3 gap-y-3 text-sm py-2">
<div className="font-medium text-gray-600">기안일</div><div className="col-span-2">{row.date}</div>
<div className="font-medium text-gray-600">결재유형</div><div className="col-span-2">{row.type}</div>
<div className="font-medium text-gray-600">결재내용</div><div className="col-span-2 whitespace-pre-line">{row.content}</div>
<div className="font-medium text-gray-600">기안자</div><div className="col-span-2">{row.drafter}</div>
<div className="font-medium text-gray-600">상태</div>
<div className="col-span-2 flex items-center gap-2">
{renderStatus("received",row.status)}
{isPending&&<Button variant="mutedGray"/>}
{isSigned&&<Button variant="mutedBlue"/>}
</div>
</div>
):(
<div className="grid grid-cols-3 gap-y-3 text-sm py-2">
<div className="font-medium text-gray-600">기안일</div><div className="col-span-2">{row.date}</div>
<div className="font-medium text-gray-600">결재문서</div><div className="col-span-2 whitespace-pre-line">{row.document}</div>
<div className="font-medium text-gray-600">상태</div><div className="col-span-2">{renderStatus("sent",row.status)}</div>
<div className="font-medium text-gray-600">결재진행</div><div className="col-span-2">{row.progress}</div>
<div className="font-medium text-gray-600">최종결재자</div><div className="col-span-2">{row.finalApprover}</div>
</div>
)}
</Dialog>
)}
export default ApprovalDetail
