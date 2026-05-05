import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

interface StatCardProps {
  label: string;
  value: number | string;
  to: string;
  color: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, to, color, icon }) => (
  <Link to={to} className={`card p-6 flex items-center gap-4 hover:shadow-md transition-shadow group`}>
    <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
    <div>
      <div className="text-2xl font-bold text-slate-800 dark:text-white">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{label}</div>
    </div>
  </Link>
);

const Welcome: React.FC = () => {
  const { data: transactions } = useQuery('transactions', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.transactions}`).then((r) => r.data));
  const { data: disputes } = useQuery('disputes', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.disputes}`).then((r) => r.data));
  const { data: merchants } = useQuery('merchants', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.merchants}`).then((r) => r.data));
  const { data: cardholders } = useQuery('cardholders', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.cardholders}`).then((r) => r.data));
  const { data: issuers } = useQuery('issuers', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.issuers}`).then((r) => r.data));
  const { data: settlements } = useQuery('settlements', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.settlements}`).then((r) => r.data));

  const pendingDisputes = disputes?.filter((d: { status: string }) => d.status === 'open' || d.status === 'under_review').length ?? '—';
  const settledTxns = transactions?.filter((t: { status: string }) => t.status === 'settled').length ?? '—';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="card p-8 mb-8 bg-gradient-to-br from-brand-800 to-brand-900 dark:from-brand-900 dark:to-slate-950 text-white border-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">PayFlow Network</h1>
            <p className="text-brand-200 text-lg">Payment Network Operations Platform</p>
            <p className="text-brand-300 text-sm mt-2">
              Monitor transactions, manage disputes, oversee issuer settlements, and maintain merchant relationships — all in one place.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/transactions" className="btn-primary bg-white text-brand-800 hover:bg-brand-50 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
              View Transactions
            </Link>
            <Link to="/disputes" className="border border-white text-white hover:bg-brand-700 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
              Manage Disputes
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          label="Transactions"
          value={transactions?.length ?? '—'}
          to="/transactions"
          color="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
        />
        <StatCard
          label="Disputes"
          value={pendingDisputes}
          to="/disputes"
          color="bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <StatCard
          label="Merchants"
          value={merchants?.length ?? '—'}
          to="/merchants"
          color="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard
          label="Cardholders"
          value={cardholders?.length ?? '—'}
          to="/cardholders"
          color="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Issuers"
          value={issuers?.length ?? '—'}
          to="/issuers"
          color="bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>}
        />
        <StatCard
          label="Settled Txns"
          value={settledTxns}
          to="/settlements"
          color="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { to: '/transactions', label: 'All Transactions', desc: 'View & search transactions' },
              { to: '/disputes', label: 'Open Disputes', desc: 'Review & resolve disputes' },
              { to: '/settlements', label: 'Settlements', desc: 'Issuer settlement batches' },
              { to: '/merchants', label: 'Merchant Registry', desc: 'Manage merchant records' },
              { to: '/cards', label: 'Card Inventory', desc: 'Card status & limits' },
              { to: '/issuers', label: 'Issuer Directory', desc: 'Partner bank registry' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors group"
              >
                <div className="font-medium text-sm text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">{link.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Platform Overview</h2>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex gap-2"><span className="text-brand-500 font-bold">›</span> Global payment authorization and routing across {issuers?.length ?? '—'} issuing banks</li>
            <li className="flex gap-2"><span className="text-brand-500 font-bold">›</span> Real-time risk scoring on all transactions (0–100 scale)</li>
            <li className="flex gap-2"><span className="text-brand-500 font-bold">›</span> Automated dispute resolution workflow with SLA tracking</li>
            <li className="flex gap-2"><span className="text-brand-500 font-bold">›</span> Multi-currency settlement batches with fee reconciliation</li>
            <li className="flex gap-2"><span className="text-brand-500 font-bold">›</span> Merchant category code (MCC) management for {merchants?.length ?? '—'} merchants</li>
            <li className="flex gap-2"><span className="text-brand-500 font-bold">›</span> Card product tiers: Standard → Gold → Platinum → World → World Elite</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
