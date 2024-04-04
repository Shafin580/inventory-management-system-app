"use client"

import { tableURLWithParams } from "@utils/helpers/misc"
import { LINKS, PATHS } from "app/(module)/router.config"
import { AppContext } from "app/App.Context"
import ButtonIcon from "app/components/global/ButtonIcon"
import TablePagy from "app/components/table/TablePagy"
import { useContext, useEffect, useState } from "react"
import ContactCreateUpdateModal from "./Components/InventoryCreateUpdateModal"
import InventoryDeleteModal from "./Components/InventoryDeleteModal"
import { QUERY_KEYS } from "app/(module)/query.config"
import Button from "app/components/global/Button"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getInventoryList, InventoryListAPIProps } from "app/(module)/services/api/inventory/get-inventory-list"

const InventoryList = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [selectedData, setSelectedData] = useState<InventoryListAPIProps | null>(null)

  const { token, userInfo } = useContext(AppContext)
  const router = useRouter()

  const [inventoryList, setInventoryList] = useState<InventoryListAPIProps[]>([])

  // Function Query To Get Inventory List
  const {data: inventoryListQuery} = useQuery({
    queryKey: [QUERY_KEYS.INVENTORY.LIST.key, token, userInfo?.id],
    queryFn: async () => {
      const results = await getInventoryList({token: token!, userId: userInfo?.id ?? 0})
      return results
    },
    enabled: token != null && userInfo != null
  })

  useEffect(() => {
    if(inventoryListQuery){
      setInventoryList(inventoryListQuery)
    }
  }, [inventoryListQuery])

  return (
    <div className="container">
      <h3 className="text-center text-primary">Contact List</h3>
      <Button
        btnText="Add New Contact"
        variant="primary"
        clicked={() => {
          setShowCreateModal(true)
        }}
      />
      {token != null && (
        <TablePagy
          // onRowClick={(e) => {
          //   viewPost(e.original.id);
          // }}
          rawData={inventoryList}
          startName="pageNo"
          sizeName="pageSize"
          totalRowName="totalRows"
          pageSize={30}
          rowPerPageOptions={[30, 40, 50]}
          queryParameters={{ queryKey: [QUERY_KEYS.INVENTORY.LIST.key] }}
          columnHeadersLabel={[
            {
              accessorKey: "name",
              header: "Name",
            },
            {
              accessorKey: "description",
              header: "Description",
            },
            {
              id: "_actions",
              header: "Action",
              columnDefType: "display",
              Cell: ({ row }) => (
                <div className="flex flex-row space-x-6">
                  <ButtonIcon
                    clicked={() => {
                      router.push(LINKS.INVENTORY_ITEM.LIST(row.original.id).home)
                    }}
                    className="mx-auto"
                    iconName="eye"
                  />

                  <ButtonIcon
                    clicked={() => {
                      setSelectedData(row.original as InventoryListAPIProps)
                      setShowUpdateModal(true)
                      console.log("Selected Data", row.original)
                    }}
                    className="mx-auto"
                    iconName="edit-01"
                  />

                  <ButtonIcon
                    clicked={() => {
                      setSelectedData(row.original as InventoryListAPIProps)
                      setShowDeleteModal(true)
                      console.log("Selected Data", row.original)
                    }}
                    className="mx-auto"
                    iconName="trash-01"
                  />
                </div>
              ),
            },
          ]}
        />
      )}

      {showCreateModal && (
        <ContactCreateUpdateModal
          isUpdate={false}
          onClose={(e) => {
            setShowCreateModal(e)
          }}
          onConfirm={(e) => {
            setShowCreateModal(e)
          }}
        />
      )}

      {showUpdateModal && selectedData != null && (
        <ContactCreateUpdateModal
          isUpdate={true}
          onClose={(e) => {
            setShowCreateModal(e)
          }}
          onConfirm={(e) => {
            setShowCreateModal(e)
          }}
          apiData={selectedData}
        />
      )}

      {showDeleteModal && selectedData != null && token != null && (
        <InventoryDeleteModal
          inventoryId={selectedData.id}
          onCloseModal={(e) => {
            setShowUpdateModal(e)
          }}
          token={token}
        />
      )}
    </div>
  )
}

export default InventoryList
