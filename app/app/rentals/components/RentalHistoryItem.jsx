import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import React from "react";

export const RentalHistoryItem = ({ rental }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      case "overdue":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "completed":
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="flex flex-col">
        <div className="text-sm font-medium">{rental.items} items</div>
        <div className="text-xs text-gray-500">
          {rental.startDate} - {rental.endDate}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">Rs.{rental.amount}</div>
        <span
          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(
            rental.status
          )}`}
        >
          {getStatusIcon(rental.status)}
          {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
        </span>
      </div>
    </div>
  );
};
