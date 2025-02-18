import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, User } from "lucide-react";
import React from "react";

export const UserInfo = ({ user }) => {
  if (!user) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <User className="h-5 w-5 text-green-600 dark:text-green-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{user.name}</h4>
            <div className="text-sm text-gray-500 mt-1">{user.email}</div>
            <div className="text-sm text-gray-500">{user.phone}</div>
            {user.address && (
              <div className="text-sm text-gray-500 mt-2">{user.address}</div>
            )}
            {user.outstandingBalance > 0 && (
              <Alert className="mt-3" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Outstanding balance: ${user.outstandingBalance}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
