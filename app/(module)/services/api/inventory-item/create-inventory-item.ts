import { convertObjectToFormData, getAPIResponse } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"

interface CreateUpdateInventoryItemParams {
  id?: number
  inventoryId: number
  name: string
  description: string | null
  quantity: number
  image: string | null | File
}

export interface CreateUpdateInventoryItemAPIProps {
  data: CreateUpdateInventoryItemParams
  token: string
}

/**
 * Creates a new Inventory Item
 */
export const createInventoryItem = async ({ data, token }: CreateUpdateInventoryItemAPIProps) => {
  try {
    const { status_code, message } = await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL!,
      PATHS.INVENTORY_ITEM.ADD.root,
      token,
      "POST",
      convertObjectToFormData(data)
    )

    if (status_code < 201 || status_code >= 400) {
      return { status_code: Number(status_code), message: String(message) }
    }

    return { status_code: Number(status_code), message: String(message) }
  } catch (err) {
    console.error(err)

    return { status_code: 500, message: "Server Error" } // tsq does not take undefine i.e. return undefined / return void / empty
  }
}
