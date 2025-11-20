import React, { useCallback, useEffect, useState, useRef } from "react"
import Tree from "react-d3-tree"

export type OrgNode = {
id: number | string
title: string
name?: string
position?: string
children?: OrgNode[]
level?: number
}

interface OrganizationTreeProps {
data: OrgNode | OrgNode[]
supervisors?: OrgNode[]
}

// 레벨별 스타일 정의
const LEVEL_STYLES = {
1: { width: 180, height: 80, titleSize: 14, nameSize: 17, bgColor: "#F0F9FF" },
2: { width: 170, height: 75, titleSize: 13, nameSize: 16, bgColor: "#FEFCE8" },
3: { width: 160, height: 70, titleSize: 12, nameSize: 15, bgColor: "#FEF3C7" },
4: { width: 150, height: 65, titleSize: 11, nameSize: 14, bgColor: "#FFF" }
}

const renderNode = ({ nodeDatum }: { nodeDatum: OrgNode }) => {
const level = (nodeDatum.level || 1) as 1 | 2 | 3 | 4
const style = LEVEL_STYLES[level] || LEVEL_STYLES[4]

return (
<g>
<foreignObject 
x={-style.width / 2} 
y={-style.height / 2} 
width={style.width} 
height={style.height}
>
<div style={{
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
width: "100%",
height: "100%",
border: "1px solid #D1D5DB",
borderRadius: 8,
background: style.bgColor,
boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
padding: "4px"
}}>
<div style={{
fontSize: style.titleSize,
fontWeight: 600,
color: "#6B7280"
}}>
{nodeDatum.title}
</div>
{nodeDatum.name && (
<div style={{
fontSize: style.nameSize,
fontWeight: 700,
color: "#111827",
marginTop: 2
}}>
{nodeDatum.name}
</div>
)}
{nodeDatum.position && (
<div style={{
fontSize: style.titleSize - 1,
color: "#4B5563"
}}>
{nodeDatum.position}
</div>
)}
</div>
</foreignObject>
</g>
)
}

const OrganizationTree: React.FC<OrganizationTreeProps> = ({ data, supervisors = [] }) => {
const [translate, setTranslate] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
const [lastLevelInfo, setLastLevelInfo] = useState({ midX: 0, y: 0 })
const containerRef = useRef<HTMLDivElement>(null)

// 컨테이너 크기 감지 및 중앙 정렬
useEffect(() => {
const updateDimensions = () => {
if (containerRef.current) {
const { width, height } = containerRef.current.getBoundingClientRect()
setDimensions({ width, height })
setTranslate({ x: width / 2, y: 80 })
}
}

updateDimensions()
window.addEventListener("resize", updateDimensions)

return () => window.removeEventListener("resize", updateDimensions)
}, [])

// 마지막 레벨 위치 계산
useEffect(() => {
const timer = setTimeout(() => {
const nodes = document.querySelectorAll(".rd3t-node")
if (nodes.length === 0) return

let maxY = 0
const xPositions: number[] = []

nodes.forEach(node => {
const transform = (node as SVGGElement).getAttribute("transform")
if (transform) {
const match = /translate\(([-\d.]+),([-\d.]+)\)/.exec(transform)
if (match) {
const x = parseFloat(match[1])
const y = parseFloat(match[2])
if (y > maxY) maxY = y
xPositions.push(x)
}
}
})

if (xPositions.length > 0) {
const midX = xPositions.reduce((a, b) => a + b, 0) / xPositions.length
setLastLevelInfo({ midX, y: maxY })
}
}, 500)

return () => clearTimeout(timer)
}, [data, dimensions])

const renderCustomNode = useCallback(renderNode, [])

return (
<div 
ref={containerRef}
style={{
width: "100%",
height: "700px",
background: "#FAFAFA",
borderRadius: "12px",
position: "relative",
overflow: "auto",
border: "1px solid #E5E7EB"
}}
>
<Tree
data={data as any}
translate={translate}
orientation="vertical"
pathFunc="elbow"
renderCustomNodeElement={renderCustomNode as any}
zoomable={true}
scaleExtent={{ min: 0.5, max: 2 }}
nodeSize={{ x: 200, y: 130 }}
separation={{ siblings: 1.3, nonSiblings: 1.6 }}
pathClassFunc={() => "custom-link"}
/>

{supervisors.length > 0 && lastLevelInfo.y !== 0 && (
<>
<svg 
style={{
position: "absolute",
top: 0,
left: 0,
width: "100%",
height: "100%",
pointerEvents: "none"
}}
>
{/* 수직선 */}
<line 
x1={lastLevelInfo.midX} 
x2={lastLevelInfo.midX} 
y1={lastLevelInfo.y + 35} 
y2={lastLevelInfo.y + 70} 
stroke="#9CA3AF" 
strokeWidth={2}
/>

{/* 수평선 */}
<line 
x1={lastLevelInfo.midX - 450} 
x2={lastLevelInfo.midX + 450} 
y1={lastLevelInfo.y + 70} 
y2={lastLevelInfo.y + 70} 
stroke="#9CA3AF" 
strokeWidth={2}
/>

{/* 각 supervisor로 내려가는 선 */}
{supervisors.map((_, i) => {
const spacing = 220
const startX = lastLevelInfo.midX - (spacing * (supervisors.length - 1)) / 2
const x = startX + i * spacing
return (
<line 
key={i} 
x1={x} 
x2={x} 
y1={lastLevelInfo.y + 70} 
y2={lastLevelInfo.y + 120} 
stroke="#9CA3AF" 
strokeWidth={2}
/>
)
})}
</svg>

{/* Supervisor 노드들 */}
<div style={{
position: "absolute",
top: lastLevelInfo.y + 120,
left: "50%",
transform: "translateX(-50%)",
display: "flex",
gap: "70px",
justifyContent: "center"
}}>
{supervisors.map(supervisor => (
<div 
key={supervisor.id} 
style={{
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
width: 150,
height: 65,
border: "1px solid #D1D5DB",
borderRadius: 8,
background: "#FFFFFF",
boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
}}
>
<div style={{
fontSize: 11,
fontWeight: 600,
color: "#6B7280"
}}>
{supervisor.title}
</div>
<div style={{
fontSize: 14,
fontWeight: 700,
color: "#111827",
marginTop: 2
}}>
{supervisor.name}
</div>
<div style={{
fontSize: 10,
color: "#4B5563"
}}>
{supervisor.position}
</div>
</div>
))}
</div>
</>
)}

<style>{`
.custom-link {
stroke: #9CA3AF !important;
stroke-width: 2px !important;
}
`}</style>
</div>
)
}

export default OrganizationTree