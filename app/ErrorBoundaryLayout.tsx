"use client"

import { ErrorBoundary } from "react-error-boundary"
import GlobalError from "./global-error"

export default function ErrorBoundaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, info) => {
        console.error("Layout partial ErrorBoundary -> ", error, info)
      }}
      fallback={<GlobalError reset={() => window.location.reload()} />}
    >
      {children}
    </ErrorBoundary>
  )
}
