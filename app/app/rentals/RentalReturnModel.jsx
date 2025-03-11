import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Return types
const returnTypes = [
  { value: "scheduled", label: "Scheduled Return" },
  { value: "early", label: "Early Return" },
  { value: "late", label: "Late Return" },
  { value: "partial", label: "Partial Return" },
  { value: "damaged", label: "Damaged Return" },
];

// Early return reasons
const earlyReasons = [
  { value: "no-longer-needed", label: "No Longer Needed" },
  { value: "incorrect-item", label: "Incorrect Item" },
  { value: "quality-issue", label: "Quality Issue" },
  { value: "other", label: "Other" },
];

// Late return reasons
const lateReasons = [
  { value: "forgot", label: "Forgot" },
  { value: "still-using", label: "Still Using" },
  { value: "transportation-issue", label: "Transportation Issue" },
  { value: "other", label: "Other" },
];

// Damage severity levels
const damageSeverity = [
  { value: "minor", label: "Minor - Usable with minor repairs" },
  { value: "moderate", label: "Moderate - Requires significant repair" },
  { value: "severe", label: "Severe - Unusable/Replacement needed" },
];

// Product names mapping (in a real app, this would come from your database)
const productNames = {
  1: "Professional Camera",
  2: "Drone",
  // Add more product mappings as needed
};

