const BILL_API_BASE_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const getHeaders = () => {
    const token = localStorage.getItem('farm_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// Admins use this to upload a new bill (utility or harvest)
export const createBill = async (data) => {
    const userStr = localStorage.getItem('farm_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const endpoint = user?.role === 'admin' ? '/admin/bills' : '/user/bills';

    const response = await fetch(`${BILL_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create bill');
    }
    return response.json();
};

// Users use this to fetch their own bills
// Admins can use this if we modify it to hit /admin/bills, but for now we'll fetch user bills
export const getBills = async () => {
    // We check role from local storage to decide which endpoint to hit
    const userStr = localStorage.getItem('farm_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const endpoint = user?.role === 'admin' ? '/admin/bills' : '/user/bills';

    const response = await fetch(`${BILL_API_BASE_URL}${endpoint}`, {
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch bills');
    return response.json();
};

// This endpoint doesn't exist yet, but was in original code. Returning empty array for safety.
export const getUnits = async () => {
    return [];
};

export const downloadBillPdf = async (id, invoiceNumber) => {
    // Users download their own bills
    const response = await fetch(`${BILL_API_BASE_URL}/user/bills/${id}/download`, {
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
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
