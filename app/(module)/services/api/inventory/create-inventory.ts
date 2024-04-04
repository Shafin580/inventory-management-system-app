import { getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"

interface CreateUpdateInventoryParams {
  id?: number
  name: string
  description: string | null
  userId?: number
}

export interface CreateUpdateInventoryAPIProps {
  data: CreateUpdateInventoryParams
  token: string
}

/**
 * Creates a new Inventory
 */
export const createInventory = async ({ data, token }: CreateUpdateInventoryAPIProps) => {
  try {
    const { status_code, message } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.INVENTORY.ADD.root,
      token,
      "POST",
      JSON.stringify(data)
    )

    if (status_code < 201 || status_code >= 400) {
      return { status_code, message }
    }

    return { status_code, message }
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
