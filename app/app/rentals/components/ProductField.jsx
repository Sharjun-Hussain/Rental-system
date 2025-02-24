import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Single Product Search Field Component
export const ProductSearchField = ({ products, onProductSelect }) => {
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (search) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.model.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsSearching(true);
    } else {
      setFilteredProducts([]);
      setIsSearching(false);
    }
  }, [search, products]);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products to add..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isSearching && (
            <Card className="absolute w-full mt-1 z-50">
              <CardContent className="p-1 max-h-64 overflow-y-auto">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer rounded-md flex items-center justify-between"
                    onClick={() => {
                      onProductSelect(p);
                      setSearch("");
                      setIsSearching(false);
                    }}
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-gray-500">{p.model}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        ${p.price}/day
                      </span>
                      <Badge variant="outline">{p.stock} in stock</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
