import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { toast } from "sonner";

const UsersModel = ({ onUpdate, OpenModal, setOpenModal, existingUser }) => {
  const [Name, setName] = useState(existingUser?.Name || "");
  const [address, setAddress] = useState(existingUser?.address || "");
  const [phone, setPhone] = useState(existingUser?.phone || "");
  const [email, setEmail] = useState(existingUser?.email || "");
  const [nic, setNic] = useState(existingUser?.nic || "");
  const [UserImage, setUserImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!existingUser;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Cleanup function for image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("Name", Name);
      formData.append("Email", email);
      formData.append("Nic", nic);
      formData.append("address", address);
      formData.append("phone", phone);

      if (UserImage) {
        formData.append("UserImage", UserImage);
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/office${
        isEditing ? `/${existingUser.id}` : ""
      }`;

      const res = await axios({
        method: isEditing ? "put" : "post",
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success(
          `${
            isEditing
              ? "User Updated Successfully"
              : "User Created Successfully"
          }`,
          { duration: 1600, position: "top-right" }
        );
        setLoading(false);
        onUpdate(res.data.data);
        resetForm();
        setOpenModal(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.", {
        duration: 4000,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setAddress("");
    setNic("");
    setPhone("");
    setUserImage(null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (existingUser) {
      setName(existingUser.name);
      setEmail(existingUser.email);
      setAddress(existingUser.address);
      setNic(existingUser.nic);
      setUserImage(existingUser.UserImage || null);
      setImagePreview(existingUser.UserImage || null);
    }
  }, [existingUser]);

  if (!OpenModal) return null;

  return (
    <Dialog open={OpenModal} onOpenChange={setOpenModal}>
      <DialogContent className="sm:max-w-[455px] lg:max-w-xl w-full">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-between gap-8">
          <form onSubmit={handleSubmit} className="flex-1">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
              <DialogDescription className="text-gray-600">
                Make changes to the User profile here. Click save when done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between gap-3">
                <div className="w-1/2">
                  <Label>NIC</Label>
                  <Input value={nic} onChange={(e) => setNic(e.target.value)} />
                </div>
                <div className="w-1/2">
                  <Label>Full Name</Label>
                  <Input
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between gap-3">
                <div className="w-1/2">
                  <Label>Email</Label>
                  <Input
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <Label>Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <Label>Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <Label>Upload User Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <DialogFooter>
              <Button
                className="mt-4"
                disabled={loading}
                variant="outline"
                type="submit"
              >
                {loading
                  ? "Loading..."
                  : isEditing
                  ? "Update User"
                  : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsersModel;
