import { Button } from "@/components/ui/button";
import React from "react";

export const OrderSummaryItem = ({
  product,
  quantity,
  onUpdateQuantity,
  period,
}) => {
  const dailyRate = product.price;
  const totalPrice = dailyRate * quantity * period;

  return (
    <div className="flex gap-3 justify-between">
      <div className="flex gap-3">
        <div className="w-16 h-16 rounded-lg bg-green-600" />
        <div className="flex flex-col">
          <div>{product.name}</div>
          <div className="text-xs">{product.brand}</div>
          <div className="text-sm text-gray-400">
            ${dailyRate}/day × {quantity} × {period} days
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-medium">${totalPrice.toFixed(2)}</div>
        <div className="flex gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 rounded-full bg-green-400/20 hover:bg-green-500/40"
            onClick={() => onUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="flex items-center">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 rounded-full bg-green-400/20 hover:bg-green-500/40"
            onClick={() => onUpdateQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};
