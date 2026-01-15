
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Tender } from '../../types';
import { Gavel, Target, Briefcase, Award, Clock, ChevronRight, MapPin, Search } from 'lucide-react';
import { useTranslation } from '../../services/i18n';

export const TendersDashboardScreen: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, isAr } = useTranslation();

  useEffect(() => {
    api.tenders.getTenders().then(data => {
      setTenders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className={`p-8 text-center text-gray-500 ${isAr ? 'text-right' : ''}`}>{t.common.loading}</div>;

  return (
    <div className={`space-y-8 ${isAr ? 'text-right' : ''}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t.tenders.dashboard}</h1>
          <p className="text-sm text-gray-500">{t.tenders.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search size={16} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} />
             <input type="text" placeholder={t.common.search} className={`${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500`} />
           </div>
           <button className="px-6 py-2 bg-indigo-500 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all">
             Global Market
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t.tenders.activeContracts, value: '12', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50' },
          { label: t.tenders.openOpps, value: '42', icon: Target, color: 'text-emerald-600 bg-emerald-50' },
          { label: t.tenders.activeBids, value: '3', icon: Gavel, color: 'text-amber-600 bg-amber-50' },
          { label: t.tenders.awards, value: '8', icon: Award, color: 'text-purple-600 bg-purple-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4 ${isAr ? 'ml-auto' : ''}`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">{t.tenders.available}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {tenders.map(tnd => (
                <div key={tnd.id} className="p-6 hover:bg-indigo-50/20 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div className={`space-y-1 ${isAr ? 'text-right' : ''}`}>
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{tnd.referenceNumber}</span>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{tnd.title}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      tnd.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 
                      tnd.status === 'bidding' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {tnd.status}
                    </span>
                  </div>
                  <div className={`flex items-center gap-6 mt-4 ${isAr ? 'flex-row-reverse' : ''}`}>
                     <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                       <MapPin size={14} className="text-gray-400" />
                       {tnd.authority}
                     </div>
                     <div className="flex items-center gap-2 text-xs text-red-500 font-bold">
                       <Clock size={14} />
                       Deadline: {tnd.submissionDeadline}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-2 tracking-tight italic">{t.tenders.intelligence}</h3>
               <p className="text-slate-400 text-xs leading-relaxed mb-6">
                 Analyzing historical award data and competitor behavior to optimize your bid strategy.
               </p>
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                 <div className="flex justify-between text-xs">
                   <span className="text-slate-400">Win Probability</span>
                   <span className="text-emerald-400 font-bold">68%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[68%]" />
                 </div>
               </div>
               <button className="w-full mt-6 py-3 bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20">
                 Run Strategy Analysis
               </button>
             </div>
             <Award size={120} className="absolute -bottom-10 -right-10 text-white/5" />
           </div>
           
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Expiring Contracts</h3>
             <div className="space-y-3">
               <div className="p-3 border rounded-xl flex items-center justify-between group cursor-pointer hover:border-indigo-200">
                  <div>
                    <p className="text-xs font-bold text-gray-700">Oman Rail Ph 1</p>
                    <p className="text-[10px] text-red-500 font-bold">Expires in 12 days</p>
                  </div>
                  <ChevronRight size={16} className={`text-gray-300 group-hover:text-indigo-500 ${isAr ? 'rotate-180' : ''}`} />
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
