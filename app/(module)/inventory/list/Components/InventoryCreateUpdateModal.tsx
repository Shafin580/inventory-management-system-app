"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "app/(module)/query.config"
import {
  createInventory,
  CreateUpdateInventoryAPIProps,
} from "app/(module)/services/api/inventory/create-inventory"
import { updateInventory } from "app/(module)/services/api/inventory/update-inventory"
import { AppContext } from "app/App.Context"
import Button from "app/components/global/Button"
import { validateTextInputField } from "app/components/global/Form/Auth/Validation"
import TextArea from "app/components/global/Form/TextArea"
import TextField from "app/components/global/Form/TextField"
import ModalBlank from "app/components/global/ModalBlank"
import { ToastContext } from "app/components/global/Toast/Context"
import { useContext, useEffect, useState } from "react"

interface InventoryCreateUpdateModalProps {
  apiData?: CreateUpdateInventoryAPIProps["data"]
  onConfirm: (e: boolean) => void
  onClose: (e: boolean) => void
  isUpdate?: boolean
}

const InventoryCreateUpdateModal = ({
  apiData,
  onConfirm,
  onClose,
  isUpdate = false,
}: InventoryCreateUpdateModalProps) => {
  const { updateLoadingStatus, token, userInfo } = useContext(AppContext)
  const { renderToast } = useContext(ToastContext)

  const queryClient = useQueryClient()

  const Template = () => {
    const [formData, setFormData] = useState<CreateUpdateInventoryAPIProps["data"]>()
    const [errorField, setErrorField] = useState({
      nameError: "",
      emailError: "",
      phoneError: "",
    })

    // + Function to Validate Data
    const formValidation = (data: CreateUpdateInventoryAPIProps["data"]) => {
      let status = true

      if (validateTextInputField({ isEmail: false, required: true, value: data.name }).status == false) {
        setErrorField((prev) => ({
          ...prev,
          nameError: validateTextInputField({ isEmail: false, required: true, value: data.name }).message,
        }))
        status = false
      }

      return status
    }

    // + Function to Create Inventory
    const createInventoryMutation = useMutation({
      mutationFn: async (data: CreateUpdateInventoryAPIProps["data"]) => {
        updateLoadingStatus(true, "Creating Inventory...")
        const response = await createInventory({
          data: {
            name: data.name,
            description: data.description,
          },
          token: token!,
        })

        if (response.status_code == 201) {
          updateLoadingStatus(false, undefined)
          renderToast([
            {
              message: response.message,
              variant: "success",
            },
          ])
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY.LIST.key] })
          onConfirm(false)
        } else {
          updateLoadingStatus(false, undefined)
          renderToast([
            {
              message: "Error Creating Inventory!",
              variant: "error",
            },
          ])
        }
      },
      onError: () => {
        updateLoadingStatus(false, undefined)
        renderToast([
          {
            message: "Server Error!",
            variant: "error",
          },
        ])
      },
    })

    // + Function to Update Inventory
    const updateInventoryMutation = useMutation({
      mutationFn: async (data: CreateUpdateInventoryAPIProps["data"]) => {
        updateLoadingStatus(true, "Updating Inventory...")
        const response = await updateInventory({
          data: {
            id: data.id,
            name: data.name,
            description: data.description,
          },
          token: token!,
        })

        if (response.status_code == 200) {
          updateLoadingStatus(false, undefined)
          renderToast([
            {
              message: response.message,
              variant: "success",
            },
          ])
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY.LIST.key] })
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY.DYNAMIC(data.id ?? 0).key] })
          onConfirm(false)
        } else {
          updateLoadingStatus(false, undefined)
          renderToast([
            {
              message: "Error Updating Inventory!",
              variant: "error",
            },
          ])
        }
      },
      onError: () => {
        updateLoadingStatus(false, undefined)
        renderToast([
          {
            message: "Server Error!",
            variant: "error",
          },
        ])
      },
    })

    useEffect(() => {
      if (isUpdate) {
        if (apiData) {
          setFormData((prev) => ({
            ...prev,
            id: apiData.id,
            name: apiData.name,
            description: apiData.description == null ? "" : apiData.description,
          }))
        }
      } else {
        setFormData((prev) => ({ ...prev, name: "", description: "", userId: userInfo?.id }))
      }
    }, [isUpdate, apiData])

    return (
      <form
        className="space-y-16"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <h3>{`${isUpdate ? "Update" : "Add New"} Contact`}</h3>

        <div className="grid grid-cols-2 gap-16">
          {/* // + Name Field */}
          <TextField
            value={formData?.name}
            label={"Name"}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev!, name: e.data as string }))
              setErrorField((prev) => ({ ...prev, nameError: "" }))
            }}
            errorText={errorField.nameError.length > 0 ? errorField.nameError : ""}
          />

          {/* // + Description Field */}
          <TextArea
            label="Inventory Description"
            labelClassName="text-sm"
            placeholder="Enter Description..."
            isRequired={true}
            value={formData?.description ?? ""}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev!, description: e.target.value as string }))
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button
            btnText={!isUpdate ? "Create" : "Update"}
            type="submit"
            clicked={() => {
              if (formData) {
                console.log("formData", formData)

                const isFormInputsValid = formValidation(formData)

                if (isFormInputsValid) {
                  if (!isUpdate) {
                    createInventoryMutation.mutate(formData)
                  } else {
                    updateInventoryMutation.mutate(formData)
                  }
                }
              }
            }}
          />
        </div>
      </form>
    )
  }

  return (
    <>
      <ModalBlank
        modalSize="md"
        showCrossButton
        onCloseModal={() => onClose(false)}
        onClickOutToClose={false}
        className="max-h-[790px] overflow-y-scroll"
      >
        <Template />
      </ModalBlank>
    </>
  )
}

export default InventoryCreateUpdateModal
