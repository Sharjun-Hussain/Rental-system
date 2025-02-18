"use client";
import React, { useState } from "react";
import { DiscountSection } from "./DiscountSection";
import { OrderSummaryItem } from "./OrderSummaryItem";

export const OrderSummarySection = ({
  products,
  selectedProducts,
  period,
  onQuantityChange,
}) => {
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = selectedProducts.reduce((sum, item) => {
    const product =
      products.find((p) => p.id === item.productId) || products[0];
    return sum + product.price * item.quantity * period;
  }, 0);

  const deposit = subtotal * 0.2; // 20% deposit
  const total = subtotal + deposit - discountAmount;

  const handleDiscountApply = (amount) => {
    setDiscountAmount(amount);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Order Summary</h3>
      <hr />
      <div className="flex flex-col gap-4">
        {selectedProducts.map((item, index) => (
          <OrderSummaryItem
            key={item.id}
            product={
              products.find((p) => p.id === item.productId) || products[0]
            }
            quantity={item.quantity}
            period={period}
            onUpdateQuantity={(quantity) => onQuantityChange(index, quantity)}
          />
        ))}
      </div>

      <div className="mt-4">
        <DiscountSection
          subtotal={subtotal}
          onApplyDiscount={handleDiscountApply}
        />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span>Security Deposit (20%)</span>
          <span>${deposit.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between font-medium">
          <span>Total Amount</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
