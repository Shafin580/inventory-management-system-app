import { Metadata } from "next"
import Register from "./Register.client"

/**
 * * Metadata for current page
 */
const TITLE = {
  absolute: `${(process.env.NEXT_PUBLIC_SITE_URL as string).replace("external/", "")} | register`,
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
    canonical: `/register`,
    languages: {
      "en-US": `/en-US/register`,
    },
  },
}

export default async function Page() {

  return (
    <Register />
  )
}
