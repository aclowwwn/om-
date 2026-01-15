
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Globe } from 'lucide-react';

type Language = 'en' | 'ar';

const translations = {
  en: {
    title: 'Operations Management and More',
    email: 'Email address',
    password: 'Password',
    signIn: 'Sign In',
    initializing: 'Initializing...',
    placeholderEmail: 'operator@om-and.dev',
    footer: 'Precision Built. Operations Ready.\nSalalah Regional Hub.',
    error: 'An unexpected error occurred.',
    langSwitch: 'العربية'
  },
  ar: {
    title: 'إدارة العمليات وأكثر',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    initializing: 'جاري التحميل...',
    placeholderEmail: 'operator@om-and.dev',
    footer: 'بناء متقن. جاهز للعمليات.\nمركز صلالة الإقليمي.',
    error: 'حدث خطأ غير متوقع.',
    langSwitch: 'English'
  }
};

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const navigate = useNavigate();

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.auth.login(email, password);
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
      {/* Language Switcher */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors border rounded-xl"
      >
        <Globe size={18} />
        {t.langSwitch}
      </button>

      <div className={`w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden p-10 border border-gray-100 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black mx-auto mb-6 shadow-xl shadow-red-200 rotate-3 group-hover:rotate-0 transition-transform">
            om&
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">{t.title}</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">{t.email}</label>
            <input
              type="email"
              className={`w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-red-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium ${isRtl ? 'text-right' : 'text-left'}`}
              placeholder={t.placeholderEmail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">{t.password}</label>
            <input
              type="password"
              className={`w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-red-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium ${isRtl ? 'text-right' : 'text-left'}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-red-200 disabled:opacity-50 active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            {loading ? t.initializing : t.signIn}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-400 font-bold leading-relaxed whitespace-pre-line uppercase tracking-widest">
            {t.footer}
          </p>
        </div>
      </div>
      
      {/* Background Accents */}
      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
    </div>
  );
};
