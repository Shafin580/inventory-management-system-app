"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchImageData } from "@utils/helpers/misc"
import { QUERY_KEYS } from "app/(module)/query.config"
import {
  createInventoryItem,
  CreateUpdateInventoryItemAPIProps,
} from "app/(module)/services/api/inventory-item/create-inventory-item"
import { updateInventoryItem } from "app/(module)/services/api/inventory-item/update-inventory-item"
import { AppContext } from "app/App.Context"
import Button from "app/components/global/Button"
import ButtonIcon from "app/components/global/ButtonIcon"
import FileDragDrop from "app/components/global/Form/FileDragDrop"
import TextArea from "app/components/global/Form/TextArea"
import TextField from "app/components/global/Form/TextField"
import ModalBlank from "app/components/global/ModalBlank"
import { ToastContext } from "app/components/global/Toast/Context"
import Image from "next/image"
import { useContext, useEffect, useState } from "react"

interface InventoryItemCreateUpdateModalProps {
  apiData?: CreateUpdateInventoryItemAPIProps["data"]
  inventoryId: number
  onConfirm: (e: boolean) => void
  onClose: (e: boolean) => void
  isUpdate?: boolean
}

const CreateUpdateInventoryItemModal = ({
  apiData,
  inventoryId,
  isUpdate,
  onClose,
  onConfirm,
}: InventoryItemCreateUpdateModalProps) => {
  const { token, userInfo, updateLoadingStatus } = useContext(AppContext)
  const { renderToast } = useContext(ToastContext)
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<CreateUpdateInventoryItemAPIProps["data"]>({
    inventoryId: inventoryId,
    name: "",
    description: "",
    image: null,
    quantity: 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const fallbackImgSrc = String(process.env.NEXT_PUBLIC_FALLBACK_IMAGE_SRC)
  const [cancelImageButtonVisibility, setCancelImageButtonVisibility] = useState(true)
  const [imageDragNDropModalVisibility, setImageDragNDropModalVisibility] = useState(false)

  // + Function to fetch image file
  const fetchImageFile = async () => {
    const data = await fetchImageData(String(apiData?.image), apiData?.name ?? "")
    setImageFile(data)
  }

  // + Function Mutation Query to Create Inventory Item
  const createInventoryItemQuery = useMutation({
    mutationFn: async (data: CreateUpdateInventoryItemAPIProps["data"]) => {
      let formattedData = { ...data }
      if (imageFile != null) {
        formattedData.image = imageFile
      }
      updateLoadingStatus(true, "Creating")
      const response = await createInventoryItem({ token: token!, data: formattedData })

      if (response.status_code == 201) {
        renderToast([
          {
            message: response.message,
            variant: "success",
          },
        ])
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY_ITEM.LIST(inventoryId).key] })
      } else {
        renderToast([
          {
            message: response.message,
            variant: "error",
          },
        ])
      }
      onConfirm(false)
      updateLoadingStatus(false, undefined)
    },
    onError: () => {
      onConfirm(false)
      updateLoadingStatus(false, undefined)
      renderToast([
        {
          message: "Server Error!",
          variant: "error",
        },
      ])
    },
  })

  // + Function Mutation Query to Update Inventory Item
  const updateInventoryItemQuery = useMutation({
    mutationFn: async (data: CreateUpdateInventoryItemAPIProps["data"]) => {
      let formattedData = { ...data }
      if (imageFile != null) {
        formattedData.image = imageFile
      }
      updateLoadingStatus(true, "Updating")
      const response = await updateInventoryItem({ token: token!, data: formattedData })

      if (response.status_code == 201) {
        renderToast([
          {
            message: response.message,
            variant: "success",
          },
        ])
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY_ITEM.LIST(inventoryId).key] })
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY_ITEM.DYNAMIC(data.id ?? 0).key] })
      } else {
        renderToast([
          {
            message: response.message,
            variant: "error",
          },
        ])
      }
      onConfirm(false)
      updateLoadingStatus(false, undefined)
    },
    onError: () => {
      onConfirm(false)
      updateLoadingStatus(false, undefined)
      renderToast([
        {
          message: "Server Error!",
          variant: "error",
        },
      ])
    },
  })

  // + On Load UseEffect Call
  useEffect(() => {
    if (isUpdate) {
      if (apiData) {
        setFormData((prev) => ({
          ...prev,
          name: apiData.name,
          description: apiData.description,
          quantity: apiData.quantity,
          inventoryId: apiData.inventoryId,
          id: apiData.id,
          image: apiData.image,
        }))
        if (apiData.image != null) {
          fetchImageFile()
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        inventoryId: inventoryId,
        name: "",
        description: "",
        image: null,
        quantity: 0,
      }))
    }
  }, [isUpdate, apiData])

  // + Debugging UseEffect Calls
  useEffect(() => {
    console.log("Form Data", formData)
  }, [formData])

  return (
    <ModalBlank
      modalSize="md"
      showCrossButton
      onCloseModal={() => onClose(false)}
      onClickOutToClose={false}
      className="max-h-[790px] overflow-y-scroll"
    >
      <form
        className="flex flex-col gap-20"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <div className="relative flex place-content-center">
          <img
            className="mb-12 rounded"
            alt={formData.name}
            src={formData.image != null ? String(formData.image) : fallbackImgSrc}
            width={270}
            height={152}
          />
          <ButtonIcon
            iconName="camera-01"
            className="absolute bottom-0 mx-auto flex h-32 w-36 place-content-center place-items-center rounded-full bg-slate-100 p-4"
            clicked={() => {
              setImageDragNDropModalVisibility(true)
            }}
          />
          {cancelImageButtonVisibility && (
            <ButtonIcon
              iconName="x"
              className="absolute right-0 top-0 ml-auto flex h-32 w-36 place-content-center place-items-center rounded-bl rounded-tr bg-slate-100 p-4"
              clicked={() => {
                setFormData((prev) => ({ ...prev, image: fallbackImgSrc }))
                setImageFile(null)
                setCancelImageButtonVisibility(false)
              }}
            />
          )}

          {/* // + Tertiary Category image modal with drag & drop  */}
          {imageDragNDropModalVisibility && (
            <ModalBlank
              modalSize="md"
              // showCrossButton={true}
              onCloseModal={() => {
                setImageDragNDropModalVisibility(false)
              }}
              onClickOutToClose
            >
              <FileDragDrop
                allowedFileTypes="image/png, image/jpeg, image/jpg image/webp"
                btnText="Upload Image"
                maxUploadFileNumber={1}
                maxUploadSize={10}
                getFiles={(files) => {
                  console.log("Image", files)

                  if (files.length > 0) {
                    const blob = new Blob([files[0]], {
                      type: files[0].type,
                    })
                    const newlyUploadedImageURL = URL.createObjectURL(blob)

                    // - update image src state with newly uploaded image url
                    setFormData((prev) => ({ ...prev, image: newlyUploadedImageURL }))
                    setImageFile(files[0])
                    // - hide  image modal
                    setImageDragNDropModalVisibility(false)
                    // - show cancel image button
                    setCancelImageButtonVisibility(true)
                  }
                }}
              />
            </ModalBlank>
          )}
        </div>
        <TextField
          label="Name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.data as string }))
          }}
          isRequired={true}
        />
        <TextArea
          label="Description"
          placeholder="Enter Description"
          value={formData.description ?? ""}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }}
          isRequired={true}
        />
        <TextField
          label="Quantity"
          placeholder="Enter quantity"
          value={formData.quantity}
          type="number"
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, quantity: e.data as number }))
          }}
          isRequired={true}
        />
        <div className="flex gap-12">
          <Button
            btnText={isUpdate ? "Update" : "Create"}
            fullWidth
            clicked={() => {
              if (isUpdate) {
                updateInventoryItemQuery.mutate(formData)
              } else {
                createInventoryItemQuery.mutate(formData)
              }
            }}
          />
        </div>
      </form>
    </ModalBlank>
  )
}

export default CreateUpdateInventoryItemModal
