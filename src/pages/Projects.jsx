import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Film, PlayCircle, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_URL}/projects`);
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-agri-light px-4 relative overflow-hidden font-sans">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C49E40]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#213E20]/5 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
             <Film className="text-[#C49E40]" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-agri-dark uppercase tracking-tight mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C49E40] to-[#b38f3a]">Projects</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            Explore our portfolio of cutting-edge vertical farming implementations and technological innovations across various facilities.
          </p>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C49E40] border-t-transparent"></div>
           </div>
        ) : projects.length === 0 ? (
           <div className="bg-white/60 backdrop-blur-md border border-white rounded-[2rem] p-16 text-center max-w-3xl mx-auto shadow-sm">
              <Film className="text-gray-300 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Available</h3>
              <p className="text-gray-500">Check back later for exciting video showcases of our vertical farms.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((project) => (
              <div 
                key={project._id} 
                className="group bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Video Container */}
                <div className="relative aspect-video bg-black overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  <video 
                    src={project.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    controlsList="nodownload"
                    poster="" 
                  />
                  {/* Custom play overlay effect (optional, native controls handle playing) */}
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                     <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                       <Calendar size={14} className="text-[#C49E40]" />
                       {new Date(project.createdAt).toLocaleDateString()}
                     </span>
                     {project.clientName && (
                       <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                         <User size={14} className="text-[#C49E40]" />
                         {project.clientName}
                       </span>
                     )}
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-4 line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed font-medium line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
