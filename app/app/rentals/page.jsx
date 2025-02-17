"use client";
import React, { useState } from "react";
import { Plus, Search, Calendar, Package, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const RentalPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([{ id: 1 }]);

  // Sample data - replace with your actual data
  const rentals = [
    {
      id: 1,
      customer: "John Doe",
      products: ["Camera Lens", "Tripod"],
      startDate: "2025-02-17",
      endDate: "2025-02-24",
      status: "active",
      total: 249.99,
    },
    {
      id: 2,
      customer: "Jane Smith",
      products: ["Drone"],
      startDate: "2025-02-15",
      endDate: "2025-02-18",
      status: "pending",
      total: 199.99,
    },
  ];

  const products = [
    { id: 1, name: "Camera Lens", price: 99.99 },
    { id: 2, name: "Tripod", price: 49.99 },
    { id: 3, name: "Drone", price: 199.99 },
  ];

  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];

  const addProductField = () => {
    setSelectedProducts([
      ...selectedProducts,
      { id: selectedProducts.length + 1 },
    ]);
  };

  const removeProductField = (index) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Rental Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                New Rental
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Rental</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Search customer..." className="pl-8" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Products</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addProductField}
                      className="flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Product
                    </Button>
                  </div>

                  {selectedProducts.map((product, index) => (
                    <div key={product.id} className="flex gap-4 items-start">
                      <Select className="flex-1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name} - ${product.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {index > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProductField(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input type="date" className="pl-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input type="date" className="pl-8" />
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4">Create Rental</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-medium">{rental.id}</TableCell>
                    <TableCell>{rental.customer}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rental.products.map((product, index) => (
                          <Badge key={index} variant="secondary">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{rental.startDate}</TableCell>
                    <TableCell>{rental.endDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(rental.status)}
                      >
                        {rental.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${rental.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalPage;
