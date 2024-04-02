import "./styles/globals.scss"
import { Noto_Sans } from "next/font/google"
import { AppContextProvider } from "./App.Context"
import { Suspense } from "react"
import Loading from "./loading"
import { ErrorBoundary } from "react-error-boundary"
import Custom404 from "./not-found"
import TanStackQueryProviders from "../utils/providers/TanStackQuery.Provider"
import ErrorBoundaryLayout from "./ErrorBoundaryLayout"
import ServiceWorkerRegistration from "./ServiceWorkerRegistration"
import { cn } from "@utils/shadcn"
import { ThemeProvider } from "@utils/providers/Theme.Provider"

const noto = Noto_Sans({
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-noto",
  subsets: ["latin-ext"],
})

// const zilla = Zilla_Slab({
//   weight: ["300", "400", "700"],
//   display: "swap",
//   variable: "--font-zilla-slab",
//   subsets: ["latin-ext"],
// })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en_US" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/site.webmanifest"></link>
      </head>
      <body
        className={cn("light min-w-screen flex min-h-screen flex-col", noto.className)}
        suppressHydrationWarning={true}
      >
        {/* <ServiceWorkerRegistration /> */}
        <ErrorBoundary fallback={<Custom404 />}>
          <Suspense fallback={<Loading />}>
            <ErrorBoundaryLayout>
              <TanStackQueryProviders>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                  <AppContextProvider>{children}</AppContextProvider>
                </ThemeProvider>
              </TanStackQueryProviders>
            </ErrorBoundaryLayout>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
