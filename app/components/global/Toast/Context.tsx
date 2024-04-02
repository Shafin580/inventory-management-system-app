import React, { createContext, ReactNode, useState } from "react"
import { ToastProps } from "."

export interface ToastContextProps {
  toastProps: ToastProps[] | null
  /**
   *
   * @param toastPropsData Array of `ToastProps` to be passed to the toast component, @see `ToastProps` interface
   * @example
   * ```tsx
   const { renderToast } = useContext(ToastContext)

   renderToast([
      {
        message: `This is a toast message displayed in DOM`,
        onClose: (e) => {
          console.log("onClose", e)
        }
      },
      // or
      {
        children: (
          <div className="flex flex-col gap-4">
            <h3>This is a toast message displayed in DOM</h3>
            <p>With custom JSX</p>
          </div>
        ),
        onClose: (e) => {
          console.log("onClose", e)
        }
      }
   ])
   * ```
   */
  renderToast: (toastPropsData: ToastContextProps["toastProps"]) => void
}

export const ToastContext = createContext<ToastContextProps | Record<string, never>>({})

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastProps, updateToastProps] = useState<ToastContextProps["toastProps"]>(null)

  const renderToast = (toastPropsData: ToastContextProps["toastProps"]) => {
    updateToastProps((prev) => [...(prev ?? []), ...(toastPropsData ?? [])]) // - coalesce operator for null check
  }

  return <ToastContext.Provider value={{ toastProps, renderToast }}>{children}</ToastContext.Provider>
}
