"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import { useState } from "react"

export default function TanStackQueryProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000 * 2,
          },
        },
      })
  )
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryStreamedHydration> */}
      {children}
      {process.env.NODE_ENV !== "production" ? <ReactQueryDevtools initialIsOpen={false} /> : <></>}
      {/* </ReactQueryStreamedHydration> */}
    </QueryClientProvider>
  )
}
