import React from "react";
import {
  File,
  FileSpreadsheet,
  MoreVertical,
  Printer,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function ReportActions({ onExport, reportType, dateRange }) {
  const handlePrint = () => {
    window.print();
    toast({
      title: "Print dialog opened",
      description: "Your report is ready to print",
    });
  };

  const handleShare = () => {
    // In a real app, this would open a sharing dialog
    toast({
      title: "Share functionality",
      description: "Sharing options would be shown here",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => onExport("csv", reportType, dateRange)}
        >
          <File className="mr-2 h-4 w-4" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onExport("excel", reportType, dateRange)}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Export as Excel</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          <span>Print Report</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
