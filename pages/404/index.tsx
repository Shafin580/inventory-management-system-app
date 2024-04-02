import Image from "next/image"

/**
 * @description Content not found page
 * @author Emran
 * ([@emranffl](https://www.linkedin.com/in/emranffl/))
 */
const NotFound = () => {
  return (
    <>
      <title>404 | Resource Not Found</title>
      <main className="flex min-h-screen items-center bg-black px-20">
        <div className="container grid gap-20 xl:grid-cols-2">
          <div className="order-2 flex flex-col items-center justify-center space-y-8 sm:order-1">
            <h1 className="text-3xl text-white">Resource Not Found!</h1>
            <p className="max-w-3xl text-xl text-slate-200">
              The page or resource you&apos;re trying to access cannot be found. Unfortunately, the resource
              you&apos;re in pursuit of appears to be nonexistent. If you deem this to be in error or require
              guidance, please reach out to the administrator for help.
            </p>
            <button
              className="btn-secondary !my-40 rounded-md px-12 py-4"
              onClick={() => {
                window.history.go(-2)
              }}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col items-center sm:order-2">
            {/* <div className="neon">404</div> */}
            <div className="">
              <Image
                src="/img/error/404.svg"
                alt="not found"
                style={{
                  width: "350px",
                  height: "350px",
                }}
                width={350}
                height={350}
                priority
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default NotFound
