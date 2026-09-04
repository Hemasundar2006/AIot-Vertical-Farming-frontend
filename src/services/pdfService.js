import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { logoBase64 } from '../assets/logoBase64';

export const generateBillPdf = (billData) => {
  const doc = new jsPDF();
  
  // Define colors
  const primaryColor = [196, 158, 64]; // #C49E40
  const darkColor = [33, 62, 32]; // #213E20
  
  // Header
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("AGRINEX", 14, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Smart Vertical Farming", 14, 32);
  
  // Invoice Title
  doc.setTextColor(...primaryColor);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 150, 25);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Invoice Details
  const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  const date = new Date().toLocaleDateString();
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice Details:", 14, 55);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No: ${invoiceNumber}`, 14, 62);
  doc.text(`Date: ${date}`, 14, 69);
  doc.text(`Period: ${billData.month}/${billData.year}`, 14, 76);
  
  // Bill To
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 120, 55);
  doc.setFont("helvetica", "normal");
  doc.text(`Email: ${billData.userEmail}`, 120, 62);
  doc.text(`Type: ${billData.type.charAt(0).toUpperCase() + billData.type.slice(1)} Bill`, 120, 69);
  doc.text(`Status: ${billData.status.toUpperCase()}`, 120, 76);
  
  // Items Table
  let yPos = 95;
  
  const tableData = [
    [
      "1", 
      `${billData.type.charAt(0).toUpperCase() + billData.type.slice(1)} Charges for ${billData.month}/${billData.year}`, 
      `₹${Number(billData.amount).toFixed(2)}`
    ]
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [['#', 'Description', 'Total Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255 },
    styles: { font: 'helvetica', fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 120 },
      2: { halign: 'right' }
    }
  });
  
  const finalY = doc.lastAutoTable.finalY + 15;
  
  // Total
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Total Due:", 120, finalY);
  doc.text(`₹${Number(billData.amount).toFixed(2)}`, 175, finalY, { align: 'right' });
  
  // Footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Thank you for your business!", 105, 270, { align: 'center' });
  doc.text("For any queries, please contact support@agrinex.com", 105, 275, { align: 'center' });
  
  // Return as Blob/File
  const blob = doc.output('blob');
  return new File([blob], `${invoiceNumber}.pdf`, { type: 'application/pdf' });
};

