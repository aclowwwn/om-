
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

export const translations = {
  en: {
    common: {
      logout: 'Logout',
      search: 'Search...',
      loading: 'Loading...',
      actions: 'Actions',
      status: 'Status',
      date: 'Date',
      cancel: 'Cancel',
      save: 'Save',
      back: 'Back',
      viewAll: 'View All',
      switchApps: 'Switch Apps',
      unifiedHub: 'om& Unified Hub',
      fleetTrack: 'FleetTrack AI',
      siteOps: 'SiteOps Tactical',
      financeCore: 'Finance Core',
      procureWise: 'ProcureWise',
      comingSoon: 'Coming Soon',
      vLabel: 'om& Unified Intelligence • V0.1 • Salalah Hub'
    },
    login: {
      title: 'Operations Management & More',
      email: 'Email address',
      password: 'Password',
      signIn: 'Sign In',
      initializing: 'Initializing...',
      placeholderEmail: 'operator@om-and.dev',
      footer: 'Built by com&.\nSalalah Regional Hub.',
      error: 'An unexpected error occurred.',
      langSwitch: 'العربية'
    },
    nav: {
      dashboard: 'Dashboard',
      map: 'Map',
      fleet: 'Fleet',
      maintenance: 'Maintenance',
      alerts: 'Alerts',
      admin: 'Admin',
      dailyPlan: 'Daily Plan',
      projects: 'Projects',
      teams: 'Teams',
      reports: 'Reports',
      invoices: 'Invoices',
      payments: 'Payments',
      audit: 'Audit Trail',
      marketplace: 'Marketplace',
      myBids: 'My Bids',
      contracts: 'Contracts'
    },
    launchpad: {
      title: 'Operational Hub',
      subtitle: '',
      fleet: 'Fleet Management',
      teams: 'Teams Management',
      billing: 'Billing & Invoices',
      tenders: 'Tenders & Contracts'
    },
    billing: {
      dashboard: 'Finance Dashboard',
      subtitle: 'Revenue & Accounts Receivable Monitoring',
      newInvoice: 'New Invoice',
      totalBilled: 'Total Billed (MTD)',
      pending: 'Pending Collections',
      overdue: 'Overdue Balance',
      recent: 'Recent Invoices'
    },
    tenders: {
      dashboard: 'Tendering & Procurement',
      subtitle: 'Strategic Growth & Contract Management',
      activeContracts: 'Active Contracts',
      openOpps: 'Open Opportunities',
      activeBids: 'Active Bids',
      awards: 'Awards (YTD)',
      available: 'Available Tenders',
      intelligence: 'ProcureWise Intelligence'
    }
  },
  ar: {
    common: {
      logout: 'تسجيل الخروج',
      search: 'بحث...',
      loading: 'جاري التحميل...',
      actions: 'الإجراءات',
      status: 'الحالة',
      date: 'التاريخ',
      cancel: 'إلغاء',
      save: 'حفظ',
      back: 'رجوع',
      viewAll: 'عرض الكل',
      switchApps: 'تبديل التطبيقات',
      unifiedHub: 'om& المركز الموحد',
      fleetTrack: 'تتبع الأسطول بالذكاء الاصطناعي',
      siteOps: 'عمليات الموقع التكتيكية',
      financeCore: 'الأساس المالي',
      procureWise: 'بروكيور وايز',
      comingSoon: 'قريباً',
      vLabel: 'om& الذكاء الموحد • إصدار 0.1 • مركز صلالة'
    },
    login: {
      title: 'إدارة العمليات وأكثر',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signIn: 'تسجيل الدخول',
      initializing: 'جاري التحميل...',
      placeholderEmail: 'operator@om-and.dev',
      footer: 'بناء متقن. جاهز للعمليات.\nمركز صلالة الإقليمي.',
      error: 'حدث خطأ غير متوقع.',
      langSwitch: 'English'
    },
    nav: {
      dashboard: 'لوحة القيادة',
      map: 'الخريطة',
      fleet: 'الأسطول',
      maintenance: 'الصيانة',
      alerts: 'التنبيهات',
      admin: 'الإدارة',
      dailyPlan: 'الخطة اليومية',
      projects: 'المشاريع',
      teams: 'الفرق',
      reports: 'التقارير',
      invoices: 'الفواتير',
      payments: 'المدفوعات',
      audit: 'سجل التدقيق',
      marketplace: 'السوق',
      myBids: 'عروض أسعاري',
      contracts: 'العقود'
    },
    launchpad: {
      title: 'مركز العمليات',
      subtitle: '',
      fleet: 'إدارة الأسطول',
      teams: 'إدارة الفرق',
      billing: 'الفواتير والحسابات',
      tenders: 'المناقصات والعقود'
    },
    billing: {
      dashboard: 'لوحة التحكم المالية',
      subtitle: 'مراقبة الإيرادات والحسابات المدينة',
      newInvoice: 'فاتورة جديدة',
      totalBilled: 'إجمالي الفواتير (شهرياً)',
      pending: 'التحصيلات المعلقة',
      overdue: 'الرصيد المتأخر',
      recent: 'الفواتير الأخيرة'
    },
    tenders: {
      dashboard: 'المناقصات والمشتريات',
      subtitle: 'النمو الاستراتيجي وإدارة العقود',
      activeContracts: 'العقود النشطة',
      openOpps: 'الفرص المتاحة',
      activeBids: 'العروض النشطة',
      awards: 'الجوائز (السنوية)',
      available: 'المناقصات المتاحة',
      intelligence: 'ذكاء بروكيور وايز'
    }
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
  isAr: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('om_lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('om_lang', newLang);
  };

  const isAr = lang === 'ar';

  useEffect(() => {
    // We explicitly keep dir="ltr" to avoid moving components, but set the lang for accessibility
    document.documentElement.lang = lang;
    document.documentElement.dir = "ltr"; 
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isAr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};
