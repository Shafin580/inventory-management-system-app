"use client"

import { MouseEventHandler, memo, useEffect, useId, useState } from "react"
import ButtonIcon from "..//ButtonIcon"
import Icon, { IconProps } from "..//Icon"
import { cn } from "tailwind-cn"

export enum TOAST_POSITIONS {
  "top-right" = "top-right",
  "top-left" = "top-left",
  "bottom-left" = "bottom-left",
  "bottom-right" = "bottom-right",
}

interface ToastParams {
  /**
   * The message to be displayed in the toast
   */
  message?: string
  /**
   * Any React nodes to be displayed in the toast instead of the message
   */
  children?: React.ReactNode
  /**
   * The variant of toast to display, the options are `primary`, `secondary`, `success`, `error`, `info` (default), `warning`
   */
  variant?: "primary" | "secondary" | "success" | "error" | "info" | "warning"
  /**
   * Whether to display a close button for the toast
   */
  closeButton?: false
  /**
   * The name of the icon to display in the toast
   */
  iconName?: IconProps["iconName"]
  /**
   * The color of the icon to display in the toast
   * @example
   * "currentColor", "#000"
   */
  iconColor?: string
  /**
   * The duration for which the toast should be visible in milliseconds (default is 3500ms), or `false` to disable auto-closing
   */
  autoClose?: number | false
  /**
   * A callback function to be called when the toast is closed
   */
  onClose?: MouseEventHandler<HTMLElement>
  /**
   * The position of the toast on the screen, the options are `top-left`, `bottom-left`, `bottom-right`; default is `top-right`
   * @see TOAST_POSITIONS
   */
  position?: keyof typeof TOAST_POSITIONS
  /**
   * The ID of the toast element
   */
  id?: string
  /**
   * Additional classes to be applied to the toast container element
   */
  className?: string
  /**
   * Whether to close the toast when clicked
   */
  closeOnClick?: true
}

export type ToastProps = ToastParams &
  ({ message?: never; children: React.ReactNode } | { message: string; children?: never })

const Toast = memo(function Toast({
  message,
  children = undefined,
  variant = "info",
  closeButton = undefined,
  iconName,
  iconColor = "currentColor",
  onClose,
  autoClose = undefined,
  position = "top-right",
  id = undefined,
  className = "",
  closeOnClick = undefined,
}: ToastProps) {
  const uid = useId()
  const [visibilityState, updateVisibilityState] = useState(true)
  const onCloseInternalCallback = () => {
    updateVisibilityState(false)
  }

  useEffect(() => {
    if (autoClose === false) return

    const timer = setTimeout((event) => {
      onCloseInternalCallback()
      onClose?.(event)
    }, autoClose ?? 3500)
    return () => clearTimeout(timer)
  }, [autoClose, onClose])

  return (
    <>
      {visibilityState ? (
        <div
          key={uid}
          id={id}
          onClick={() => {
            closeOnClick && onCloseInternalCallback()
          }}
          style={{ opacity: 1, transform: "translateY(0)" }}
          className={cn(
            "m-8 flex w-full max-w-md items-center space-x-4 rounded-lg border p-12 shadow-md transition-opacity duration-75 ease-in-out dark:bg-slate-800 dark:text-slate-400",
            //=> Animation
            {
              "animate-fade-left": position === "bottom-right" || position === "top-right",
              "animate-fade-right": position === "bottom-left" || position === "top-left",
            },
            //=> Position
            {
              "left-0 top-0": position === "top-left",
              "right-0 top-0": position === "top-right",
              "bottom-0 left-0": position === "bottom-left",
              "bottom-0 right-0": position === "bottom-right",
            },
            //=> Variants
            {
              "border-primary-500 bg-primary-50 text-primary-900": variant === "primary",
              "border-secondary-500 bg-secondary-50 text-secondary-900": variant === "secondary",
              "border-teal-500 bg-teal-50 text-teal-900": variant === "success",
              "border-sky-500 bg-sky-100 text-sky-900": variant === "info",
              "border-rose-500 bg-rose-100 text-rose-900": variant === "error",
              "border-amber-500 bg-amber-50 text-amber-900": variant === "warning",
            },
            className
          )}
          role="alert"
        >
          <div className="flex w-full space-x-8">
            <>
              {children ?? (
                <>
                  {/* Left Icon */}
                  <div className="flex">
                    <Icon
                      iconName={
                        iconName ??
                        (variant === "success"
                          ? "check-circle"
                          : variant === "info"
                            ? "alert-circle"
                            : variant === "warning"
                              ? "alert-hexagon"
                              : variant === "error"
                                ? "alert-triangle"
                                : "alert-circle")
                      }
                      iconColor={iconColor}
                      iconSize="20"
                      className="pointer-events-none mb-auto"
                    />
                  </div>
                  {/* Message */}
                  <div className="inline-flex shrink items-center truncate text-clip whitespace-pre-wrap text-sm font-normal leading-[1.325rem]">
                    {message}
                  </div>
                </>
              )}

              {/* Close Button */}
              {closeButton != false && (
                <div className="!ml-auto flex flex-col">
                  <ButtonIcon
                    // className={`rounded-md hover:bg-slate-200`}
                    clicked={(event) => {
                      onCloseInternalCallback()
                      onClose?.(event)
                    }}
                    iconName="x-close"
                    iconColor={iconColor}
                    className="-mt-4 !p-4 !pt-0"
                  />
                </div>
              )}
            </>
          </div>
        </div>
      ) : null}
    </>
  )
})

export default Toast
