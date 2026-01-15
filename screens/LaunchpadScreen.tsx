
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Users, Receipt, FileText } from 'lucide-react';
import { useTranslation } from '../services/i18n';

interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  theme: string;
  active?: boolean;
  onClick?: () => void;
  comingSoonText: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, icon, theme, active, onClick, comingSoonText }) => {
  const { isAr } = useTranslation();
  return (
    <button
      onClick={onClick}
      disabled={!active}
      className={`relative group h-64 p-8 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center text-center space-y-4 bg-white border-gray-100 ${
        active 
          ? `shadow-xl hover:shadow-2xl hover:-translate-y-2 cursor-pointer` 
          : `cursor-not-allowed shadow-sm opacity-60`
      }`}
    >
      <div className={`p-6 rounded-2xl transition-all duration-500 ${theme} ${active ? 'group-hover:scale-110 shadow-lg' : 'shadow-sm'}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
        {!active && (
          <span className="mt-2 inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
            {comingSoonText}
          </span>
        )}
      </div>
      {active && (
        <div className={`absolute top-6 right-6 w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]`} />
      )}
    </button>
  );
};

export const LaunchpadScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t, isAr } = useTranslation();

  return (
    <div className={`h-full flex flex-col items-center justify-center max-w-5xl mx-auto py-10 px-6 ${isAr ? 'font-arabic' : ''}`}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tighter italic leading-none">{t.launchpad.title}</h1>
        <p className="text-gray-500 mt-4 font-medium">{t.launchpad.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <ModuleCard
          title={t.launchpad.fleet}
          icon={<Truck size={40} strokeWidth={2.5} />}
          theme="bg-amber-500 text-slate-900"
          active
          onClick={() => navigate('/app/map')}
          comingSoonText={t.common.comingSoon}
        />
        <ModuleCard
          title={t.launchpad.teams}
          icon={<Users size={40} strokeWidth={2.5} />}
          theme="bg-emerald-500 text-white"
          active
          onClick={() => navigate('/app/teams/dashboard')}
          comingSoonText={t.common.comingSoon}
        />
        <ModuleCard
          title={t.launchpad.billing}
          icon={<Receipt size={40} strokeWidth={2.5} />}
          theme="bg-sky-500 text-white"
          active
          onClick={() => navigate('/app/billing/dashboard')}
          comingSoonText={t.common.comingSoon}
        />
        <ModuleCard
          title={t.launchpad.tenders}
          icon={<FileText size={40} strokeWidth={2.5} />}
          theme="bg-indigo-500 text-white"
          active
          onClick={() => navigate('/app/tenders/dashboard')}
          comingSoonText={t.common.comingSoon}
        />
      </div>

      <div className="mt-16 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
          {t.common.vLabel}
        </p>
      </div>
    </div>
  );
};
