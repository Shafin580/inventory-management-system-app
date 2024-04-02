"use client"

import ServerError from "pages/500"

export default function GlobalError({ reset }: { reset: () => void }) {
  return <ServerError reset={reset} />
}
