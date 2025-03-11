"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import axios from "axios";

import { CreditCard, DollarSign, Receipt } from "lucide-react";
import { toast } from "sonner";

const RecordPaymentModal = ({ rental, open, onOpenChange, onUpdate }) => {
  const [paymentData, setPaymentData] = useState({
    rentalId: null,
    amount: 0,
    paymentMethod: "card",
    paymentDate: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    if (rental) {
      // Calculate remaining amount based on total and payment status
      let remaining = rental.totalAmount;
      if (rental.paymentStatus === "partial") {
        // Assuming you have a field tracking how much was already paid
        // This is a simplification - you would need to adjust based on your data model
        remaining = rental.totalAmount * 0.5; // Example: 50% remaining for partial payments
      } else if (rental.paymentStatus === "paid") {
        remaining = 0;
      }

      setRemainingAmount(remaining);
      setPaymentData({
        rentalId: rental.id,
        amount: remaining,
        paymentMethod: "card",
        paymentDate: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      });
    }
  }, [rental]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentData((prev) => ({
      ...prev,
      paymentMethod: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // API call to record the payment
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the rental's payment status based on the payment
      const updatedRental = {
        ...rental,
        paymentStatus:
          parseFloat(paymentData.amount) >= remainingAmount
            ? "paid"
            : "partial",
      };

      onUpdate && onUpdate(updatedRental);
      toast({
        title: "Payment recorded successfully",
        description: `$${paymentData.amount} payment recorded for rental #${rental.id}`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to record payment:", error);
      toast({
        title: "Error recording payment",
        description:
          error.response?.data?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!rental) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Recording payment for rental #{rental.id} - {rental.user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rental Total</Label>
              <Input value={`$${rental.totalAmount.toFixed(2)}`} disabled />
            </div>
            <div>
              <Label>Current Status</Label>
              <Input
                value={rental.paymentStatus}
                disabled
                className="capitalize"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Payment Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={paymentData.amount}
                onChange={handleChange}
                className="pl-8"
              />
            </div>
            {rental.paymentStatus !== "paid" && (
              <p className="text-xs text-muted-foreground mt-1">
                Remaining balance: ${remainingAmount.toFixed(2)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <RadioGroup
              id="paymentMethod"
              value={paymentData.paymentMethod}
              onValueChange={handlePaymentMethodChange}
              className="flex space-x-4 my-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Cash
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="flex items-center">
                  <Receipt className="h-4 w-4 mr-1" />
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input
              id="paymentDate"
              name="paymentDate"
              type="date"
              value={paymentData.paymentDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={paymentData.notes}
              onChange={handleChange}
              placeholder="Optional payment notes"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPaymentModal;
