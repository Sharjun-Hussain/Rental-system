import React, { useState } from "react";
import { Plus, Search, Calendar, X, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const RentalDialog = ({ isOpen, onClose, onSubmit }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [userSearchOpen, setUserSearchOpen] = useState(false);

  // Sample data - replace with your actual data source
  const products = [
    {
      id: 1,
      name: "Professional Camera",
      description: "High-end DSLR camera",
      price: 299.99,
      category: "Cameras",
      model: "Pro X1000",
      stock: 5,
      images: ["/api/placeholder/400/300"],
      brand: "PhotoPro",
      weight: "1.5kg",
      dimensions: { length: "15", width: "10", height: "8" },
    },
  ];

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];

  const handleSubmit = () => {
    onSubmit({
      user: selectedUser,
      products: selectedProducts,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Rental</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Customer Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer</label>
            <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedUser ? selectedUser.name : "Select customer..."}
                  <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search customers..." />
                  <CommandEmpty>No customer found.</CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => {
                          setSelectedUser(user);
                          setUserSearchOpen(false);
                        }}
                      >
                        {user.name}
                        <span className="ml-2 text-sm text-gray-500">
                          {user.email}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Product Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Products</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Product
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Search products..." />
                    <CommandEmpty>No products found.</CommandEmpty>
                    <CommandGroup>
                      {products.map((product) => (
                        <CommandItem
                          key={product.id}
                          onSelect={() =>
                            setSelectedProducts([
                              ...selectedProducts,
                              { ...product, rentalQuantity: 1 },
                            ])
                          }
                          className="flex items-center gap-2"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div>
                            <div>{product.name}</div>
                            <div className="text-sm text-gray-500">
                              ${product.price} - Stock: {product.stock}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Selected Products */}
            {selectedProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{product.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedProducts(
                              selectedProducts.filter(
                                (p) => p.id !== product.id
                              )
                            )
                          }
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-sm">Quantity:</label>
                          <Input
                            type="number"
                            value={product.rentalQuantity}
                            onChange={(e) => {
                              const newProducts = selectedProducts.map((p) =>
                                p.id === product.id
                                  ? {
                                      ...p,
                                      rentalQuantity: parseInt(e.target.value),
                                    }
                                  : p
                              );
                              setSelectedProducts(newProducts);
                            }}
                            min="1"
                            max={product.stock}
                            className="w-20"
                          />
                        </div>
                        <div className="text-sm">
                          Price: $
                          {(product.price * product.rentalQuantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input id="startDate" type="date" className="pl-8" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input id="endDate" type="date" className="pl-8" />
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full mt-4">
            Create Rental
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
