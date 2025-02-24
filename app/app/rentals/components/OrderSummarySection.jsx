"use client";
import React, { useState } from "react";
import { DiscountSection } from "./DiscountSection";
import { OrderSummaryItem } from "./OrderSummaryItem";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export const OrderSummarySection = ({
  products,
  selectedProducts,
  onQuantityChange,
  onRemoveProduct,
}) => {
  const calculatePrice = (product, duration, durationUnit) => {
    const basePrice = product.price;
    let multiplier = 1;

    switch (durationUnit) {
      case "minute":
        multiplier = duration / (24 * 60);
        break;
      case "hour":
        multiplier = duration / 24;
        break;
      case "day":
        multiplier = duration;
        break;
      case "week":
        multiplier = duration * 7;
        break;
      case "month":
        multiplier = duration * 30;
        break;
      case "year":
        multiplier = duration * 365;
        break;
      default:
        multiplier = duration;
    }

    return basePrice * multiplier;
  };

  const totalPrice = selectedProducts.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return total;
    return (
      total +
      calculatePrice(product, item.duration, item.durationUnit) * item.quantity
    );
  }, 0);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Order Summary</h3>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {selectedProducts.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;

          const itemPrice = calculatePrice(
            product,
            item.duration,
            item.durationUnit
          );

          return (
            <Card key={item.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.duration} {item.durationUnit}(s)
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onRemoveProduct(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Quantity:</span>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="w-20"
                    />
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${(itemPrice * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${itemPrice.toFixed(2)} each
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="border-t pt-4 flex justify-between items-center">
        <span className="font-medium">Total Amount</span>
        <span className="text-lg font-semibold">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};
