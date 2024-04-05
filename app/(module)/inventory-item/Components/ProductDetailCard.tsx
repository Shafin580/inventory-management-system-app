"use client"

import React, { memo, useContext, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AppContext } from "@app-context"
import TextTruncate from "react-text-truncate"
import { useQueryClient } from "@tanstack/react-query"
import Button from "app/components/global/Button"
import { InventoryItemListAPIProps } from "app/(module)/services/api/inventory-item/get-inventory-item-by-id"

export interface ProductCardInterface {
  data: InventoryItemListAPIProps | null
}

const ProductDetailCard = memo(function ProductDetailCard({
  data
}: ProductCardInterface) {
  const { token, userInfo } = useContext(AppContext)
  const router = useRouter()
  const queryClient = useQueryClient()

  // * description preview state
  const [fullDescriptionPreview, updateFullDescriptionPreview] = useState(false)

  return (
    <section className={`${"container"}`}>
      <div className="grid gap-20 lg:grid-cols-2 xl:gap-40 2xl:gap-64">
        <div className="left overflow-hidden">
          {/* //+ Main Image */}
          <div className="main-img-container">
            <Image
              unoptimized={true}
              src={data?.image ?? ""}
              alt={data?.name ?? ""}
              title={data?.name}
              width="1000"
              height="666"
              sizes="2"
              blurDataURL={`${process.env.blurDataURL}`}
              placeholder="blur"
              className="rounded-sm"
            />
          </div>
        </div>

        <div className="right space-y-40 pb-0 lg:pb-0">
          <div className="top-section space-y-12">
            {/* //- Product Title */}
            <h4 className="leading-tight" title={data?.name}>
              <TextTruncate text={data?.name} line={3} />
            </h4>
            {/* //- Description */}
            {fullDescriptionPreview ? (
              <p className="leading-7">{data?.description}</p>
            ) : (
              <TextTruncate
                text={data?.description ?? ""}
                line={3}
                element="p"
                containerClassName="leading-7 flex"
                textTruncateChild={
                  <Button
                    btnText="Read More"
                    variant="link"
                    className="py-0 ps-0"
                    size="sm"
                    clicked={() => {
                      updateFullDescriptionPreview(true)
                    }}
                  />
                }
              />
            )}
          </div>

          {/* //+ Pricing Information */}
          <div className="price flex gap-x-40">
            <div className="price-info-box text-left">
              <p className="text-xs text-slate-500">Quantity</p>
              <p className="text-xl font-bold text-slate-800">{data?.quantity}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})
export default ProductDetailCard
