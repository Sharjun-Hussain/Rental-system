import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function FilterPanel({ reportType, filters, setFilters, reports }) {
  // Extract unique filter options
  const [filterOptions, setFilterOptions] = useState({
    rental: {
      status: [],
      customerType: [],
    },
    inventory: {
      category: [],
    },
  });

  // Update unique filter options when reports change
  useEffect(() => {
    const options = {
      rental: {
        status: [...new Set(reports.rental.map((item) => item.status))],
        customerType: [
          ...new Set(reports.rental.map((item) => item.customerType)),
        ],
      },
      inventory: {
        category: [...new Set(reports.inventory.map((item) => item.category))],
      },
    };
    setFilterOptions(options);
  }, [reports]);

  // Handle checkbox filter changes
  const handleCheckboxFilterChange = (category, value) => {
    const currentValues = filters[reportType][category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    setFilters({
      ...filters,
      [reportType]: {
        ...filters[reportType],
        [category]: newValues,
      },
    });
  };

  // Handle input filter changes
  const handleInputFilterChange = (category, value) => {
    setFilters({
      ...filters,
      [reportType]: {
        ...filters[reportType],
        [category]: value,
      },
    });
  };

  // Handle select filter changes
  const handleSelectFilterChange = (category, value) => {
    setFilters({
      ...filters,
      [reportType]: {
        ...filters[reportType],
        [category]: value,
      },
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    const resetFilters = {
      rental: {
        status: [],
        customerType: [],
        minimumAmount: "",
        maximumAmount: "",
      },
      inventory: {
        category: [],
        maintenance: "",
        minimumUtilization: "",
        maximumUtilization: "",
      },
      financial: {
        minRevenue: "",
        maxRevenue: "",
      },
    };
    setFilters(resetFilters);
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    const currentFilters = filters[reportType];

    Object.keys(currentFilters).forEach((key) => {
      if (
        Array.isArray(currentFilters[key]) &&
        currentFilters[key].length > 0
      ) {
        count += currentFilters[key].length;
      } else if (currentFilters[key] && !Array.isArray(currentFilters[key])) {
        count += 1;
      }
    });

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="font-medium">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Clear All
            </Button>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {reportType === "rental" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Status</h4>
              <div className="space-y-2">
                {filterOptions.rental.status.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.rental.status.includes(status)}
                      onCheckedChange={() =>
                        handleCheckboxFilterChange("status", status)
                      }
                    />
                    <Label htmlFor={`status-${status}`}>{status}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Customer Type</h4>
              <div className="space-y-2">
                {filterOptions.rental.customerType.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`customerType-${type}`}
                      checked={filters.rental.customerType.includes(type)}
                      onCheckedChange={() =>
                        handleCheckboxFilterChange("customerType", type)
                      }
                    />
                    <Label htmlFor={`customerType-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Amount Range</h4>
              <div className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="minimumAmount">Minimum ($)</Label>
                  <Input
                    id="minimumAmount"
                    placeholder="0.00"
                    value={filters.rental.minimumAmount}
                    onChange={(e) =>
                      handleInputFilterChange("minimumAmount", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="maximumAmount">Maximum ($)</Label>
                  <Input
                    id="maximumAmount"
                    placeholder="10000.00"
                    value={filters.rental.maximumAmount}
                    onChange={(e) =>
                      handleInputFilterChange("maximumAmount", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === "inventory" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Category</h4>
              <div className="space-y-2">
                {filterOptions.inventory.category.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.inventory.category.includes(category)}
                      onCheckedChange={() =>
                        handleCheckboxFilterChange("category", category)
                      }
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Maintenance Status</h4>
              <Select
                value={filters.inventory.maintenance}
                onValueChange={(value) =>
                  handleSelectFilterChange("maintenance", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  <SelectItem value="required">Maintenance Required</SelectItem>
                  <SelectItem value="not-required">
                    No Maintenance Required
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">
                Utilization Range (%)
              </h4>
              <div className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="minimumUtilization">Minimum</Label>
                  <Input
                    id="minimumUtilization"
                    placeholder="0"
                    value={filters.inventory.minimumUtilization}
                    onChange={(e) =>
                      handleInputFilterChange(
                        "minimumUtilization",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="maximumUtilization">Maximum</Label>
                  <Input
                    id="maximumUtilization"
                    placeholder="100"
                    value={filters.inventory.maximumUtilization}
                    onChange={(e) =>
                      handleInputFilterChange(
                        "maximumUtilization",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === "financial" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Revenue Range ($)</h4>
              <div className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="minRevenue">Minimum</Label>
                  <Input
                    id="minRevenue"
                    placeholder="0.00"
                    value={filters.financial.minRevenue}
                    onChange={(e) =>
                      handleInputFilterChange("minRevenue", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="maxRevenue">Maximum</Label>
                  <Input
                    id="maxRevenue"
                    placeholder="50000.00"
                    value={filters.financial.maxRevenue}
                    onChange={(e) =>
                      handleInputFilterChange("maxRevenue", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
          <Button>Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
}
