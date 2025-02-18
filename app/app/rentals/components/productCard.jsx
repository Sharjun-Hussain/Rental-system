import React from "react";

const ProductCard = () => {
  return (
    <div className="flex gap-3   justify-between">
      <div className="flex  gap-3">
        <div className="w-16 h-16 rounded-lg bg-green-600" />
        <div className="flex flex-col">
          <div>Profess</div>
          <div className="text-xs">Sony Smart</div>
          <div className="text-sm text-gray-400">Rs. 100,000</div>
        </div>
      </div>
      <div className="items-center justify-center flex ">
        <div className="flex gap-2">
          <button className=" bg-green-400/20 dark:bg-white/20 dark:hover:bg-white/40 hover:bg-green-500/40 active:bg-green-300 text-xl rounded-full h-7 w-7">
            -
          </button>
          <div>1</div>
          <button className=" bg-green-400/20 dark:bg-white/20 dark:hover:bg-white/40 hover:bg-green-500/40 active:bg-green-300 text-xl rounded-full h-7 w-7">
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
