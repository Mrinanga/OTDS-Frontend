import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';

const generateShipmentLabel = (shipmentData) => {
    const doc = new jsPDF({
        unit: 'mm',
        format: [101.6, 152.4] // 4x6 inches in mm (approx. 101.6mm x 152.4mm)
    });

    // Set font for consistent look
    doc.setFont('helvetica');

    // Helper function to add text with auto-line breaking
    const addText = (text, x, y, maxWidth, fontSize = 10, align = 'left', lineHeight = 1.2) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line, index) => {
            let actualX = x;
            if (align === 'center') {
                actualX = x - doc.getStringUnitWidth(line) * fontSize / 2;
            } else if (align === 'right') {
                actualX = x - doc.getStringUnitWidth(line) * fontSize;
            }
            doc.text(line, actualX, y + (index * fontSize * lineHeight));
        });
        return y + (lines.length * fontSize * lineHeight); // Return new Y position
    };

    // Helper to draw a border
    const drawBorder = (x, y, width, height) => {
        doc.rect(x, y, width, height);
    };

    // Helper to format date and time
    const formatDateTime = (isoString) => {
        if (!isoString) return { date: '', time: '' };
        const dateObj = new Date(isoString);
        const date = dateObj.toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '-');
        const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        return { date, time };
    };

    // Define coordinates and dimensions (adjust as needed)
    const margin = 5;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Extract and format dynamic data using the new backend structure
    const { date: shipmentDate, time: shipmentTime } = formatDateTime(shipmentData.created_at);
    const recipientName = shipmentData.recipient_customer_name || 'N/A';
    const recipientFullAddress = [
        shipmentData.recipient_address_line1,
        shipmentData.recipient_po_box ? `P.o- ${shipmentData.recipient_po_box}` : '',
        shipmentData.recipient_district ? `Dist- ${shipmentData.recipient_district}` : '',
        shipmentData.recipient_city,
        shipmentData.recipient_state
    ].filter(Boolean).join(', ');
    const recipientPin = shipmentData.recipient_pincode || 'N/A';

    const senderFullAddress = [
        shipmentData.sender_address_line1,
        shipmentData.sender_city,
        shipmentData.sender_state,
        `India, ${shipmentData.sender_pincode}`
    ].filter(Boolean).join(', ');

    const productDetails = shipmentData.items && shipmentData.items.length > 0 ? shipmentData.items.map(item => item.name).join(', ') : 'N/A';
    const itemPrice = shipmentData.items && shipmentData.items.length > 0 ? shipmentData.items[0].price : 'N/A';
    const itemTotalPrice = shipmentData.items && shipmentData.items.length > 0 ? shipmentData.items[0].total_price : 'N/A';


    // Section 1: Company Logos and Barcode 1
    const section1Height = 30;
    drawBorder(margin, margin, pageWidth - 2 * margin, section1Height);

    doc.setFontSize(14);
    doc.text('OTDS Courier', margin + 2, margin + 8);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('OTDS', pageWidth - margin - 2, margin + 8, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    const barcode1Value = shipmentData.tracking_number || 'N/A';
    let canvas1 = document.createElement('canvas');
    JsBarcode(canvas1, barcode1Value, {
        format: "CODE128",
        displayValue: false,
        width: 1.5,
        height: 20,
        margin: 0
    });
    doc.addImage(canvas1.toDataURL('image/png'), 'PNG', margin + 10, margin + 10, pageWidth - 2 * margin - 20, 15);
    doc.setFontSize(8);
    doc.text(barcode1Value, pageWidth / 2, margin + 25, { align: 'center' });

    doc.setFontSize(8);
    doc.text(shipmentData.origin_branch_pincode || 'N/A', margin + 2, margin + section1Height - 4);
    doc.text(shipmentData.origin_branch_code || 'N/A', pageWidth - margin - 2, margin + section1Height - 4, { align: 'right' });

    // Section 2: Ship To & Payment Details
    const section2Height = 35;
    const section2Y = margin + section1Height;
    drawBorder(margin, section2Y, pageWidth - 2 * margin, section2Height);

    const halfWidth = (pageWidth - 2 * margin) / 2;
    doc.line(margin + halfWidth, section2Y, margin + halfWidth, section2Y + section2Height); // Vertical line

    doc.setFontSize(9);
    addText('Ship To:', margin + 2, section2Y + 4, halfWidth - 4);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    addText(recipientName.toUpperCase(), margin + 2, section2Y + 8, halfWidth - 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    let currentY = addText(recipientFullAddress, margin + 2, section2Y + 12, halfWidth - 4);
    addText(`PIN:${recipientPin}`, margin + 2, currentY + 1, halfWidth - 4);

    doc.setFontSize(10);
    doc.text(shipmentData.payment_type || 'Pre-paid', margin + halfWidth + 2, section2Y + 8);
    doc.text(shipmentData.shipping_mode || 'Surface', margin + halfWidth + 2, section2Y + 12);
    doc.setFontSize(14);
    doc.text(`INR ${shipmentData.amount_declared || 'N/A'}`, margin + halfWidth + 2, section2Y + 20);

    // Section 3: Seller & Date
    const section3Height = 25;
    const section3Y = section2Y + section2Height;
    drawBorder(margin, section3Y, pageWidth - 2 * margin, section3Height);
    doc.line(margin + halfWidth, section3Y, margin + halfWidth, section3Y + section3Height); // Vertical line

    doc.setFontSize(9);
    addText('Seller: OTDS Logistics', margin + 2, section3Y + 4, halfWidth - 4);
    addText(`Address: "${senderFullAddress}"`, margin + 2, section3Y + 8, halfWidth - 4);

    doc.setFontSize(9);
    doc.text(`Date: ${shipmentDate}`, margin + halfWidth + 2, section3Y + 8);
    doc.text(shipmentTime, margin + halfWidth + 2, section3Y + 12);

    // Section 4: Product Details & Price
    const section4Height = 25;
    const section4Y = section3Y + section3Height;
    drawBorder(margin, section4Y, pageWidth - 2 * margin, section4Height);

    doc.line(margin + halfWidth, section4Y, margin + halfWidth, section4Y + section4Height); // Vertical line
    doc.line(margin + halfWidth + halfWidth / 2, section4Y, margin + halfWidth + halfWidth / 2, section4Y + section4Height); // Vertical line for Price/Total

    doc.setFontSize(9);
    doc.text('Product(Qty)', margin + 2, section4Y + 4);
    doc.text('Price', margin + halfWidth + 2, section4Y + 4);
    doc.text('Total', margin + halfWidth + halfWidth / 2 + 2, section4Y + 4);

    doc.setFontSize(10);
    addText(productDetails, margin + 2, section4Y + 12, halfWidth - 4);
    doc.text(`INR ${itemPrice}`, margin + halfWidth + 2, section4Y + 12);
    doc.text(`INR ${itemTotalPrice}`, margin + halfWidth + halfWidth / 2 + 2, section4Y + 12);

    // Section 5: Total
    const section5Height = 15;
    const section5Y = section4Y + section4Height;
    drawBorder(margin, section5Y, pageWidth - 2 * margin, section5Height);
    doc.line(margin + halfWidth, section5Y, margin + halfWidth, section5Y + section5Height); // Vertical line
    doc.line(margin + halfWidth + halfWidth / 2, section5Y, margin + halfWidth + halfWidth / 2, section5Y + section5Height); // Vertical line for Price/Total

    doc.setFontSize(10);
    doc.text('Total', margin + 2, section5Y + 8);
    doc.setFontSize(12);
    doc.text(`INR ${shipmentData.amount_declared || 'N/A'}`, margin + halfWidth + 2, section5Y + 8);
    doc.text(`INR ${shipmentData.amount_declared || 'N/A'}`, margin + halfWidth + halfWidth / 2 + 2, section5Y + 8);

    // Section 6: Barcode 2 & Return Address
    const section6Height = pageHeight - (section5Y + section5Height) - margin;
    const section6Y = section5Y + section5Height;
    drawBorder(margin, section6Y, pageWidth - 2 * margin, section6Height);

    const barcode2Value = shipmentData.booking_number || 'N/A';
    let canvas2 = document.createElement('canvas');
    JsBarcode(canvas2, barcode2Value, {
        format: "CODE128",
        displayValue: false,
        width: 1.5,
        height: 20,
        margin: 0
    });
    doc.addImage(canvas2.toDataURL('image/png'), 'PNG', margin + 10, section6Y + 2, pageWidth - 2 * margin - 20, 15);
    doc.setFontSize(8);
    doc.text(barcode2Value, pageWidth / 2, section6Y + 17, { align: 'center' });

    doc.setFontSize(9);
    addText(`Return Address: ${shipmentData.return_address || 'N/A'}`, margin + 2, section6Y + section6Height - 12, pageWidth - 2 * margin - 4);

    return doc;
};

export default generateShipmentLabel; 