
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Invoice } from '../../types';
import { Receipt, CreditCard, Clock, AlertCircle, Plus, ChevronRight, FileText } from 'lucide-react';

export const BillingDashboardScreen: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.billing.getInvoices().then(data => {
      setInvoices(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Initializing ledger...</div>;

  const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((acc, inv) => acc + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Finance Dashboard</h1>
          <p className="text-sm text-gray-500">Revenue & Accounts Receivable Monitoring</p>
        </div>
        <button className="px-6 py-2 bg-sky-500 text-white font-bold rounded-xl shadow-lg hover:bg-sky-600 transition-all flex items-center gap-2">
          <Plus size={18} /> New Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Billed (MTD)', value: `$${totalBilled.toLocaleString()}`, icon: CreditCard, color: 'text-sky-600 bg-sky-50' },
          { label: 'Pending Collections', value: `$${pendingAmount.toLocaleString()}`, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Overdue Balance', value: `$${overdueAmount.toLocaleString()}`, icon: AlertCircle, color: 'text-red-600 bg-red-50' }
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
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Recent Invoices</h2>
          <button className="text-xs font-bold text-sky-600 hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-sky-50/20 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-900">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{inv.clientName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                      inv.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-700">${inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{inv.dueDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-sky-100 rounded-lg text-gray-300 group-hover:text-sky-500 transition-all">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
