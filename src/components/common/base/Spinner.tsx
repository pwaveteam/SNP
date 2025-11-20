// common/base/Spinner.tsx
import { Spinner as FlowbiteSpinner } from "flowbite-react"

export default function Spinner() {
return (
<FlowbiteSpinner
aria-label="Loading..."
className="w-6 h-6 text-white fill-white"
/>
)
}