export const generateSettlementPDFBase64 = (data) => {
  return new Promise((resolve, reject) => {
  const adjustedPool = Math.max(0, data.grossRevenue - data.monthlyServiceFee);
  const soilReserve = adjustedPool * 0.10;
  const platformMargin = adjustedPool * 0.10;
  const clientPayout = adjustedPool * 0.80;
  
  // Clean up statement ID in case backend sends raw template strings or missing data
  let finalId = data.statementId;
  if (!finalId || finalId.includes('$')) {
    if (data._id || data.id) {
      finalId = `STM-${(data._id || data.id).slice(-6).toUpperCase()}`;
    } else {
      finalId = `STM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const svgString = `
    <svg id="statement-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1020" width="800" height="1020" style="background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      
      <!-- Outer Border -->
      <rect x="1" y="1" width="798" height="1018" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="2" />

      <!-- HEADER -->
      <g transform="translate(60, 60)">
        <image href="${logoBase64}" x="265" y="-20" width="150" height="60" />
        <text x="340" y="55" text-anchor="middle" font-size="11" font-weight="700" fill="#6b7280" letter-spacing="1.5">HARVEST SETTLEMENT &amp; PAYOUT STATEMENT</text>

        <rect x="560" y="5" width="120" height="30" rx="15" fill="#dcfce7" />
        <circle cx="576" cy="20" r="4" fill="#15803d" />
        <text x="588" y="24" font-size="12" font-weight="700" fill="#15803d">Status: Settled</text>

        <line x1="0" y1="70" x2="680" y2="70" stroke="#15803d" stroke-width="2.5" />
      </g>

      <!-- METADATA BOX -->
      <g transform="translate(60, 145)">
        <rect x="0" y="0" width="680" height="105" rx="10" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" />
        <line x1="340" y1="12" x2="340" y2="93" stroke="#e5e7eb" stroke-width="1" />

        <text x="20" y="28" font-size="12" fill="#6b7280" font-weight="600">Statement ID:</text>
        <text x="120" y="28" font-size="12" fill="#111827" font-weight="700" font-family="monospace">${finalId}</text>

        <text x="20" y="50" font-size="12" fill="#6b7280" font-weight="600">Statement Date:</text>
        <text x="120" y="50" font-size="12" fill="#111827" font-weight="500">${formatDate(data.statementDate)}</text>

        <text x="20" y="72" font-size="12" fill="#6b7280" font-weight="600">Cycle Period:</text>
        <text x="120" y="72" font-size="12" fill="#111827" font-weight="500">Full Cycle</text>

        <text x="20" y="94" font-size="12" fill="#6b7280" font-weight="600">Billing Cycle:</text>
        <text x="120" y="94" font-size="12" fill="#111827" font-weight="500">Cycle #1</text>

        <text x="360" y="28" font-size="12" fill="#6b7280" font-weight="600">Landowner:</text>
        <text x="455" y="28" font-size="12" fill="#111827" font-weight="700">${data.clientName || 'N/A'}</text>

        <text x="360" y="50" font-size="12" fill="#6b7280" font-weight="600">Plot Number:</text>
        <text x="455" y="50" font-size="12" fill="#111827" font-weight="500">${data.plotNumber || 'N/A'}</text>

        <text x="360" y="72" font-size="12" fill="#6b7280" font-weight="600">Crop Type:</text>
        <text x="455" y="72" font-size="12" fill="#111827" font-weight="500">${data.cropName || 'N/A'}</text>

        <text x="360" y="94" font-size="12" fill="#6b7280" font-weight="600">Harvest Date:</text>
        <text x="455" y="94" font-size="12" fill="#111827" font-weight="500">${formatDate(data.harvestDate)}</text>
      </g>

      <!-- SECTION 1: REVENUE -->
      <g transform="translate(60, 275)">
        <text x="0" y="0" font-size="11" font-weight="800" fill="#6b7280" letter-spacing="1">1. HARVEST &amp; GROSS REVENUE</text>
        <rect x="0" y="10" width="680" height="105" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
        
        <rect x="0" y="10" width="680" height="35" rx="8" fill="#f9fafb" />
        <text x="20" y="32" font-size="13" fill="#4b5563">Total Yield Harvested (Est.)</text>
        <text x="660" y="32" font-size="13" fill="#111827" font-weight="600" text-anchor="end">${data.yieldKg || '--'} kg</text>
        <line x1="0" y1="45" x2="680" y2="45" stroke="#e5e7eb" stroke-width="1" />

        <text x="20" y="67" font-size="13" fill="#4b5563">Market Selling Rate (Average)</text>
        <text x="660" y="67" font-size="13" fill="#111827" font-weight="600" text-anchor="end">₹${data.marketRate || '--'} / kg</text>
        <line x1="0" y1="80" x2="680" y2="80" stroke="#e5e7eb" stroke-width="1" />

        <text x="20" y="102" font-size="13" fill="#111827" font-weight="700">Gross Market Revenue</text>
        <text x="660" y="102" font-size="14" fill="#111827" font-weight="800" text-anchor="end">₹${Number(data.grossRevenue || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</text>
      </g>

      <!-- SECTION 2: DEDUCTIONS -->
      <g transform="translate(60, 410)">
        <text x="0" y="0" font-size="11" font-weight="800" fill="#6b7280" letter-spacing="1">2. DEDUCTIONS &amp; OPERATIONAL EXPENSES</text>
        <rect x="0" y="10" width="680" height="85" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
        
        <text x="20" y="33" font-size="13" fill="#374151" font-weight="500">Current Month Maintenance / Service Fee</text>
        <text x="20" y="47" font-size="11" fill="#9ca3af">Covers site security, cloud management, watchman</text>
        <text x="660" y="38" font-size="13" fill="#dc2626" font-weight="700" text-anchor="end">- ₹${Number(data.monthlyServiceFee || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</text>
        <line x1="0" y1="58" x2="680" y2="58" stroke="#e5e7eb" stroke-width="1" />

        <rect x="0" y="58" width="680" height="37" fill="#f0fdf4" />
        <text x="20" y="81" font-size="13" fill="#166534" font-weight="800">ADJUSTED NET PROFIT POOL</text>
        <text x="660" y="81" font-size="14" fill="#166534" font-weight="800" text-anchor="end">₹${adjustedPool.toLocaleString('en-IN', {minimumFractionDigits: 2})}</text>
      </g>

      <!-- SECTION 3: PROFIT ALLOCATION -->
      <g transform="translate(60, 525)">
        <text x="0" y="0" font-size="11" font-weight="800" fill="#6b7280" letter-spacing="1">3. PROFIT ALLOCATION &amp; PAYOUT BREAKDOWN</text>
        <rect x="0" y="10" width="680" height="150" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
        
        <text x="20" y="33" font-size="13" fill="#374151" font-weight="600">Next Cycle Input &amp; Soil Reserve (10%)</text>
        <text x="20" y="47" font-size="11" fill="#9ca3af">Retained for soil treatment, fertilizers, and new seeds</text>
        <text x="660" y="38" font-size="13" fill="#111827" font-weight="700" text-anchor="end">₹${soilReserve.toLocaleString('en-IN', {minimumFractionDigits: 2})}</text>
        <line x1="0" y1="58" x2="680" y2="58" stroke="#e5e7eb" stroke-width="1" />

        <text x="20" y="78" font-size="13" fill="#374151" font-weight="600">Platform Operational Margin (10%)</text>
        <text x="20" y="92" font-size="11" fill="#9ca3af">Farm administration &amp; operational fee</text>
        <text x="660" y="83" font-size="13" fill="#111827" font-weight="700" text-anchor="end">₹${platformMargin.toLocaleString('en-IN', {minimumFractionDigits: 2})}</text>

        <rect x="0" y="105" width="680" height="55" fill="#15803d" />
        <text x="20" y="137" font-size="14" fill="#ffffff" font-weight="800" letter-spacing="0.5">NET CLIENT PAYOUT (80%)</text>
        <text x="660" y="139" font-size="18" fill="#ffffff" font-weight="800" text-anchor="end">₹${clientPayout.toLocaleString('en-IN', {minimumFractionDigits: 2})}</text>
      </g>

      <!-- PAYOUT SUMMARY -->
      <g transform="translate(60, 705)">
        <rect x="0" y="0" width="680" height="65" rx="8" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1" />
        <text x="20" y="26" font-size="10" font-weight="700" fill="#9ca3af" letter-spacing="0.5">DISBURSEMENT MODE</text>
        <text x="20" y="46" font-size="13" font-weight="600" fill="#1f2937">Direct Bank Transfer (NEFT/IMPS)</text>
        <text x="660" y="26" font-size="10" font-weight="700" fill="#9ca3af" letter-spacing="0.5" text-anchor="end">TOTAL AMOUNT PAYABLE</text>
        <text x="660" y="48" font-size="16" font-weight="800" fill="#15803d" text-anchor="end">₹${clientPayout.toLocaleString('en-IN', {minimumFractionDigits: 2})}</text>
      </g>

      <!-- PROMOTION & BRANDING -->
      <g transform="translate(60, 785)">
        <rect x="0" y="0" width="680" height="60" rx="10" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5" />
        <rect x="15" y="10" width="135" height="20" rx="10" fill="#15803d" />
        <text x="82" y="24" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">GROW WITH AGRINEX</text>
        <text x="165" y="24" font-size="12" font-weight="700" fill="#14532d">Expand Your Farm Portfolio &amp; Earn Higher Yields</text>
        <text x="15" y="47" font-size="11" font-weight="500" fill="#166534">Re-invest your harvest returns into new aeroponic &amp; hydroponic zones or refer partners for exclusive dividend rewards.</text>
      </g>

      <!-- FOOTER -->
      <g transform="translate(60, 865)">
        <line x1="0" y1="0" x2="680" y2="0" stroke="#e5e7eb" stroke-width="1" />
        <text x="340" y="22" font-size="11" fill="#9ca3af" text-anchor="middle">Thank you for partnering with AgriNex Smart Vertical Farming.</text>
        <text x="340" y="38" font-size="11" fill="#9ca3af" text-anchor="middle">For queries regarding this statement, please contact support@agrinex.com | www.agrinex.com</text>
      </g>
    </svg>
  `;

  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const URL = window.URL || window.webkitURL || window;
  const blobURL = URL.createObjectURL(svgBlob);

  const image = new Image();
  image.onload = () => {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = 800 * scale;
    canvas.height = 1020 * scale;
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [800, 1020]
    });
    pdf.addImage(imgData, 'JPEG', 0, 0, 800, 1020);
    
    const base64PDF = pdf.output('datauristring');
    resolve({ pdf, finalId, base64PDF });
    
    URL.revokeObjectURL(blobURL);
  };
  image.onerror = reject;
  image.src = blobURL;
  });
};

export const downloadSettlementPDF = (data) => {
  generateSettlementPDFBase64(data).then(({ pdf, finalId }) => {
    pdf.save(`Settlement_${finalId}.pdf`);
  }).catch(err => {
    console.error("Error generating PDF:", err);
  });
};
