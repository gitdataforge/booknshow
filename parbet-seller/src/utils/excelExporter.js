import * as XLSX from 'xlsx';

/**
 * Utility function to format dates uniformly for Excel reports.
 * @param {string|Date} dateString - The raw date value.
 * @returns {string} - Formatted date string.
 */
const formatReportDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

/**
 * Utility function to calculate and set auto-width for columns based on content length.
 * @param {Object} worksheet - The SheetJS worksheet object.
 * @param {Array} data - The array of mapped objects.
 * @param {Array} headers - The array of header keys.
 */
const autoSizeExcelColumns = (worksheet, data, headers) => {
    const colWidths = headers.map((header) => {
        let maxLength = header.length;
        data.forEach(row => {
            const cellValue = row[header];
            if (cellValue !== null && cellValue !== undefined) {
                const cellLength = String(cellValue).length;
                if (cellLength > maxLength) {
                    maxLength = cellLength;
                }
            }
        });
        return { wch: maxLength + 3 }; // Adding 3 characters of padding for readability
    });
    worksheet['!cols'] = colWidths;
};

/**
 * Exports Sales Data to a highly formatted Excel file.
 * @param {Array} salesData - Real array of sale objects from your database.
 * @param {string} fileName - Base name for the downloaded file.
 */
export const exportSalesToExcel = (salesData, fileName = 'Parbet_Sales_Report') => {
    if (!salesData || !Array.isArray(salesData) || salesData.length === 0) {
        console.error('Export Failed: No sales data provided.');
        return;
    }

    const mappedData = salesData.map(sale => ({
        'Transaction ID': sale.transactionId || sale.id || 'N/A',
        'Date of Sale': formatReportDate(sale.createdAt),
        'Customer ID': sale.customerId || 'Guest',
        'Customer Name': sale.customerName || 'N/A',
        'Total Items': sale.items ? sale.items.length : 0,
        'Gross Amount': sale.totalAmount ? `$${Number(sale.totalAmount).toFixed(2)}` : '$0.00',
        'Platform Fee': sale.fee ? `$${Number(sale.fee).toFixed(2)}` : '$0.00',
        'Net Earnings': sale.netAmount ? `$${Number(sale.netAmount).toFixed(2)}` : '$0.00',
        'Payment Method': sale.paymentMethod || 'N/A',
        'Status': sale.status || 'Completed'
    }));

    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    autoSizeExcelColumns(worksheet, mappedData, Object.keys(mappedData[0]));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Analytics');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
};

/**
 * Exports Orders Data to a highly formatted Excel file.
 * @param {Array} ordersData - Real array of order objects from your database.
 * @param {string} fileName - Base name for the downloaded file.
 */
export const exportOrdersToExcel = (ordersData, fileName = 'Parbet_Orders_Report') => {
    if (!ordersData || !Array.isArray(ordersData) || ordersData.length === 0) {
        console.error('Export Failed: No orders data provided.');
        return;
    }

    const mappedData = ordersData.map(order => ({
        'Order Number': order.orderNumber || order.id || 'N/A',
        'Order Date': formatReportDate(order.createdAt),
        'Buyer Name': order.shippingAddress?.name || order.buyerName || 'N/A',
        'Shipping Address': order.shippingAddress ? `${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}` : 'N/A',
        'Contact Email': order.buyerEmail || 'N/A',
        'Order Total': order.total ? `$${Number(order.total).toFixed(2)}` : '$0.00',
        'Payment Status': order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDING',
        'Fulfillment Status': order.fulfillmentStatus ? order.fulfillmentStatus.toUpperCase() : 'UNFULFILLED',
        'Carrier': order.shippingCarrier || 'Not Assigned',
        'Tracking Number': order.trackingNumber || 'Not Assigned'
    }));

    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    autoSizeExcelColumns(worksheet, mappedData, Object.keys(mappedData[0]));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Order Fulfillment');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
};

/**
 * Exports Active/Inactive Listings Data to a highly formatted Excel file.
 * @param {Array} listingsData - Real array of product listing objects from your database.
 * @param {string} fileName - Base name for the downloaded file.
 */
export const exportListingsToExcel = (listingsData, fileName = 'Parbet_Listings_Report') => {
    if (!listingsData || !Array.isArray(listingsData) || listingsData.length === 0) {
        console.error('Export Failed: No listings data provided.');
        return;
    }

    const mappedData = listingsData.map(product => ({
        'Product ID': product.id || 'N/A',
        'SKU': product.sku || 'N/A',
        'Product Title': product.title || 'Untitled Product',
        'Category': product.category || 'Uncategorized',
        'Price': product.price ? `$${Number(product.price).toFixed(2)}` : '$0.00',
        'Current Stock (Inventory)': product.inventoryCount || 0,
        'Stock Status': product.inventoryCount > 0 ? 'In Stock' : 'Out of Stock',
        'Listing Status': product.isActive ? 'ACTIVE' : 'INACTIVE',
        'Total Views': product.views || 0,
        'Date Created': formatReportDate(product.createdAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    autoSizeExcelColumns(worksheet, mappedData, Object.keys(mappedData[0]));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory & Listings');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`);
};