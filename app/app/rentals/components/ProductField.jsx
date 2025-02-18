import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export const ProductField = ({
  product,
  products,
  onRemove,
  onChange,
  showRemove,
}) => (
  <div className="flex gap-4 items-start">
    <Select
      className="flex-1"
      value={product.productId?.toString()}
      onValueChange={(value) => onChange(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select product" />
      </SelectTrigger>
      <SelectContent>
        {products.map((prod) => (
          <SelectItem key={prod.id} value={prod.id.toString()}>
            {prod.name} - ${prod.price}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {showRemove && (
      <Button
        variant="destructive"
        size="sm"
        onClick={onRemove}
        className="flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    )}
  </div>
);
