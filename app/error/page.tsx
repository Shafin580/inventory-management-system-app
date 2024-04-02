"use client"

import Image from "next/image"
import ERROR_MAPPER from "./error-mapper.json"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * @description Generic error response page
 * @author Emran
 * ([@emranffl](https://www.linkedin.com/in/emranffl/))
 */
const GenericErrorResponse = () => {
  const FALLBACK_IMAGE = "/img/error/500.svg"
  const searchParams = useSearchParams()
  const code = Number(searchParams?.get("code")) ?? 500
  const [errorObject, setErrorObject] = useState<(typeof ERROR_MAPPER)[keyof typeof ERROR_MAPPER] | null>(
    null
  )
  const [errorImage, setErrorImage] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isNaN(code)) {
      setErrorObject(ERROR_MAPPER[code as unknown as keyof typeof ERROR_MAPPER])
      setErrorImage(ERROR_MAPPER[code as unknown as keyof typeof ERROR_MAPPER].image)
    }
  }, [])

  return (
    <>
      <title>{errorObject?.title ?? "Error"}</title>
      <main className="flex min-h-screen items-center bg-black px-20">
        <div className="container grid gap-20 xl:grid-cols-2">
          <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-3xl text-white">{errorObject?.heading ?? "Error"}</h1>
            <p className="max-w-3xl text-xl text-slate-200">
              {errorObject?.description ?? "An error has occurred. Please try again later."}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="neon">{Number.isNaN(code) ? 500 : code}</div>
            <div className="">
              <Image
                src={errorImage ?? FALLBACK_IMAGE}
                alt="error"
                style={{
                  width: "350px",
                  height: "350px",
                }}
                width={350}
                height={350}
                onError={(e) => {
                  console.error(e)

                  // if error image is not found, fallback to default error image
                  setErrorImage(FALLBACK_IMAGE)
                }}
                priority
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default GenericErrorResponse
