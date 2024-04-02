/**
 * List of all the Graph Queries in the app for backend data fetching
 */

export const QUERY_KEYS = {
  INVENTORY: {
    LIST: { key: "inventory-list" as const },
    DYNAMIC: (id: number | string) => {
      return { key: `inventory-details-${id}` as const }
    },
  },
  INVENTORY_ITEM: {
    LIST: (inventoryId: string | number) => {
      return { key: `item-list-${inventoryId}` } as const
    },
    DYNAMIC: (id: number | string) => {
      return { key: `item-details-${id}` as const }
    },
  },
} as const
