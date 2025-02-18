import React, { useState, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UserInfo } from "./components/UserInfo";
import { OrderSummarySection } from "./components/OrderSummarySection";
import { RentalHistoryItem } from "./components/RentalHistoryItem";
import { ProductField } from "./components/ProductField";
import { DateField } from "./components/DateField";

export const RentalDialog = ({ isOpen, onClose, onSubmit }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [ClickedUser, setClickedUser] = useState("");
  const [filteredUsers, setfilteredUsers] = useState([]);
  const [Item, setItem] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([
    // { id: 1, quantity: 1 },
  ]);
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
  });
  const [search, setSearch] = useState("");
  // Sample data
  const products = [
    {
      id: 1,
      name: "Professional Camera",
      description: "High-end DSLR camera",
      price: 99.99,
      category: "Cameras",
      model: "Pro X1000",
      stock: 5,
      brand: "PhotoPro",
    },
    {
      id: 2,
      name: "Drone",
      description: "Professional drone with 4K camera",
      price: 149.99,
      category: "Drones",
      model: "Sky X1",
      stock: 3,
      brand: "DronePro",
    },
  ];

  const sampleUser = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Anytown, ST 12345",
      outstandingBalance: 150.0,
      rentalHistory: [
        {
          id: 1,
          items: 3,
          startDate: "2024-02-01",
          endDate: "2024-02-15",
          amount: 299.99,
          status: "active",
        },
        {
          id: 2,
          items: 2,
          startDate: "2024-01-15",
          endDate: "2024-01-30",
          amount: 199.99,
          status: "completed",
        },
        {
          id: 3,
          items: 1,
          startDate: "2023-12-01",
          endDate: "2023-12-15",
          amount: 149.99,
          status: "overdue",
        },
      ],
    },
  ];

  const getRentalPeriod = () => {
    if (!formData.startDate || !formData.endDate) return 1;
    const diffTime = Math.abs(formData.endDate - formData.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const handleAddProduct = useCallback(() => {
    setSelectedProducts((prev) => [...prev, { id: Date.now(), quantity: 1 }]);
  }, []);

  const handleRemoveProduct = useCallback((index) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleProductChange = useCallback((index, productId) => {
    setSelectedProducts((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, productId: parseInt(productId) } : item
      )
    );
  }, []);

  const handleQuantityChange = useCallback((index, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setItem(searchTerm);
    if (searchTerm === "") {
      setfilteredUsers([]);
    } else {
      const filteredusers = sampleUser.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setfilteredUsers(filteredusers);
    }
  };

  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
    setClickedUser(user);
  }, []);

  const handleSubmit = () => {
    onSubmit({
      user: selectedUser,
      products: selectedProducts,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Rental</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6">
          <div className="w-3/5 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search customer..."
                  className="pl-8"
                  onChange={handleInputChange}
                />
                <ul
                  style={{
                    zIndex: 100,
                    position: "absolute",
                    backgroundColor: "black",
                    overflowY: "scroll",
                    width: "100%",
                    maxHeight: "150px",
                    listStyleType: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {filteredUsers.map((user) => (
                    <li
                      className="text-white"
                      key={user}
                      onClick={() => {
                        handleUserSelect(user);
                      }}
                      style={{ padding: "5px 10px", cursor: "pointer" }}
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedUser && <UserInfo user={selectedUser} />}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Products</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddProduct}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>

              {selectedProducts.map((product, index) => (
                <ProductField
                  key={product.id}
                  product={product}
                  products={products}
                  showRemove={index > 0}
                  onRemove={() => handleRemoveProduct(index)}
                  onChange={(value) => handleProductChange(index, value)}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DateField
                label="Start Date"
                value={formData.startDate}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, startDate: date }))
                }
              />
              <DateField
                label="End Date"
                value={formData.endDate}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, endDate: date }))
                }
              />
            </div>
          </div>

          <div className="w-2/5">
            <Card>
              <CardContent className="p-6 space-y-6">
                <OrderSummarySection
                  products={products}
                  selectedProducts={selectedProducts}
                  period={getRentalPeriod()}
                  onQuantityChange={handleQuantityChange}
                />

                {selectedUser && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Rental History</h3>
                    <div className="space-y-3">
                      {selectedUser.rentalHistory.map((rental) => (
                        <RentalHistoryItem key={rental.id} rental={rental} />
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  className="w-full mt-6"
                  size="lg"
                  disabled={
                    !selectedUser || !formData.startDate || !formData.endDate
                  }
                >
                  Create Rental
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
