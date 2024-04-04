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
 * Fetches the inventory item Details from API
 */
export const getInventoryItemDetails = async ({ id, token, userId }: { id: string | number; token: string, userId: number }) => {
  try {
    const { results, status_code } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.INVENTORY_ITEM.DETAILS(id).root,
      token,
      "POST",
      JSON.stringify({userId: userId})
    )

    if (status_code === 200) {
      return results as InventoryItemListAPIProps
    } else
      throw Error("Error fetching inventory item details", {
        cause: status_code,
      })
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
