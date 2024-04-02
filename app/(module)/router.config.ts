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
    LIST: (inventoryId: string | number) => {
      return {home: `item/list/${inventoryId}`} as const
    },
    DYNAMIC: (id: string | number) => {
      return {home: `item/${id}`} as const
    }
  }
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
      return { root: `contacts/${id}` as const }
    },
    ADD: {
      root: `inventory/add` as const,
    },
    DELETE: (id: string | number) => {
      return { root: `inventory/delete/${id}` as const }
    },
    UPDATE: (id: number) => {
      return { root: `inventory/update/${id}` as const }
    },
  },
  INVENTORY_ITEM: {
    LIST: (inventoryId: string | number) => {
      return { root: `item/list/${inventoryId}` } as const
    },
    DETAILS: (id: string | number) => {
      return { root: `item/${id}` as const }
    },
    ADD: {
      root: `item/add` as const,
    },
    DELETE: (id: string | number) => {
      return { root: `item/delete/${id}` as const }
    },
    UPDATE: (id: number) => {
      return { root: `item/update/${id}` as const }
    },
  },
}
