import Image from "next/image"

/**
 * @description Server error page
 * @author Emran
 * ([@emranffl](https://www.linkedin.com/in/emranffl/))
 */
const ServerError = ({ reset }: { reset: () => void }) => {
  return (
    <>
      <title>500 | Internal Server Error</title>
      <main className="flex min-h-screen items-center bg-black px-20">
        <div className="container grid gap-20 xl:grid-cols-2">
          <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-3xl text-white">Internal Server Error!</h1>
            <p className="max-w-3xl text-xl text-slate-200">
              We encountered an unexpected issue while processing your request. Our team has been notified
              about this problem and will work to resolve it as soon as possible. We apologize for any
              inconvenience this may have caused. If you need further assistance, please don&apos;t hesitate
              to contact our support team.
            </p>
            <div className="space-x-8">
              <button
                className="btn-primary !my-40 rounded-md px-12 py-4"
                onClick={() => {
                  history.go(-2)
                  setTimeout(() => {
                    location.reload()
                  }, 700)
                }}
              >
                Go Back
              </button>
              {reset && (
                <button className="btn-warning !my-40 rounded-md px-12 py-4" onClick={() => reset()}>
                  Try Again
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="neon">500</div>
            <div className="">
              <Image
                src="/img/error/500.svg"
                alt="server error"
                style={{
                  width: "350px",
                  height: "350px",
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

export default ServerError
