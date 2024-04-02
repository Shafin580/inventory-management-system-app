import { Metadata } from "next"
import { SITE_METADATA } from "seo.config"

export const metadata: Metadata = {
  ...SITE_METADATA,
  category: "portfolio",
  metadataBase: new URL((process.env.NEXT_PUBLIC_SITE_URL as string).replace("external/", "")),
}

export default function WebUILayout({ children }: { children: React.ReactNode }) {
  return <div className="app-wrapper">{children}</div>
}
