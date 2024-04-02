import { Metadata } from "next"
import InventoryItemList from "./InventoryItemList.Client"

/**
 * * Metadata for current page
 */
const TITLE = {
  absolute: `${process.env.NEXT_PUBLIC_SITE_URL} | Inventory Item List`,
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

export default async function Page({ params: { id } }: { params: { id: string } }) {

  return (
    <section className="container my-32">
      <InventoryItemList id={id} />
    </section>
  )
}
