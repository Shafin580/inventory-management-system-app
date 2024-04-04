import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"
import { CreateUpdateInventoryItemAPIProps } from "./create-inventory-item"

/**
 * Update Inventory Item
 */
export const updateInventory = async ({ data, token }: CreateUpdateInventoryItemAPIProps) => {
  try {
    const { status_code, message } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.INVENTORY.UPDATE(data.id ?? 0).root,
      token,
      "POST",
      JSON.stringify(data)
    )

    if (status_code < 200 || status_code >= 400) {
      return { status_code, message }
    }

    return { status_code, message }
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
