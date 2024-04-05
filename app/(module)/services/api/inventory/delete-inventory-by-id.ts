import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"

/**
 * delete inventory
 */
export const deleteInventory = async ({ id, token }: { id: string | number; token: string }) => {
  try {
    const { results, status_code, message } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.INVENTORY.DELETE.root,
      token,
      "POST",
      JSON.stringify({inventoryId: id})
    )

    if (status_code === 200) {
      return { status_code: status_code, message: message }
    } else {
      return { status_code: status_code, message: "Failed to delete Inventory!" }
    }
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
