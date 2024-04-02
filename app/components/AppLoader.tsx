import Spinner, { SpinnerProps } from "./global/Spinner"
import { memo, useEffect } from "react"
import { cn } from "tailwind-cn"

export interface AppLoaderProps {
  className?: string
  spinnerContainer?: {
    className?: string
  }
  spinnerProps: SpinnerProps
}

export const AppLoader = memo(function Component({
  className,
  spinnerContainer,
  spinnerProps,
}: AppLoaderProps) {
  const mergedSpinnerProps = {
    spinnerText: "Loading",
    variant: "primary",
    size: "lg",
    ...spinnerProps,
  } as const

  useEffect(() => {
    // on unmount spinner text should be reset so that
    // the changed text doesn't show up on next load
    return () => {
      mergedSpinnerProps.spinnerText = "Loading"
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-[1000] flex h-full w-full items-center justify-center bg-slate-50 bg-opacity-10 backdrop-blur-[2px]",
        className
      )}
    >
      <div
        className={cn(
          "min-h-fit min-w-fit rounded-md bg-slate-100 p-20 pb-10 shadow-sm",
          spinnerContainer?.className
        )}
      >
        <Spinner {...mergedSpinnerProps} />
      </div>
    </div>
  )
})
