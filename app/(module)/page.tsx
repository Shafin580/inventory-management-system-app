import LoginForm from "app/components/global/Form/Auth/LoginForm.Client"
import { Metadata } from "next"

/**
 * * Metadata for current page
 */
const TITLE = {
  absolute: `${(process.env.NEXT_PUBLIC_SITE_URL as string).replace("external/", "")} | Home`,
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
    canonical: ``,
    languages: {
      "en-US": `/en-US`,
    },
  },
}

export default function Home() {

  return (
    <main className="min-h-screen">
      <div className="flex flex-col">
        <LoginForm />
      </div>
    </main>
  )
}
