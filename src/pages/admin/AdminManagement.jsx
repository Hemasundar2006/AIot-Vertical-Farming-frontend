import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Briefcase, Trash2, Edit, X, ArrowUp, ArrowDown, GraduationCap } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ name: '', designation: '', email: '', phone: '', collegeName: '', description: '', displayOrder: 0, isActive: true });
  const [file, setFile] = useState(null);

  // Edit State
  const [editingProfile, setEditingProfile] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', designation: '', email: '', phone: '', collegeName: '', description: '', displayOrder: 0, isActive: true });
  const [editFile, setEditFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchProfiles = async () => {
    try {
      const res = await axios.get(${API_URL}/admin/management); // Public route for now
      setProfiles(res.data);
    } catch (error) {
      toast.error('Failed to fetch management profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfiles(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      const token = localStorage.getItem('farm_token');
      await axios.delete(${API_URL}/admin/management/, { headers: { Authorization: Bearer  } });
      toast.success('Profile deleted');
      fetchProfiles();
    } catch (error) {
      toast.error('Failed to delete profile');
    }
  };

  const handleReorder = async (index, direction) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    const newProfiles = [...profiles];
    if (direction === 'up' && actualIndex > 0) {
      const temp = newProfiles[actualIndex];
      newProfiles[actualIndex] = newProfiles[actualIndex - 1];
      newProfiles[actualIndex - 1] = temp;
    } else if (direction === 'down' && actualIndex < newProfiles.length - 1) {
      const temp = newProfiles[actualIndex];
      newProfiles[actualIndex] = newProfiles[actualIndex + 1];
      newProfiles[actualIndex + 1] = temp;
    } else {
      return; 
    }

    // Update display orders based on array index
    const orderings = newProfiles.map((p, i) => ({ id: p._id, displayOrder: i }));
    setProfiles(newProfiles);

    try {
      const token = localStorage.getItem('farm_token');
      await axios.put(${API_URL}/admin/management/reorder, { orderings }, { headers: { Authorization: Bearer  } });
      toast.success('Reordered successfully');
    } catch (error) {
      toast.error('Failed to reorder');
      fetchProfiles(); 
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    const data = new FormData();
    if (file) data.append('file', file);
    data.append('name', formData.name);
    data.append('designation', formData.designation);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('collegeName', formData.collegeName);
    data.append('description', formData.description);
    // New items go to the end
    data.append('displayOrder', profiles.length);
    data.append('isActive', formData.isActive);

    try {
      const token = localStorage.getItem('farm_token');
      await axios.post(${API_URL}/admin/management, data, { 
        headers: { Authorization: Bearer , 'Content-Type': 'multipart/form-data' } 
      });
      toast.success('Profile added successfully!');
      setFormData({ name: '', designation: '', email: '', phone: '', collegeName: '', description: '', displayOrder: 0, isActive: true });
      setFile(null);
      fetchProfiles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add profile');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (profile) => {
    setEditingProfile(profile);
    setEditFormData({
      name: profile.name || '',
      designation: profile.designation || '',
      email: profile.email || '',
      phone: profile.phone || '',
      collegeName: profile.collegeName || '',
      description: profile.description || '',
      displayOrder: profile.displayOrder || 0,
      isActive: profile.isActive ?? true
    });
    setEditFile(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    const data = new FormData();
    if (editFile) data.append('file', editFile);
    data.append('name', editFormData.name);
    data.append('designation', editFormData.designation);
    data.append('email', editFormData.email);
    data.append('phone', editFormData.phone);
    data.append('collegeName', editFormData.collegeName);
    data.append('description', editFormData.description);
    data.append('displayOrder', editFormData.displayOrder);
    data.append('isActive', editFormData.isActive);

    try {
      const token = localStorage.getItem('farm_token');
      await axios.put(${API_URL}/admin/management/, data, { 
        headers: { Authorization: Bearer , 'Content-Type': 'multipart/form-data' } 
      });
      toast.success('Profile updated successfully!');
      setEditingProfile(null);
      fetchProfiles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Add Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 rounded-xl text-[#C49E40]">
            <Briefcase size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Add Management Profile</h3>
            <p className="text-sm text-gray-500">Publish a new team member to the About page.</p>
          </div>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40]" />
            <input type="text" required placeholder="Designation" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40]" />
            <input type="text" placeholder="College / University Name" value={formData.collegeName} onChange={(e) => setFormData({...formData, collegeName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40]" />
            <input type="email" required placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40]" />
            <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40]" />
          </div>
          <textarea required placeholder="Biography..." rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40] resize-none" />
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('mfile').click()}>
            <span className="text-sm font-medium text-gray-600">{file ? file.name : 'Select Profile Image'}</span>
            <input type="file" id="mfile" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <button type="submit" disabled={isUploading} className="px-6 py-3 bg-[#C49E40] text-white font-bold rounded-xl hover:bg-[#b38f3a] disabled:opacity-50 transition-colors">
            {isUploading ? 'Publishing...' : 'Publish Profile'}
          </button>
        </form>
      </div>

      {/* Profiles Grid */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-4">Current Team Members</h3>
        
        {profiles.length === 0 ? (
           <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-200 shadow-sm">No profiles found. Add some above!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {profiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((profile, index) => (
              <div key={profile._id} className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow p-6 relative flex flex-col items-center">
                 {/* Reorder Buttons */}
                 <div className="absolute top-4 right-4 flex flex-col gap-1">
                   <button onClick={() => handleReorder(index, 'up')} disabled={(currentPage - 1) * itemsPerPage + index === 0} className={p-1.5 rounded-full }>
                     <ArrowUp size={20}/>
                   </button>
                   <button onClick={() => handleReorder(index, 'down')} disabled={(currentPage - 1) * itemsPerPage + index === profiles.length - 1} className={p-1.5 rounded-full }>
                     <ArrowDown size={20}/>
                   </button>
                 </div>
                 
                 {/* Action Buttons */}
                 <div className="absolute top-4 left-4 flex gap-2">
                   <button onClick={() => handleEditClick(profile)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-full transition-colors" title="Edit"><Edit size={16}/></button>
                   <button onClick={() => handleDelete(profile._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition-colors" title="Delete"><Trash2 size={16}/></button>
                 </div>
                 
                 <div className="mt-4 mb-4">
                   {profile.photoUrl ? (
                     <img src={profile.photoUrl} alt={profile.name} className="w-28 h-28 rounded-full object-cover border-4 border-amber-50 shadow-sm" />
                   ) : (
                     <div className="w-28 h-28 rounded-full bg-amber-100 flex items-center justify-center font-black text-3xl text-amber-600 border-4 border-amber-50 shadow-sm">{profile.name.charAt(0)}</div>
                   )}
                 </div>
                 
                 <h4 className="font-black text-xl text-gray-900 text-center">{profile.name}</h4>
                 <p className="text-[#C49E40] font-bold text-sm text-center mb-2 uppercase tracking-wide">{profile.designation}</p>
                 
                 {profile.collegeName && (
                   <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs font-bold bg-gray-100 px-3 py-1 rounded-full mb-3">
                     <GraduationCap size={14} />
                     <span>{profile.collegeName}</span>
                   </div>
                 )}
                 
                 <p className="text-gray-500 text-xs text-center line-clamp-3 mb-4 flex-1">{profile.description}</p>
                 
                 <div className="w-full bg-gray-50 rounded-xl p-4 text-xs text-gray-600 font-medium">
                   <div className="flex justify-between mb-2">
                     <span className="text-gray-400">Email</span> 
                     <span className="text-gray-900 truncate max-w-[150px]" title={profile.email}>{profile.email || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-400">Phone</span> 
                     <span className="text-gray-900">{profile.phone || 'N/A'}</span>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-wide">Edit Profile</h3>
              <button onClick={() => setEditingProfile(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="editForm" onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" required value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
                  </div>
                  <div>
                    <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Designation</label>
                    <input type="text" required value={editFormData.designation} onChange={(e) => setEditFormData({...editFormData, designation: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">College / University Name</label>
                    <input type="text" value={editFormData.collegeName} onChange={(e) => setEditFormData({...editFormData, collegeName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
                  </div>
                  <div>
                    <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                    <input type="email" required value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
                  </div>
                  <div>
                    <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                    <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Biography</label>
                  <textarea required rows="4" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40] resize-none" />
                </div>
                
                <div>
                  <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Profile Image (Optional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => document.getElementById('editFile').click()}>
                    <span className="text-sm font-medium text-gray-600">{editFile ? editFile.name : 'Upload New Image to Replace Current'}</span>
                    <input type="file" id="editFile" accept="image/*" className="hidden" onChange={(e) => setEditFile(e.target.files[0])} />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button type="button" onClick={() => setEditingProfile(null)} className="flex-1 py-3 text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl font-bold uppercase tracking-wider text-sm transition-colors">
                Cancel
              </button>
              <button form="editForm" type="submit" disabled={isUploading} className="flex-1 py-3 bg-[#C49E40] hover:bg-[#b38f3a] text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-md">
                {isUploading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
