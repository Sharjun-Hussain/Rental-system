import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const PricingModal = ({ product }) => {
  const [pricing, setPricing] = useState({
    minuteRate: product?.minuteRate || 0,
    hourRate: product?.hourRate || 0,
    dayRate: product?.dayRate || 0,
    weekRate: product?.weekRate || 0,
    monthRate: product?.monthRate || 0,
    yearRate: product?.yearRate || 0,
  });

  const handlePricingChange = (field, value) => {
    setPricing((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Assign Pricing - {product?.name}</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4 mb-4 p-4 bg-secondary rounded-lg">
          <span className="font-medium">Original Product Cost:</span>
          <span className="font-bold">
            Rs.{product?.originalCost.toLocaleString()}.00
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minuteRate">Per Minute Rate (Rs.)</Label>
            <Input
              id="minuteRate"
              type="number"
              value={pricing.minuteRate}
              onChange={(e) =>
                handlePricingChange("minuteRate", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourRate">Per Hour Rate (Rs.)</Label>
            <Input
              id="hourRate"
              type="number"
              value={pricing.hourRate}
              onChange={(e) => handlePricingChange("hourRate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dayRate">Per Day Rate (Rs.)</Label>
            <Input
              id="dayRate"
              type="number"
              value={pricing.dayRate}
              onChange={(e) => handlePricingChange("dayRate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weekRate">Per Week Rate (Rs.)</Label>
            <Input
              id="weekRate"
              type="number"
              value={pricing.weekRate}
              onChange={(e) => handlePricingChange("weekRate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthRate">Per Month Rate (Rs.)</Label>
            <Input
              id="monthRate"
              type="number"
              value={pricing.monthRate}
              onChange={(e) => handlePricingChange("monthRate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearRate">Per Year Rate (Rs.)</Label>
            <Input
              id="yearRate"
              type="number"
              value={pricing.yearRate}
              onChange={(e) => handlePricingChange("yearRate", e.target.value)}
            />
          </div>
        </div>

        <Button className="mt-4">Save Pricing</Button>
      </div>
    </DialogContent>
  );
};
