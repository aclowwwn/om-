
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Project, Site } from '../../types';
import { Briefcase, MapPin, Plus, ChevronRight } from 'lucide-react';

export const TeamsProjectsScreen: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [pr, si] = await Promise.all([
        api.projects.getAll(),
        api.projects.getSites()
      ]);
      setProjects(pr);
      setSites(si);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Syncing project data...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects & Sites</h1>
          <p className="text-sm text-gray-500">Global Worksite Management</p>
        </div>
        <button className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2">
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Briefcase size={20} className="text-emerald-500" />
                <h2 className="font-bold text-gray-900">{project.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${project.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">{project.clientName}</p>
            </div>
            <div className="p-6">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Assigned Sites</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sites.filter(s => s.projectId === project.id).map(site => (
                  <div key={site.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                        <MapPin size={16} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{site.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                ))}
                <button className="p-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-emerald-500 hover:border-emerald-200 transition-all">
                  <Plus size={16} /> <span className="text-xs font-bold uppercase">Add Site</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
