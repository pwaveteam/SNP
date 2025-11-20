import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer shrink-0 rounded-[5px] transition-all duration-200 ease-in-out " +
      "h-[19px] w-[19px] border border-[#BFC5CC] bg-white " +
      "data-[state=checked]:bg-[#3363AB] data-[state=checked]:border-none " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] " +
      "hover:border-[#9CA3AF] disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "grid place-content-center text-white transition-transform duration-200 ease-in-out data-[state=checked]:scale-100 scale-0"
      )}
    >
      <Check className="h-[16px] w-[16px] stroke-[3.3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
