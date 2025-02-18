"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import React, { useState } from "react";

export const DiscountSection = ({ subtotal, onApplyDiscount }) => {
  const [discountCode, setDiscountCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyDiscount = () => {
    // Mock discount codes - in real app, this would be validated against an API
    const discounts = {
      WELCOME10: 0.1, // 10% off
      SUMMER20: 0.2, // 20% off
      SPECIAL25: 0.25, // 25% off
    };

    if (discounts[discountCode]) {
      const amount = subtotal * discounts[discountCode];
      setDiscountAmount(amount);
      setIsApplied(true);
      onApplyDiscount(amount);
    } else {
      setIsApplied(false);
      setDiscountAmount(0);
      onApplyDiscount(0);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Enter discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
          className="uppercase"
        />
        <Button
          variant="outline"
          onClick={handleApplyDiscount}
          disabled={!discountCode || isApplied}
        >
          Apply
        </Button>
      </div>
      {isApplied && (
        <Alert className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Discount applied: -${discountAmount.toFixed(2)}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
