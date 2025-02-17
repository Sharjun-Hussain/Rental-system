import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CategoryModel = ({
  onUpdate,
  OpenModal,
  setOpenModal,
  existingCategory,
}) => {
  const [name, setName] = useState(existingCategory?.name || "");
  const [description, setDescription] = useState(
    existingCategory?.description || ""
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!existingCategory;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validate inputs
      if (!name.trim()) {
        setError("Category name is required");
        setLoading(false);
        return;
      }

      const categoryData = {
        name,
        description,
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/categories${
        isEditing ? `/${existingCategory.id}` : ""
      }`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `Category ${isEditing ? "Updated" : "Created"} Successfully`,
          { duration: 1600, position: "top-right" }
        );
        setLoading(false);
        onUpdate(data);
        resetForm();
        setOpenModal(false);
      } else {
        throw new Error("Failed to save category");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      toast.error("Failed to save category", {
        duration: 4000,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setError(null);
  };

  if (!OpenModal) return null;

  return (
    <Dialog open={OpenModal} onOpenChange={setOpenModal}>
      <DialogContent className="sm:max-w-[425px]">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the category here. Click save when done."
                : "Create a new product category by filling out the form below."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Category"
                : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModel;
