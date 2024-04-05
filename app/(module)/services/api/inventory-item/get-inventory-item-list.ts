import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"

export interface InventoryItemListAPIProps {
  id: number
  inventoryId: number
  name: string
  description: string | null
  quantity: number
  image: string
}

/**
 * Fetches the inventory item list from API
 */
export const getInventoryItemList = async ({ token, userId, inventoryId }: { token: string; userId: number; inventoryId: number | string }) => {
  try {
    const { results, status_code } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.INVENTORY_ITEM.LIST.root,
      token,
      "POST",
      JSON.stringify({ userId: userId, inventoryId: inventoryId })
    )

    if (status_code === 200) {
      return results as InventoryItemListAPIProps[]
    } else
      throw Error("Error fetching inventory item list", {
        cause: status_code,
      })
  } catch (err) {
    console.error(err)
  }
}
