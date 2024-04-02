"use client"

import React, { memo, useContext, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AppContext } from "@app-context"
import TextTruncate from "react-text-truncate"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import Button from "app/components/global/Button"

export interface ProductCardInterface {
  productName?: string
  desc?: string
}

const ProductDetailCard = memo(function ProductDetailCard({
  productName = "Men's Polo Shirt",
  desc = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident iure culpa error, rerum quos non maxime beatae	laboriosam, quaerat unde tempora! Dolor quod explicabo dolorum? Quae, natus, qui laborum reprehenderit omnis excepturi enim,	architecto ipsam adipisci dicta a. Illum facilis praesentium consectetur repudiandae dolorum itaque, quas eos cum quaerat	ad.",
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
              src={""}
              alt={productName}
              title={productName}
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
            <h4 className="leading-tight" title={productName}>
              <TextTruncate text={productName} line={3} />
            </h4>
            {/* //- Description */}
            {fullDescriptionPreview ? (
              <p className="leading-7">{desc}</p>
            ) : (
              <TextTruncate
                text={desc}
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
              <p className="text-xl font-bold text-slate-800">{500}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})
export default ProductDetailCard
