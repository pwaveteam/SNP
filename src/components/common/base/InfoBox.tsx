import React from "react"
import { Wand2 } from "lucide-react"

interface InfoBoxProps {
message: string
}

const InfoBox: React.FC<InfoBoxProps> = ({ message }) => (
<div>
<div className="mb-1 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm md:text-base text-[#031E36] flex items-center gap-1">
<Wand2 size={16} className="text-blue-400" />
<span>{message}</span>
</div>
</div>
)

export default InfoBox