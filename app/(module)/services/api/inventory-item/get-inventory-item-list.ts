import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"

export interface InventoryItemListAPIProps {
  id: number
  name: string
  email: string
  phone_number: string | null
  address: string | null
}

/**
 * Fetches the inventory item list from API
 */
export const getInventoryItemList = async ({ token, userId, inventoryId }: { token: string; userId: number; inventoryId: number }) => {
  try {
    const { results, status_code } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.INVENTORY_ITEM.LIST(inventoryId).root,
      token,
      "POST",
      JSON.stringify({ userId: userId })
    )

    if (status_code === 200) {
      return results as InventoryItemListAPIProps[]
    } else
      throw Error("Error fetching inventory item list", {
        cause: status_code,
      })
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
