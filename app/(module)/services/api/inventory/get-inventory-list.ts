import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"

export interface InventoryListAPIProps {
  id: number
  name: string
  description: string
}

/**
 * Fetches the inventory list from API
 */
export const getInventoryList = async ({ token, userId }: { token: string; userId: number }) => {
  try {
    const { results, status_code } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.INVENTORY.LIST.root,
      token,
      "POST",
      JSON.stringify({ userId: userId })
    )

    if (status_code === 200) {
      return results as InventoryListAPIProps[]
    } else
      throw Error("Error fetching inventory list", {
        cause: status_code,
      })
  } catch (err) {
    console.error(err)
  }
}
