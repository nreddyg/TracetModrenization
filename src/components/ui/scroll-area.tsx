// import * as React from "react"
// import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

// import { cn } from "@/lib/utils"

// interface ScrollAreaProps
//   extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
//   hideScrollbar?: boolean
//   scrollStyle?: string
// }

// const ScrollArea = React.forwardRef<
//   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
//   ScrollAreaProps
// >(({ className, children, hideScrollbar = false, scrollStyle, ...props }, ref) => (
//   <ScrollAreaPrimitive.Root
//     ref={ref}
//     className={cn("relative overflow-hidden", className)}
//     {...props}
//   >
//     <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
//       {children}
//     </ScrollAreaPrimitive.Viewport>
//     <ScrollBar hidden={hideScrollbar} scrollStyle={scrollStyle} />

//     <ScrollAreaPrimitive.Corner />
//   </ScrollAreaPrimitive.Root>
// ))
// ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

// interface ScrollBarProps
//   extends React.ComponentPropsWithoutRef<
//     typeof ScrollAreaPrimitive.ScrollAreaScrollbar
//   > {
//   hidden?: boolean
//   scrollStyle?: string
// }

// const ScrollBar = React.forwardRef<
//   React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
//   ScrollBarProps
// >(({ className, scrollStyle, orientation = "vertical", hidden = false, ...props }, ref) => (
//   <ScrollAreaPrimitive.ScrollAreaScrollbar
//     ref={ref}
//     orientation={orientation}
//     className={cn(
//       "flex touch-none select-none transition-colors",
//       orientation === "vertical" &&
//         "h-full w-2.5 border-l border-l-transparent p-[1px]",
//       orientation === "horizontal" &&
//         "h-2.5 flex-col border-t border-t-transparent p-[1px]",
//       hidden && "opacity-0 pointer-events-none",
//       className
//     )}
//     {...props}
//   >
//     <ScrollAreaPrimitive.ScrollAreaThumb
//       className={cn(
//         "relative flex-1 rounded-full bg-border",
//         scrollStyle,
//         hidden && "bg-transparent"
//       )}
//     />
//   </ScrollAreaPrimitive.ScrollAreaScrollbar>
// ))
// ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// export { ScrollArea, ScrollBar }

// -----------------------------------------------------------------------------------------
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  hideScrollbar?: boolean
  scrollStyle?: string
  horizontal?: boolean   // ⬅ NEW
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, hideScrollbar = false, scrollStyle, horizontal = false, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {/* Only wrap if horizontal scrolling requested */}
        {horizontal ? (
          <div className="min-w-max whitespace-nowrap">{children}</div>
        ) : (
          children
        )}
      </ScrollAreaPrimitive.Viewport>

      {/* Vertical Scrollbar */}
      <ScrollBar hidden={hideScrollbar} scrollStyle={scrollStyle} />

      {/* Horizontal Scrollbar if horizontal = true */}
      {horizontal && (
        <ScrollBar
          orientation="horizontal"
          hidden={hideScrollbar}
          scrollStyle={scrollStyle}
        />
      )}

      {horizontal && <ScrollAreaPrimitive.Corner />}
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName


interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > {
  hidden?: boolean
  scrollStyle?: string
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, scrollStyle, orientation = "vertical", hidden = false, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "w-full h-2.5 flex-col border-t border-t-transparent p-[1px]",
        hidden && "opacity-0 pointer-events-none",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn(
          "relative flex-1 rounded-full bg-border",
          scrollStyle,
          hidden && "bg-transparent"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
})
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }





















// import * as React from "react"
// import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

// import { cn } from "@/lib/utils"

// interface ScrollAreaProps
//   extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
//   hideScrollbar?: boolean
// }

// const ScrollArea = React.forwardRef<
//   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
//   ScrollAreaProps
// >(({ className, children, hideScrollbar = false, ...props }, ref) => (
//   <ScrollAreaPrimitive.Root
//     ref={ref}
//     className={cn("relative overflow-hidden", className)}
//     {...props}
//   >
//     <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
//       {children}
//     </ScrollAreaPrimitive.Viewport>
//     <ScrollBar hidden={hideScrollbar} />
//     <ScrollAreaPrimitive.Corner />
//   </ScrollAreaPrimitive.Root>
// ))
// ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

// interface ScrollBarProps
//   extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
//   hidden?: boolean
// }

// const ScrollBar = React.forwardRef<
//   React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
//   ScrollBarProps
// >(({ className, orientation = "vertical", hidden = false, ...props }, ref) => (
//   <ScrollAreaPrimitive.ScrollAreaScrollbar
//     ref={ref}
//     orientation={orientation}
//     className={cn(
//       "flex touch-none select-none transition-colors",
//       orientation === "vertical" &&
//         "h-full w-2.5 border-l border-l-transparent p-[1px]",
//       orientation === "horizontal" &&
//         "h-2.5 flex-col border-t border-t-transparent p-[1px]",
//       hidden && "opacity-0 pointer-events-none",
//       className
//     )}
//     {...props}
//   >
//     <ScrollAreaPrimitive.ScrollAreaThumb
//       className={cn("relative flex-1 rounded-full bg-border", hidden && "bg-transparent")}
//     />
//   </ScrollAreaPrimitive.ScrollAreaScrollbar>
// ))
// ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// export { ScrollArea, ScrollBar }

