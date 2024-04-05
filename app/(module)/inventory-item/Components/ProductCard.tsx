/**
 * @name ProductCard
 * @description
 * *Company - ARITS Ltd. 8th Feb 2023.
 * This component is used to render a card.
 * The card can be used to display an image, title, body and a button.
 * The card can be used to link to another page.
 * @param {string} linkURL - URL to be used when the card is clicked
 * @param {string} src - URL of the image to be displayed
 * @param {string} title - Text to be displayed as the title
 * @param {string} body - Text to be displayed as the body
 * @param {Function} buttonOnClick - When the card body button is clicked this function will triggered
 */

"use client"
import { memo, useContext, useEffect, useState } from "react"
import Link from "next/link"
import variables from "@variables/variables.module.scss"
import { AppContext } from "@app-context"
import { cn } from "tailwind-cn"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import ButtonIcon from "app/components/global/ButtonIcon"
import { InventoryItemListAPIProps } from "app/(module)/services/api/inventory-item/get-inventory-item-list"
import { LINKS } from "app/(module)/router.config"
import CreateUpdateInventoryItemModal from "./CreateUpdateInventoryItemModal.Client"
import InventoryItemDeleteModal from "./InventoryItemDeleteModal"

export interface ProductCardInterface {
  data: InventoryItemListAPIProps
}

const ProductCard = memo(function ProductCard({ data }: ProductCardInterface) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { token } = useContext(AppContext)

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <div
      className={cn(
        "overflow- group min-h-min w-full border-b border-slate-200 bg-white hover:shadow dark:border-gray-700 dark:bg-gray-800",
        ""
      )}
    >
      <div className="block h-full">
        <div className="relative inline-flex h-160 w-full overflow-hidden sm:h-[16rem]">
          <ButtonIcon
            iconName={"trash-01"}
            iconColor={"white"}
            className={`group-1 !absolute right-8 top-8 z-10 h-40 w-40 rounded-full bg-secondary/10 p-8 shadow-lg backdrop-blur-sm transition hover:bg-primary`}
            hoverClassName="[.group-1:hover_&]:stroke-white"
            iconClassName={"-top-2 relative"}
            clicked={() => {
              setShowDeleteModal(true)
            }}
          />
          <ButtonIcon
            iconName={"edit-01"}
            iconColor={"white"}
            className={`group-1 !absolute left-8 top-8 z-10 h-40 w-40 rounded-full bg-secondary/10 p-8 shadow-lg backdrop-blur-sm transition hover:bg-primary`}
            hoverClassName="[.group-1:hover_&]:stroke-white"
            iconClassName={"-top-2 relative"}
            clicked={() => {
              setShowUpdateModal(true)
            }}
          />

          {/* // + Image Component */}
          <img
            src={data.image}
            alt={data.name}
            title={data.name}
            className={`object-cover object-center transition hover:opacity-80 group-hover:scale-105`}
            sizes="100vw"
          />
        </div>
        {/* // + Product Title */}
        <div className="space-y-4 p-12">
          <div className="flex flex-col justify-between">
            <div className="top-info">
              <div className="flex flex-col items-center">
                <h6 className="col-span-11 line-clamp-2 leading-6 dark:text-white">{data.name}</h6>
                <p>{data.description}</p>
              </div>

              <p className="mt-6 text-xs text-slate-700">
                Quantity: <span className="font-medium">{data.quantity}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showUpdateModal && (
        <CreateUpdateInventoryItemModal
          apiData={data}
          isUpdate={true}
          onConfirm={(e) => {
            setShowUpdateModal(e)
          }}
          onClose={(e) => setShowUpdateModal(e)}
          inventoryId={data.inventoryId}
        />
      )}

      {showDeleteModal && (
        <InventoryItemDeleteModal
          inventoryId={data.inventoryId}
          itemId={data.id}
          token={token!}
          onCloseModal={(e) => {
            setShowDeleteModal(e)
          }}
        />
      )}
    </div>
  )
})

export default ProductCard
