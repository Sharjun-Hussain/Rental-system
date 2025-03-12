// utils/export.js

/**
 * Exports data to a CSV file and triggers download
 * @param {Array} data - Array of objects to export
 * @param {string} reportType - Type of report (rental, inventory, financial)
 * @param {Object} dateRange - Object containing from and to dates
 */
export const exportToCSV = (data, reportType, dateRange) => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }

  // Format date range for filename
  const fromDate = formatDate(dateRange.from);
  const toDate = formatDate(dateRange.to);

  // Create filename
  const filename = `${reportType}-report-${fromDate}-to-${toDate}.csv`;

  // Get headers from first item (all items should have same structure)
  const headers = Object.keys(data[0]);

  // Create CSV content
  let csvContent = headers.join(",") + "\n";

  // Add data rows
  data.forEach((item) => {
    const row = headers
      .map((header) => {
        let value = item[header];

        // Handle special cases
        if (Array.isArray(value)) {
          // For arrays (like items in rental reports)
          value = `"${value.join(", ")}"`;
        } else if (typeof value === "string" && value.includes(",")) {
          // Escape strings with commas
          value = `"${value}"`;
        } else if (typeof value === "number") {
          // Format numbers with 2 decimal places if needed
          value = Number.isInteger(value) ? value : value.toFixed(2);
        }

        return value;
      })
      .join(",");

    csvContent += row + "\n";
  });

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    // Other browsers
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Exports data to an Excel file and triggers download
 * This uses CSV as a base and changes the MIME type to make Excel open it
 * For a more fully-featured Excel export, a library like xlsx would be needed
 *
 * @param {Array} data - Array of objects to export
 * @param {string} reportType - Type of report (rental, inventory, financial)
 * @param {Object} dateRange - Object containing from and to dates
 */
export const exportToExcel = (data, reportType, dateRange) => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }

  // Format date range for filename
  const fromDate = formatDate(dateRange.from);
  const toDate = formatDate(dateRange.to);

  // Create filename
  const filename = `${reportType}-report-${fromDate}-to-${toDate}.xls`;

  // Get headers from first item
  const headers = Object.keys(data[0]);

  // Create Excel content (similar to CSV but with tab separators)
  let excelContent = headers.join("\t") + "\n";

  // Add data rows
  data.forEach((item) => {
    const row = headers
      .map((header) => {
        let value = item[header];

        // Handle special cases
        if (Array.isArray(value)) {
          value = value.join(", ");
        } else if (typeof value === "number") {
          value = Number.isInteger(value) ? value : value.toFixed(2);
        }

        return value;
      })
      .join("\t");

    excelContent += row + "\n";
  });

  // Create and trigger download
  const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");

  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    // Other browsers
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Helper function to format date as YYYY-MM-DD
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
