import Spinner from "./components/global/Spinner"

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="fixed left-0 top-0 z-[1000] flex h-full w-[100%] items-center justify-center bg-slate-200 bg-opacity-50">
      <Spinner spinnerText="Loading" />
    </div>
  )
}
