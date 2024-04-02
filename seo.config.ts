import { Metadata } from "next"

// @ts-ignore

const DESCRIPTION = `The Women's Climate Coalition in Bangladesh launched ${process.env.NEXT_PUBLIC_SITE_TITLE} website to initiate a collaboration, aimed at empowering women to play a leading role in climate action and sustainable development`
const TITLE = {
  /**
   * `title.template` can be used to add a prefix or a suffix
   * to title's defined in child route segments
   */
  template: `%s | ${(process.env.NEXT_PUBLIC_SITE_URL as string).replace("external/", "")}`,
  /**
   * `title.default` can be used to provide a fallback title
   * to child route segments that don't define a title
   */
  default: `${(process.env.NEXT_PUBLIC_SITE_URL as string).replace("external/", "")}`,
}

export const SITE_METADATA: Metadata = {
  category: "blog",
  description: DESCRIPTION,
  keywords: [
    "Women empowerment & development",
    "The Asia Foundation",
    "Women development & empowerment in Bangladesh",
    "TAF",
    "vulnerabilities women face due to climate change impacts",
  ],
  metadataBase: new URL((process.env.NEXT_PUBLIC_SITE_URL as string).replace("external/", "")),
  openGraph: {
    countryName: "Bangladesh",
    description: DESCRIPTION,
    locale: "en_US",
    siteName: (process.env.NEXT_PUBLIC_SITE_URL as string).replace("external/", ""),
    title: TITLE,
    type: "website",
    url: (process.env.NEXT_PUBLIC_SITE_URL as string).replace("external/", ""),
  },
  title: TITLE,
  twitter: {
    card: "summary_large_image",
    description: DESCRIPTION,
    title: TITLE,
  },
}
