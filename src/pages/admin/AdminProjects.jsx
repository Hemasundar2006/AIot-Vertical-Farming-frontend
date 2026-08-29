import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Video, Plus, Trash2, Link as LinkIcon, Film } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    isActive: true
  });
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/projects`);
      if (res.data.success) setProjects(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) return toast.error("Video file is required");

    setLoading(true);
    const data = new FormData();
    data.append('file', videoFile);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('clientName', formData.clientName);
    data.append('isActive', formData.isActive);

    try {
      const res = await axios.post(`${API_URL}/admin/projects`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success("Project uploaded successfully");
        setShowModal(false);
        setVideoFile(null);
        setFormData({ title: '', description: '', clientName: '', isActive: true });
        fetchProjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project? The video will be removed.")) return;
    try {
      const res = await axios.delete(`${API_URL}/admin/projects/${id}`);
      if (res.data.success) {
        toast.success("Project deleted");
        fetchProjects();
      }
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Film className="text-[#C49E40]" size={28} />
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">Project Portfolio</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#C49E40] hover:bg-[#b38f3a] text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-md flex items-center gap-2"
        >
          <Plus size={18} /> Upload Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div key={proj._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-black relative">
              <video 
                src={proj.videoUrl} 
                className="w-full h-full object-cover"
                controls
                controlsList="nodownload"
              />
              {!proj.isActive && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-sm md:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Hidden
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-black text-gray-900 mb-1 truncate">{proj.title}</h3>
              {proj.clientName && (
                <p className="text-sm md:text-xs font-bold text-[#C49E40] uppercase tracking-wider mb-3">Client: {proj.clientName}</p>
              )}
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{proj.description}</p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <span className="text-sm md:text-xs text-gray-400 font-medium">
                  {new Date(proj.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(proj._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Film className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Projects Uploaded</h3>
            <p className="text-gray-500 text-sm">Upload your first project video to display it on the website.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-wide">Upload Project</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  required
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#C49E40]/10 file:text-[#C49E40] hover:file:bg-[#C49E40]/20 transition-all cursor-pointer"
                />
                <p className="text-sm md:text-[10px] text-gray-400 mt-2">Max size: 100MB. Supported: MP4, WebM, MOV</p>
              </div>

              <div>
                <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Title</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C49E40] outline-none text-sm font-medium"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Client / Farm Name (Optional)</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C49E40] outline-none text-sm font-medium"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C49E40] outline-none text-sm font-medium resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#C49E40] rounded border-gray-300 focus:ring-[#C49E40]"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-gray-700">Display publicly on website</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-4 bg-[#C49E40] hover:bg-[#b38f3a] text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'Uploading Video (Please Wait)...' : <><Video size={16} /> Upload & Save</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
