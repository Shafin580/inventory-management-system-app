"use client"

import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "app/(module)/query.config"
import {
  getInventoryItemList,
  InventoryItemListAPIProps,
} from "app/(module)/services/api/inventory-item/get-inventory-item-list"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "app/App.Context"
import Button from "app/components/global/Button"
import ProductCard from "app/(module)/inventory-item/Components/ProductCard"
import CreateUpdateInventoryItemModal from "app/(module)/inventory-item/Components/CreateUpdateInventoryItemModal.Client"

const InventoryItemList = ({ id }: { id: string }) => {
  const { token, userInfo } = useContext(AppContext)
  const [inventoryItemList, setInventoryItemList] = useState<InventoryItemListAPIProps[]>([])

  const [showCreateModal, setShowCreateModal] = useState(false)

  // + Query Function To Get Inventory Item List
  const { data: inventoryItemListQuery } = useQuery({
    queryKey: [QUERY_KEYS.INVENTORY_ITEM.LIST(id).key, token, userInfo?.id],
    queryFn: async () => {
      const results = await getInventoryItemList({
        token: token!,
        inventoryId: id,
        userId: userInfo?.id ?? 0,
      })
      return results
    },
    enabled: token != null && userInfo != null,
  })

  useEffect(() => {
    if (inventoryItemListQuery) {
      setInventoryItemList(inventoryItemListQuery)
    }
  }, [inventoryItemListQuery])
  return (
    <>
      <div className="my-32 text-center">
        <h3 className="my-5 text-primary">Inventory Item List</h3>
        <Button
          btnText="Create"
          clicked={() => {
            setShowCreateModal(true)
          }}
          size="md"
        />
      </div>
      <div className="grid grid-cols-2 gap-x-20 gap-y-64 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {inventoryItemList.map((data, index) => {
          return <ProductCard key={index} data={data} />
        })}
      </div>

      {showCreateModal && (
        <CreateUpdateInventoryItemModal
          isUpdate={false}
          onConfirm={(e) => {
            setShowCreateModal(e)
          }}
          onClose={(e) => setShowCreateModal(e)}
          inventoryId={Number(id)}
        />
      )}
    </>
  )
}

export default InventoryItemList
