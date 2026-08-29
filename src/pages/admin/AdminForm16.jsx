import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FileText, Trash2, Download, Upload } from 'lucide-react';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminForm16 = () => {
  const [form16s, setForm16s] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ userEmail: '', financialYear: '2023-2024' });
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchForm16s = async () => {
    try {
      const token = localStorage.getItem('farm_token');
      const res = await axios.get(`${API_URL}/admin/form16`, { headers: { Authorization: `Bearer ${token}` } });
      setForm16s(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch Form 16 documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchForm16s(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      const token = localStorage.getItem('farm_token');
      await axios.delete(`${API_URL}/admin/form16/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Document deleted');
      fetchForm16s();
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }
    setIsUploading(true);
    
    const data = new FormData();
    data.append('file', file);
    data.append('userEmail', formData.userEmail);
    data.append('financialYear', formData.financialYear);

    try {
      const token = localStorage.getItem('farm_token');
      await axios.post(`${API_URL}/admin/form16`, data, { 
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } 
      });
      toast.success('Form 16 uploaded successfully!');
      setFormData({ userEmail: '', financialYear: '2023-2024' });
      setFile(null);
      fetchForm16s();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 rounded-xl text-[#C49E40]">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Upload Form 16</h3>
            <p className="text-sm text-gray-500">Distribute tax documents securely.</p>
          </div>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="email" required placeholder="User Email" value={formData.userEmail} onChange={(e) => setFormData({...formData, userEmail: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
            <select value={formData.financialYear} onChange={(e) => setFormData({...formData, financialYear: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40]">
              <option value="2022-2023">2022-2023</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('f16pdf').click()}>
            <span className="text-sm font-medium text-gray-600">{file ? file.name : 'Select PDF File'}</span>
            <input type="file" id="f16pdf" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <button type="submit" disabled={isUploading} className="px-6 py-3 bg-[#C49E40] text-white font-bold rounded-xl hover:bg-[#b38f3a] disabled:opacity-50 transition-colors">
            {isUploading ? 'Uploading...' : 'Upload Form 16'}
          </button>
        </form>
      </div>

      {/* List */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-4">Uploaded Documents</h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-sm md:text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Financial Year</th>
                <th className="px-6 py-4">Uploaded</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {form16s.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(doc => (
                <tr key={doc._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{doc.userId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">{doc.financialYear}</td>
                  <td className="px-6 py-4">{new Date(doc.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <a href={doc.cloudinaryUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
                      <Download size={18} />
                    </a>
                    <button onClick={() => handleDelete(doc._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {form16s.length === 0 && <tr><td colSpan="4" className="px-6 py-4 text-center">No Form 16 documents found.</td></tr>}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage} 
            totalPages={Math.ceil(form16s.length / itemsPerPage)} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminForm16;
