import { decrypt } from "../../utils/helpers/crypto"

/**
 * List of all the routes in the app for frontend rendering
 */
export const LINKS = {
  HOME: "/" as const,
  REGISTER: "/register" as const,
  INVENTORY: {
    LIST: { home: `/inventory/list` as const },
    DYNAMIC: (id: string | number) => {
      return { home: `/inventory/${id}` as const }
    },
  },
  INVENTORY_ITEM: {
    DYNAMIC: ({ id }: { id: string | number }) => {
      return { home: `inventory-item/${id}` } as const
    },
  },
} as const

/**
 * List of all the paths in the app for backend data fetching
 */

export const PATHS = {
  LOGIN: { root: `auth/login` as const },
  REGISTER: { root: `auth/register` as const },
  INVENTORY: {
    LIST: {
      root: `inventory/list` as const,
    },
    DETAILS: (id: string | number) => {
      return { root: `inventory/${id}` as const }
    },
    ADD: {
      root: `inventory/add` as const,
    },
    DELETE: { root: `inventory/delete` as const },

    UPDATE: { root: `inventory/update` as const },
  },
  INVENTORY_ITEM: {
    LIST: { root: `item/list` } as const,
    DETAILS: { root: `item-detail` as const },
    ADD: {
      root: `item/add` as const,
    },
    DELETE: { root: `item/delete` as const },
    UPDATE: { root: `item/update` as const },
  },
}
