import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, ImagePlus, X } from "lucide-react";

// ProductModel Component
export const PricingModel = ({
  onUpdate,
  OpenModal,
  setOpenModal,
  existingProduct,
  mode = "edit",
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stock update state
  const [stockUpdate, setStockUpdate] = useState({
    currentStock: 0,
    adjustmentAmount: 0,
    adjustmentType: "add",
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    model: "",
    stock: "",
    quantity: "",
    images: [],
    brand: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    isDigital: false,
    status: "draft",
    variations: [],
    tags: [],
  });

  // Image preview state
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    if (existingProduct) {
      setFormData(existingProduct);
      setImagePreview(existingProduct.images || []);
      setStockUpdate((prev) => ({
        ...prev,
        currentStock: existingProduct.quantity || 0,
      }));
    }
  }, [existingProduct]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setImagePreview((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Stock update handler
  const handleStockUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newQuantity =
        stockUpdate.adjustmentType === "add"
          ? stockUpdate.currentStock + Number(stockUpdate.adjustmentAmount)
          : stockUpdate.currentStock - Number(stockUpdate.adjustmentAmount);

      const res = await axios({
        method: "patch",
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${existingProduct.id}/stock`,
        data: {
          quantity: newQuantity,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Stock updated successfully", { duration: 1600 });
      onUpdate({
        ...existingProduct,
        quantity: newQuantity,
      });
      setOpenModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((image) => {
            formDataToSend.append("images", image);
          });
        } else if (key === "dimensions") {
          formDataToSend.append(
            "dimensions",
            JSON.stringify(formData.dimensions)
          );
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products${
        existingProduct ? `/${existingProduct.id}` : ""
      }`;

      const res = await axios({
        method: existingProduct ? "put" : "post",
        url,
        data: formDataToSend,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        `Product ${existingProduct ? "updated" : "created"} successfully`,
        {
          duration: 1600,
        }
      );
      onUpdate(res.data.data);
      setOpenModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStockUpdate = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Current Stock</Label>
        <div className="text-lg font-semibold">{stockUpdate.currentStock}</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="adjustmentType">Adjustment Type</Label>
        <div className="flex space-x-4">
          <Button
            type="button"
            variant={
              stockUpdate.adjustmentType === "add" ? "default" : "outline"
            }
            onClick={() =>
              setStockUpdate((prev) => ({ ...prev, adjustmentType: "add" }))
            }
          >
            Add Stock
          </Button>
          <Button
            type="button"
            variant={
              stockUpdate.adjustmentType === "subtract" ? "default" : "outline"
            }
            onClick={() =>
              setStockUpdate((prev) => ({
                ...prev,
                adjustmentType: "subtract",
              }))
            }
          >
            Remove Stock
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="adjustmentAmount">Adjustment Amount</Label>
        <Input
          id="adjustmentAmount"
          type="number"
          min="0"
          value={stockUpdate.adjustmentAmount}
          onChange={(e) =>
            setStockUpdate((prev) => ({
              ...prev,
              adjustmentAmount: Math.max(0, parseInt(e.target.value) || 0),
            }))
          }
        />
      </div>

      <div className="mt-6">
        <div className="text-sm text-muted-foreground">
          New stock level will be:{" "}
          {stockUpdate.adjustmentType === "add"
            ? stockUpdate.currentStock + Number(stockUpdate.adjustmentAmount)
            : stockUpdate.currentStock - Number(stockUpdate.adjustmentAmount)}
        </div>
      </div>
    </div>
  );

  const renderProductForm = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter product description"
                className="h-32"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, model: e.target.value }))
                  }
                  placeholder="Enter Model"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="grid grid-cols-3 gap-4">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer flex items-center justify-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <ImagePlus className="w-8 h-8 text-gray-400" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  placeholder="Enter brand name"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length (cm)</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dimensions: {
                        ...prev.dimensions,
                        length: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, width: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dimensions: {
                        ...prev.dimensions,
                        height: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, weight: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Initial Stock</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            {/* <div className="flex items-center space-x-2">
              <Switch
                id="isDigital"
                checked={formData.isDigital}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isDigital: checked }))
                }
              />
              <Label htmlFor="isDigital">Digital Product</Label>
            </div> */}
            <div className="space-y-2">
              <Label>Product Status</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="draft" />
                  <Label htmlFor="draft">Draft</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="published" id="published" />
                  <Label htmlFor="published">Published</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Sheet open={OpenModal} onOpenChange={setOpenModal}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {mode === "stock"
              ? "Update Stock"
              : existingProduct
              ? "Edit Product"
              : "Add Product"}
          </SheetTitle>
          <SheetDescription>
            {mode === "stock"
              ? "Update the product stock level"
              : "Fill in the product details. Navigate through the form using the buttons below."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {mode === "stock" ? (
            <form onSubmit={handleStockUpdate}>
              {renderStockUpdate()}
              <Separator className="my-6" />
              <SheetFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Stock"}
                </Button>
              </SheetFooter>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-6">
                <div className="flex items-center">
                  {[1, 2, 3].map((stepNumber) => (
                    <React.Fragment key={stepNumber}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step >= stepNumber
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div
                          className={`w-12 h-1 ${
                            step > stepNumber ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {renderProductForm()}

              <Separator className="my-6" />

              <SheetFooter>
                <div className="flex justify-between w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((prev) => prev - 1)}
                    disabled={step === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setStep((prev) => prev + 1)}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Product"}
                    </Button>
                  )}
                </div>
              </SheetFooter>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
