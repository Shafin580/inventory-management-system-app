import { Metadata } from "next"
import InventoryItem from "./InventoryItem.Client"

/**
 * * Metadata for current page
 */
const TITLE = {
  absolute: `${process.env.NEXT_PUBLIC_SITE_URL} | Inventory Item Details`,
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
    canonical: `/inventory-item`,
    languages: {
      "en-US": `/en-US/inventory-item`,
    },
  },
}

export default async function Page({ params: { itemId } }: { params: { itemId: string } }) {

  return (
    <section className="container my-32">
      <InventoryItem id={itemId} />
    </section>
  )
}
