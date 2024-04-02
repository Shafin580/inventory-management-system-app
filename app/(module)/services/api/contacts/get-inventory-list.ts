import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"

export interface InventoryListAPIProps {
  id: number
  name: string
  email: string
  phone_number: string | null
  address: string | null
}

/**
 * Fetches the inventory list from API
 */
export const getInventoryList = async (token: string) => {
  try {
    const { results, status_code } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.INVENTORY.LIST.root,
      token,
      "GET"
    )

    if (status_code === 200) {
      return results as InventoryListAPIProps[]
    } else
      throw Error("Error fetching inventory list", {
        cause: status_code,
      })
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
