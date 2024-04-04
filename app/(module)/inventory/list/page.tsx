import { Metadata } from "next"
import InventoryList from "./InventoryList.Client"

/**
 * * Metadata for current page
 */
const TITLE = {
  absolute: `${process.env.NEXT_PUBLIC_SITE_URL} | Inventory List`,
}
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
  },
  twitter: {
    title: TITLE,
  },
  alternates: {
    canonical: `/inventory`,
    languages: {
      "en-US": `/en-US/inventory`,
    },
  },
}

export default async function Page() {

  return (
    <InventoryList />
  )
}
