import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"
import { CreateUpdateInventoryAPIProps } from "./create-inventory"

/**
 * Update Inventory
 */
export const updateInventory = async ({ data, token }: CreateUpdateInventoryAPIProps) => {
  try {
    const { status_code, message } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.INVENTORY.UPDATE(data.id ?? 0).root,
      token,
      "PUT",
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
