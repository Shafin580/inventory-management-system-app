"use client"

import { useContext, useEffect, useState } from "react"
import { AppContext } from "app/App.Context"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "app/(module)/query.config"
import { getInventoryItemDetails, InventoryItemListAPIProps } from "app/(module)/services/api/inventory-item/get-inventory-item-by-id"
import ProductDetailCard from "../Components/ProductDetailCard"

const InventoryItem = ({ id }: { id: string }) => {

  const {token, userInfo} = useContext(AppContext)
  const [inventoryItemDetail, setInventoryItemDetail] = useState<InventoryItemListAPIProps | null>(null)

  const {data: inventoryItemDetailQuery} = useQuery({
    queryKey: [QUERY_KEYS.INVENTORY_ITEM.DYNAMIC(id).key, token, userInfo?.id],
    queryFn: async () => {
      const result = await getInventoryItemDetails({token: token!, id: id, userId: userInfo?.id ?? 0})
      return result
    },
    enabled: token != null && userInfo != null
  })

  useEffect(() => {
    if(inventoryItemDetailQuery){
      setInventoryItemDetail(inventoryItemDetailQuery)
    }
  }, [inventoryItemDetailQuery])

  return <ProductDetailCard data={inventoryItemDetail} />
}

export default InventoryItem
