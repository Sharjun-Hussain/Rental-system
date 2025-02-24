import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const ProductDetailsModal = ({
  isOpen,
  onClose,
  product,
  onAddToList,
}) => {
  const [duration, setDuration] = useState({
    value: 1,
    unit: "day",
  });

  const durationUnits = [
    { value: "minute", label: "Minutes" },
    { value: "hour", label: "Hours" },
    { value: "day", label: "Days" },
    { value: "week", label: "Weeks" },
    { value: "month", label: "Months" },
    { value: "year", label: "Years" },
  ];

  const handleAdd = () => {
    onAddToList({
      ...product,
      duration: duration.value,
      durationUnit: duration.unit,
    });
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src="/api/placeholder/400/400"
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.model}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Brand</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Stock</span>
                <Badge variant="outline">{product.stock} available</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Price</span>
                <span className="font-medium">${product.price}/day</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Rental Duration</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  value={duration.value}
                  onChange={(e) =>
                    setDuration((prev) => ({
                      ...prev,
                      value: parseInt(e.target.value),
                    }))
                  }
                  className="w-24"
                />
                <Select
                  value={duration.unit}
                  onValueChange={(value) =>
                    setDuration((prev) => ({ ...prev, unit: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durationUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleAdd}
              disabled={duration.value < 1}
            >
              Add to List
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
