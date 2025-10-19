import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { clx } from "@medusajs/ui"

interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /**
   * The orientation of the divider.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical"
  /**
   * Whether or not the component is purely decorative. When true, accessibility-related attributes
   * are updated so that the rendered element is removed from the accessibility tree.
   * @default true
   */
  decorative?: boolean
  /**
   * The variant of the divider.
   * @default "solid"
   */
  variant?: "solid" | "dashed"
}

/**
 * This component is based on the [Radix UI Separator](https://www.radix-ui.com/primitives/docs/components/separator) primitive.
 * 
 * A divider component that creates visual separation between content sections.
 * Follows Medusa UI design patterns and accessibility standards.
 */
const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(({ className, orientation = "horizontal", decorative = true, variant = "solid", ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={clx(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      variant === "dashed" && "border-dashed border-t border-l-0 border-r-0 border-b-0 bg-transparent",
      className
    )}
    {...props}
  />
))

Divider.displayName = "Divider"

export { Divider, type DividerProps }