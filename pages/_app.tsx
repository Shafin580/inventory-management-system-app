import type { AppProps } from "next/app"
import "../app/styles/globals.scss"

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
