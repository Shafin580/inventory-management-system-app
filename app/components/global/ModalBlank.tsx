import { Fragment, useRef, useState, memo, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import ButtonIcon from "./ButtonIcon"
import { cn } from "tailwind-cn"

export interface ModalBlankProps {
  showBackdrop?: boolean
  children?: any
  modalSize?: "sm" | "md" | "lg" | "full"
  modalAlign?: "center" | "top"
  modalBgClassName?: string
  showCrossButton?: boolean
  containerClassName?: string
  className?: string
  onCloseModal?: Function
  onClickOutToClose?: boolean
}

/**
 * Modal Component
 *
@param {boolean} showBackdrop — Show or hide the modal backdrop ==> True by default
@param {any} children — Wraps the children in the parent
@param {string} modalSize — Size of the Modal: 'sm' | 'md' | 'lg' | 'full'
@param {any} modalAlign — Align the Modal: 'center' | 'top'
@param {string} modalContentAlign — Align Modal content 'left' | 'center' | 'right' ==> Center by default
@param {string} modalBgClassName — Modal panel background class
@param {boolean} showCrossButton — Align Modal content 'left' | 'center' | 'right' ==> Center by default
@param {boolean} onClickOutToClose — Click outside modal to close automatically or not | false by default
@param {we don't know yet} onCloseModal — Parent controls what to do with onClose()
 */

const ModalBlank = memo(function ModalBlank({
  showBackdrop = true,
  children = "This is a blank modal",
  modalSize = "lg",
  modalAlign = "center",
  onCloseModal,
  modalBgClassName = "bg-white",
  onClickOutToClose = false,
  containerClassName,
  className,
  showCrossButton,
}: ModalBlankProps) {
  const [open, setOpen] = useState(true)
  const cancelButtonRef = useRef(null)

  const onClose = () => {
    setOpen(false)
    if (onCloseModal) onCloseModal()
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={cn("relative z-40", containerClassName)}
        initialFocus={cancelButtonRef}
        onClose={() => {
          if (onClickOutToClose || onCloseModal) {
            onClose()
          }
        }}
      >
        {showBackdrop == true && (
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-40 bg-slate-900 bg-opacity-75 transition-opacity" />
          </Transition.Child>
        )}

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className={`flex min-h-full justify-center p-20
						${modalAlign == "top" ? "items-start" : "items-center"}
					`}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={cn(
                  "modal-blank relative transform space-y-20 rounded-lg p-20 shadow-xl transition-all sm:my-8 sm:w-full sm:p-24",
                  modalSize == "sm" && "w-full sm:max-w-lg",
                  modalSize == "md" && "w-full sm:max-w-3xl",
                  modalSize == "lg" && "w-full sm:max-w-7xl",
                  modalSize == "full" && "sm:max-w-full",
                  modalBgClassName,
                  className
                )}
              >
                {/* // ! Close Button */}
                {showCrossButton && (
                  <div className="absolute right-12 top-12 rounded-full p-4 text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-500">
                    <ButtonIcon
                      iconName="x-close"
                      className="!flex !aspect-square"
                      iconSize="24"
                      clicked={onClose}
                    />
                  </div>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
})
export default ModalBlank
