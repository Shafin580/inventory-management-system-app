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
import Image from "next/image"
import Link from "next/link"
import ButtonIcon from "@library/ButtonIcon"
import variables from "@variables/variables.module.scss"
import StatusBadge from "@library/StatusBadge"
import { AppContext } from "@app-context"
import { getAPIResponse } from "@components/library/utils"
import { PATHS } from "router.config"
import { cn } from "tailwind-cn"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export interface ProductCardInterface {
  data: any
}

const ProductCard = memo(function ProductCard({
  data: any
}: ProductCardInterface) {

  const router = useRouter()
  const queryClient = useQueryClient()
  const { token } = useContext(AppContext)


  const [imageSrc, setImageSrc] = useState()


  return (
    <div
      className={cn(
        "overflow- group min-h-min w-full border-b border-slate-200 bg-white hover:shadow dark:border-gray-700 dark:bg-gray-800", ""
      )}
    >
      
      <Link href={""} className="block h-full">
        <div className="relative inline-flex h-160 w-full overflow-hidden sm:h-[16rem]">
            <ButtonIcon
              iconName={"trash-01"}
              iconColor={"white"}
              className={`group-1 !absolute right-8 top-8 z-10 h-40 w-40 rounded-full bg-secondary/10 p-8 shadow-lg backdrop-blur-sm transition hover:bg-primary`}
              hoverClassName="[.group-1:hover_&]:stroke-white"
              iconClassName={"-top-2 relative"}
              clicked={() => {
                //
              }}
            />
            <ButtonIcon
              iconName={"edit-01"}
              iconColor={"white"}
              className={`group-1 !absolute left-8 top-8 z-10 h-40 w-40 rounded-full bg-secondary/10 p-8 shadow-lg backdrop-blur-sm transition hover:bg-primary`}
              hoverClassName="[.group-1:hover_&]:stroke-white"
              iconClassName={"-top-2 relative"}
              clicked={() => {
                //
              }}
            />

          {/* // + Image Component */}
          <Image
            unoptimized={true}
            src={""}
            alt={""}
            title={""}
            className={`object-cover object-center transition hover:opacity-80 group-hover:scale-105`}
            fill
            sizes="100vw"
            blurDataURL={`${process.env.blurDataURL}`}
            onClick={() => {}}
            placeholder="blur"
          />
        </div>
        {/* // + Product Title */}
        <div className="space-y-4 p-12">

          <div className="flex flex-col justify-between">
            <div className="top-info">
              <div className="grid grid-cols-12 items-center">
                <h6 className="col-span-11 line-clamp-2 leading-6 dark:text-white">{"Product Name"}</h6>
              </div>

                <p className="text-xs mt-6 text-slate-700">
                  Avbl. Units: <span className="font-medium">{200}</span>
                </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
})

export default ProductCard
