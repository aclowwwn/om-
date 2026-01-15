
import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar, BarChart, Clock } from 'lucide-react';

export const TeamsReportsScreen: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Intelligence Reports</h1>
          <p className="text-sm text-gray-500">Operational Performance Insights</p>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Completion Rate', value: '88%', icon: BarChart, color: 'text-blue-600 bg-blue-50' },
          { label: 'Avg Shift Duration', value: '7.8h', icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Late Starts', value: '3', icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
          { label: 'Total Man-Hours', value: '1,240h', icon: Users, color: 'text-purple-600 bg-purple-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setReportType('daily')}
            className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${reportType === 'daily' ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/20' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Daily Operations
          </button>
          <button 
            onClick={() => setReportType('weekly')}
            className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${reportType === 'weekly' ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/20' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Weekly Summary
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-1 space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Date Range</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium" />
                </div>
             </div>
             <div className="flex-1 space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Project Filter</label>
                <div className="relative">
                  <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium appearance-none">
                    <option>All Projects</option>
                  </select>
                </div>
             </div>
             <div className="sm:w-32 flex items-end pb-0.5">
               <button className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest">Generate</button>
             </div>
          </div>

          <div className="border border-dashed border-gray-200 rounded-2xl py-20 flex flex-col items-center justify-center text-gray-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="font-bold">Select parameters and generate report preview.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fixed: Made className optional to prevent compilation errors when used in loops without explicit className
const AlertCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

// Fixed: Made className optional to prevent compilation errors when used in loops without explicit className
const Users = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
