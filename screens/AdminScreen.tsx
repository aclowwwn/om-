
import React, { useState } from 'react';
import { Database, Link as LinkIcon, RefreshCw, CheckCircle } from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('Sync completed successfully');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Administration</h1>
        <p className="text-sm text-gray-500">Provider Linkages & Integration Controls</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 text-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <Database size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Telematics Hub A</h3>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                  Connected
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Sync Active</span>
          </div>
          <div className="space-y-2 text-xs text-gray-500">
            <p className="font-medium">Endpoint: <code className="bg-gray-50 px-1 rounded">SALALAH-HUB-PROD.v1</code></p>
            <p className="font-medium">Verification Status: 42/45 Verified</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSync}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm"
              disabled={syncing}
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'UPDATING...' : 'FORCE SYNC'}
            </button>
            <button className="px-4 py-2 bg-slate-900 text-amber-500 rounded-xl hover:bg-black text-xs font-bold uppercase tracking-widest transition-all">CONFIGURE</button>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 border-2 border-white shadow-sm">
            <LinkIcon size={32} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Expand Network</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mt-2 leading-relaxed">Connect additional CAT, Komatsu, or 3rd-party telematic providers to the operational hub.</p>
          </div>
          <button className="px-6 py-3 border-2 border-amber-500 text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-all uppercase text-[10px] tracking-widest">
            INITIALIZE LINK
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Intelligence Matrix</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Predictive neural monitoring tracks fleet behavior patterns to neutralize maintenance risks and cycle debt before failure occurs.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold bg-amber-500 text-slate-900 w-fit px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
            <CheckCircle size={16} /> Diagnostic Hub Optimized
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/5 to-transparent flex items-center justify-center pointer-events-none">
           <Database size={240} className="opacity-5 -mr-20 text-white" />
        </div>
      </div>
    </div>
  );
};
