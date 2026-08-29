import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FileText, Trash2, Download, DollarSign, Plus } from 'lucide-react';
import { generateBillPdf } from '../../services/pdfService';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminBills = () => {
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [billData, setBillData] = useState({ 
    userId: '', 
    type: 'utility', 
    amount: '', 
    status: 'pending', 
    month: new Date().getMonth() + 1, 
    year: new Date().getFullYear() 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBillsAndUsers = async () => {
    try {
      const token = localStorage.getItem('farm_token');
      const [billsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/bills`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const bData = billsRes.data.data || billsRes.data;
      setBills(Array.isArray(bData) ? bData : []);
      
      const uData = usersRes.data.data || usersRes.data;
      setUsers(Array.isArray(uData) ? uData : []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBillsAndUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    try {
      const token = localStorage.getItem('farm_token');
      await axios.delete(`${API_URL}/admin/bills/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Bill deleted');
      fetchBillsAndUsers();
    } catch (error) {
      toast.error('Failed to delete bill');
    }
  };

  const handleBillGenerate = async (e) => {
    e.preventDefault();
    if (!billData.userId || !billData.amount) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Find the user to get their email for the PDF
      const selectedUser = users.find(u => u._id === billData.userId);
      if (!selectedUser) throw new Error("User not found");
      
      const billDataForPdf = {
        ...billData,
        userEmail: selectedUser.email
      };
      
      // 1. Generate PDF Blob
      const pdfFile = generateBillPdf(billDataForPdf);
      
      // 2. Upload via FormData
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('userId', billData.userId);
      formData.append('amount', billData.amount);
      formData.append('month', billData.month);
      formData.append('year', billData.year);
      formData.append('status', billData.status);
      formData.append('type', billData.type); // Optional if backend supports type

      const token = localStorage.getItem('farm_token');
      await axios.post(`${API_URL}/admin/bills`, formData, { 
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } 
      });
      
      toast.success('Bill generated and uploaded successfully!');
      setBillData({ ...billData, amount: '', userId: '' });
      fetchBillsAndUsers();
    } catch (error) {
      console.error(error);
      const isNetworkError = !error.response;
      toast.error(isNetworkError ? 'Network Error: Backend might be asleep. Please wait 1 minute and try again.' : (error.response?.data?.message || 'Failed to generate bill'));
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Generate Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 rounded-xl text-[#C49E40]">
            <Plus size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Generate New Bill</h3>
            <p className="text-sm text-gray-500">Automatically generate a PDF invoice and send it to the farmer.</p>
          </div>
        </div>

        <form onSubmit={handleBillGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
               <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Farmer</label>
               <select required value={billData.userId} onChange={(e) => setBillData({...billData, userId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]">
                 <option value="">-- Choose User --</option>
                 {users.map(u => (
                   <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                 ))}
               </select>
            </div>
            
            <div>
               <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bill Type</label>
               <select value={billData.type} onChange={(e) => setBillData({...billData, type: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]">
                 <option value="utility">Utility</option>
                 <option value="harvest">Harvest</option>
               </select>
            </div>

            <div>
               <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount (₹)</label>
               <input type="number" min="0" step="0.01" required placeholder="0.00" value={billData.amount} onChange={(e) => setBillData({...billData, amount: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
            </div>
            
            <div>
               <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
               <select value={billData.status} onChange={(e) => setBillData({...billData, status: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]">
                 <option value="pending">Pending</option>
                 <option value="paid">Paid</option>
               </select>
            </div>

            <div className="flex gap-2 md:col-span-2">
              <div className="flex-1">
                 <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Month (1-12)</label>
                 <input type="number" min="1" max="12" required value={billData.month} onChange={(e) => setBillData({...billData, month: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40]" />
              </div>
              <div className="flex-1">
                 <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Year</label>
                 <input type="number" required value={billData.year} onChange={(e) => setBillData({...billData, year: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40]" />
              </div>
            </div>

          </div>

          <button type="submit" disabled={isGenerating} className="px-6 py-3 mt-2 bg-[#C49E40] text-white font-bold rounded-xl hover:bg-[#b38f3a] disabled:opacity-50 transition-colors flex items-center gap-2">
            {isGenerating ? 'Generating PDF & Uploading...' : <><FileText size={18} /> Generate & Save Bill</>}
          </button>
        </form>
      </div>

      {/* Bills List */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-4">Generated Bills</h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-sm md:text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Farmer</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(bill => (
                <tr key={bill._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{bill.userId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">{bill.month}/{bill.year}</td>
                  <td className="px-6 py-4">₹{bill.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm md:text-xs font-bold ${bill.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <a href={bill.cloudinaryUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700" title="Download PDF">
                      <Download size={18} />
                    </a>
                    <button onClick={() => handleDelete(bill._id)} className="text-red-500 hover:text-red-700" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {bills.length === 0 && <tr><td colSpan="5" className="px-6 py-4 text-center">No bills found.</td></tr>}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage} 
            totalPages={Math.ceil(bills.length / itemsPerPage)} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminBills;
