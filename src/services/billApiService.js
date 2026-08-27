const BILL_API_BASE_URL = import.meta.env.VITE_BILL_API_URL || 'http://localhost:8000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const createUtilityBill = async (data) => {
    const response = await fetch(`${BILL_API_BASE_URL}/api/bills/utility`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to create utility bill');
    }
    return response.json();
};

export const getUtilityBills = async () => {
    const response = await fetch(`${BILL_API_BASE_URL}/api/bills/utility`, {
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch utility bills');
    return response.json();
};

export const createHarvestBill = async (data) => {
    const response = await fetch(`${BILL_API_BASE_URL}/api/bills/harvest`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to create harvest bill');
    }
    return response.json();
};

export const getHarvestBills = async () => {
    const response = await fetch(`${BILL_API_BASE_URL}/api/bills/harvest`, {
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch harvest bills');
    return response.json();
};

export const getUnits = async () => {
    const response = await fetch(`${BILL_API_BASE_URL}/api/bills/units`, {
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch units');
    return response.json();
};

// Generic function to handle PDF download
export const downloadBillPdf = async (type, id, invoiceNumber) => {
    const response = await fetch(`${BILL_API_BASE_URL}/api/bills/${type}/${id}/pdf`, {
        headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to download PDF');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoiceNumber || 'bill'}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};