const RentalReturnModal = ({
  rental,
  open,
  onOpenChange,
  onReturnComplete,
}) => {
  const [returnType, setReturnType] = useState("scheduled");
  const [returnDate, setReturnDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [earlyReason, setEarlyReason] = useState("no-longer-needed");
  const [lateReason, setLateReason] = useState("forgot");
  const [damageDescription, setDamageDescription] = useState("");
  const [damageSeverityLevel, setDamageSeverityLevel] = useState("minor");
  const [damageFee, setDamageFee] = useState(0);
  const [staffNotes, setStaffNotes] = useState("");
  const [returnedItems, setReturnedItems] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Initialize items from rental when modal opens
  useEffect(() => {
    if (open && rental) {
      // Map rental products to returnable items
      const items = rental.products.map((product) => {
        const dueDate = format(rental.endDate, "yyyy-MM-dd");
        return {
          id: product.id,
          itemId: product.productId,
          description:
            productNames[product.productId] || `Product #${product.productId}`,
          quantity: product.quantity,
          duration: `${product.duration} ${product.durationUnit}`,
          dueDate: dueDate,
          returnStatus: determineReturnStatus(rental?.endDate),
          reason: "",
          returning: true, // By default all items are being returned
        };
      });
      setReturnedItems(items);
    }
  }, [open, rental]);

  // Determine return status based on due date
  const determineReturnStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    if (today < due) return "early";
    if (today > due) return "late";
    return "ontime";
  };

  const updateItem = (id, field, value) => {
    setReturnedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const toggleItemReturn = (id) => {
    setReturnedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, returning: !item.returning } : item
      )
    );
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!rental) {
      return {
        totalItems: 0,
        earlyItems: 0,
        onTimeItems: 0,
        lateItems: 0,
        damagedItems: 0,
        lateDays: 0,
        refundAmount: "0.00",
        lateFees: "0.00",
        damageFees: "0.00",
        finalBalance: "0.00",
        finalBalanceType: "refund",
      };
    }
    const itemsToReturn = returnedItems.filter((item) => item.returning);

    const earlyItems = itemsToReturn.filter(
      (item) => item.returnStatus === "early"
    ).length;
    const onTimeItems = itemsToReturn.filter(
      (item) => item.returnStatus === "ontime"
    ).length;
    const lateItems = itemsToReturn.filter(
      (item) => item.returnStatus === "late"
    ).length;
    const damagedItems = returnType === "damaged" ? itemsToReturn.length : 0;

    // Calculate late days
    const today = new Date();
    const dueDate = new Date(rental.endDate);
    const lateDays = Math.max(0, differenceInDays(today, dueDate));

    // Calculate fees based on rental total and days
    const dailyRate =
      rental.totalAmount / differenceInDays(rental.endDate, rental.startDate);

    // Sample calculations (would be more complex in a real system)
    // For early returns, refund 40% of remaining days
    const earlyDays =
      earlyItems > 0 ? Math.max(0, differenceInDays(dueDate, today)) : 0;
    const refundAmount = earlyDays * dailyRate * 0.4;

    // For late returns, charge 150% of daily rate per day late
    const lateFees = lateDays * dailyRate * 1.5;

    const totalDamageFees = damagedItems > 0 ? Number(damageFee) : 0;
    const finalBalance = refundAmount - lateFees - totalDamageFees;

    return {
      totalItems: itemsToReturn.length,
      earlyItems,
      onTimeItems,
      lateItems,
      damagedItems,
      lateDays,
      refundAmount: refundAmount.toFixed(2),
      lateFees: lateFees.toFixed(2),
      damageFees: totalDamageFees.toFixed(2),
      finalBalance: finalBalance.toFixed(2),
      finalBalanceType: finalBalance >= 0 ? "refund" : "due",
    };
  };

  const summary = calculateSummary();

  const handleProcessReturn = async () => {
    setProcessing(true);

    try {
      // In a real app, this would be an API call
      const returnData = {
        rentalId: rental.id,
        customerId: rental.user.id,
        returnDate,
        returnType,
        earlyReason: returnType === "early" ? earlyReason : null,
        lateReason: returnType === "late" ? lateReason : null,
        damageInfo:
          returnType === "damaged"
            ? {
                description: damageDescription,
                severity: damageSeverityLevel,
                fee: damageFee,
              }
            : null,
        items: returnedItems.filter((item) => item.returning),
        staffNotes,
        summary,
      };

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Return processed:", returnData);
      setShowConfirmation(true);

      // If this was successful, you could call onReturnComplete to update parent component
    } catch (error) {
      console.error("Error processing return:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseAfterComplete = () => {
    setShowConfirmation(false);
    if (onReturnComplete) {
      onReturnComplete(rental.id);
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setReturnType("scheduled");
    setReturnDate(format(new Date(), "yyyy-MM-dd"));
    setEarlyReason("no-longer-needed");
    setLateReason("forgot");
    setDamageDescription("");
    setDamageSeverityLevel("minor");
    setDamageFee(0);
    setStaffNotes("");
    setReturnedItems([]);
    setShowConfirmation(false);
  };

  // Ensure we don't try to render with invalid data
  if (!rental) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) resetForm();
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle>Process Return - Order #{rental.id}</DialogTitle>
              <DialogDescription>
                Customer: {rental.user.name} ({rental.user.email})
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="items" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="items">Return Items</TabsTrigger>
                <TabsTrigger value="details">Return Details</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Return</TableHead>
                      <TableHead>Item ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnedItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className={!item.returning ? "opacity-50" : ""}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={item.returning}
                            onChange={() => toggleItemReturn(item.id)}
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell>{item.itemId}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.duration}</TableCell>
                        <TableCell>{item.dueDate}</TableCell>
                        <TableCell>
                          {item.returning && (
                            <div className="space-y-2">
                              <Select
                                value={item.returnStatus}
                                onValueChange={(value) =>
                                  updateItem(item.id, "returnStatus", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ontime">
                                    <div className="flex items-center">
                                      <Badge className="bg-green-500 mr-2">
                                        On Time
                                      </Badge>
                                      On Time
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="early">
                                    <div className="flex items-center">
                                      <Badge className="bg-blue-500 mr-2">
                                        Early
                                      </Badge>
                                      Early
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="late">
                                    <div className="flex items-center">
                                      <Badge className="bg-red-500 mr-2">
                                        Late
                                      </Badge>
                                      Late
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>

                              {item.returnStatus === "early" && (
                                <Select
                                  value={item.reason || "no-longer-needed"}
                                  onValueChange={(value) =>
                                    updateItem(item.id, "reason", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select reason" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {earlyReasons.map((reason) => (
                                      <SelectItem
                                        key={reason.value}
                                        value={reason.value}
                                      >
                                        {reason.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}

                              {item.returnStatus === "late" && (
                                <Select
                                  value={item.reason || "forgot"}
                                  onValueChange={(value) =>
                                    updateItem(item.id, "reason", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select reason" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {lateReasons.map((reason) => (
                                      <SelectItem
                                        key={reason.value}
                                        value={reason.value}
                                      >
                                        {reason.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          )}
                          {!item.returning && (
                            <Badge variant="outline" className="text-gray-500">
                              Not returning
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="return-date">Return Date</Label>
                    <Input
                      id="return-date"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="return-type">Return Type</Label>
                    <Select value={returnType} onValueChange={setReturnType}>
                      <SelectTrigger id="return-type">
                        <SelectValue placeholder="Select return type" />
                      </SelectTrigger>
                      <SelectContent>
                        {returnTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Conditional Return Type Fields */}
                {returnType === "early" && (
                  <div className="border rounded-md p-4 bg-blue-50 dark:bg-black">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="early-reason">
                          Reason for Early Return
                        </Label>
                        <Select
                          value={earlyReason}
                          onValueChange={setEarlyReason}
                        >
                          <SelectTrigger id="early-reason">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {earlyReasons.map((reason) => (
                              <SelectItem
                                key={reason.value}
                                value={reason.value}
                              >
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {returnType === "late" && (
                  <div className="border rounded-md p-4 bg-amber-50 dark:bg-black">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="late-reason">
                          Reason for Late Return
                        </Label>
                        <Select
                          value={lateReason}
                          onValueChange={setLateReason}
                        >
                          <SelectTrigger id="late-reason">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {lateReasons.map((reason) => (
                              <SelectItem
                                key={reason.value}
                                value={reason.value}
                              >
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {returnType === "damaged" && (
                  <div className="border rounded-md p-4 bg-red-50 dark:bg-black">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="damage-description">
                          Damage Description
                        </Label>
                        <Textarea
                          id="damage-description"
                          placeholder="Describe the damage in detail"
                          value={damageDescription}
                          onChange={(e) => setDamageDescription(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="damage-severity">Damage Severity</Label>
                        <Select
                          value={damageSeverityLevel}
                          onValueChange={setDamageSeverityLevel}
                        >
                          <SelectTrigger id="damage-severity">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            {damageSeverity.map((severity) => (
                              <SelectItem
                                key={severity.value}
                                value={severity.value}
                              >
                                {severity.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="damage-fee">
                          Estimated Damage Fee ($)
                        </Label>
                        <Input
                          id="damage-fee"
                          type="number"
                          placeholder="Enter fee amount"
                          value={damageFee}
                          onChange={(e) => setDamageFee(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="staff-notes">Staff Notes</Label>
                  <Textarea
                    id="staff-notes"
                    placeholder="Additional notes about this return"
                    value={staffNotes}
                    onChange={(e) => setStaffNotes(e.target.value)}
                  />
                </div>

                <div className="p-4 border rounded-md bg-gray-50 dark:bg-black">
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p>{rental.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{rental.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{rental.user.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Outstanding Balance
                      </p>
                      <p
                        className={
                          rental.user.outstandingBalance > 0
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        ${rental.user.outstandingBalance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Return Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Items</p>
                        <p className="text-xl font-medium">
                          {summary.totalItems}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Early Returns</p>
                        <p className="text-xl font-medium text-blue-600">
                          {summary.earlyItems}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">On-Time Returns</p>
                        <p className="text-xl font-medium text-green-600">
                          {summary.onTimeItems}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Late Returns</p>
                        <p className="text-xl font-medium text-red-600">
                          {summary.lateItems}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Damaged Items</p>
                        <p className="text-xl font-medium text-orange-600">
                          {summary.damagedItems}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Refund</p>
                        <p className="text-xl font-medium text-green-600">
                          ${summary.refundAmount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Late Fees</p>
                        <p className="text-xl font-medium text-red-600">
                          ${summary.lateFees}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Total Damage Fees
                        </p>
                        <p className="text-xl font-medium text-orange-600">
                          ${summary.damageFees}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 border rounded-md bg-gray-100 dark:bg-black">
                      <p className="text-sm text-gray-500">
                        Balance Due/Refund
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          summary.finalBalanceType === "refund"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ${Math.abs(summary.finalBalance).toFixed(2)}{" "}
                        {summary.finalBalanceType === "refund"
                          ? "(Refund)"
                          : "(Due)"}
                      </p>
                    </div>

                    <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-black">
                      <h3 className="font-medium mb-2">Rental Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order #</p>
                          <p>{rental.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Rental Period</p>
                          <p>
                            {format(rental.startDate, "MMM dd, yyyy")} -{" "}
                            {format(rental.endDate, "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p>${rental.totalAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Payment Status
                          </p>
                          <Badge
                            className={
                              rental.paymentStatus === "paid"
                                ? "bg-green-500"
                                : "bg-amber-500"
                            }
                          >
                            {rental.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleProcessReturn}
                disabled={processing || summary.totalItems === 0}
              >
                {processing ? "Processing..." : "Process Return"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Return Processed Successfully</DialogTitle>
              <DialogDescription>
                The rental return has been processed for order #{rental.id}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Alert
                className={
                  summary.finalBalanceType === "refund"
                    ? "bg-green-50 dark:bg-black        "
                    : "bg-amber-50 dark:bg-black"
                }
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {summary.finalBalanceType === "refund"
                    ? `Refund amount: $${Math.abs(summary.finalBalance).toFixed(
                        2
                      )}`
                    : `Balance due: $${Math.abs(summary.finalBalance).toFixed(
                        2
                      )}`}
                </AlertTitle>
                <AlertDescription>
                  {summary.finalBalanceType === "refund"
                    ? "A refund has been initiated for the customer."
                    : "Please collect payment from the customer."}
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button onClick={handleCloseAfterComplete}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RentalReturnModal;

// Example usage with your data structure:
/*
import { useState } from 'react';
import RentalReturnModal from './RentalReturnModal';

export default function RentalsTable({ rentals }) {
  const [selectedRental, setSelectedRental] = useState(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const handleReturnComplete = (rentalId) => {
    // Update your rentals list or refetch data
    console.log(`Return completed for rental #${rentalId}`);
  };

  // Example data structure
  const demoRental = {
    id: 1,
    user: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Anytown, ST 12345",
      outstandingBalance: 150.0,
    },
    products: [
      {
        id: 101,
        productId: 1, // Professional Camera
        quantity: 2,
        duration: 7,
        durationUnit: "days",
      },
      {
        id: 102,
        productId: 2, // Drone
        quantity: 1,
        duration: 7,
        durationUnit: "days",
      },
    ],
    startDate: new Date("2025-02-10"),
    endDate: new Date("2025-02-17"),
    totalAmount: 349.97,
    status: "active",
    returnStatus: "pending",
    paymentStatus: "paid",
  };

  return (
    <div>
      <Button
        onClick={() => {
          setSelectedRental(demoRental);
          setIsReturnModalOpen(true);
        }}
      >
        Process Return
      </Button>

      <RentalReturnModal
        rental={selectedRental}
        open={isReturnModalOpen}
        onOpenChange={setIsReturnModalOpen}
        onReturnComplete={handleReturnComplete}
      />
    </div>
  );
}
*/
