"use client"

import ProductCard from "../Components/ProductCard"

const InventoryItemList = ({ id }: { id: string }) => {
  return (
    <>
    <h4 className="mb-10">Inventory Item List</h4>
      <div className="grid grid-cols-2 gap-x-20 gap-y-64 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        <ProductCard data={{}} />
        <ProductCard data={{}} />
        <ProductCard data={{}} />
        <ProductCard data={{}} />
        <ProductCard data={{}} />
        <ProductCard data={{}} />
        <ProductCard data={{}} />
        <ProductCard data={{}} />
        <ProductCard data={{}} />
      </div>
    </>
  )
}

export default InventoryItemList
