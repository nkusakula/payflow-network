import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

interface Transaction {
  id: string;
  cardId: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'declined' | 'reversed' | 'settled';
  type: string;
  authCode: string;
  riskScore: number;
  transactedAt: string;
}

interface Merchant {
  id: string;
  name: string;
  category: string;
  country: string;
}

interface Dispute {
  id: string;
  status: string;
  amountDisputed: number;
}

interface StatCardProps {
  label: string;
  value: number | string;
  to: string;
  color: string;
  icon: React.ReactNode;
  hint?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, to, color, icon, hint }) => (
  <Link to={to} className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
    <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
    <div className="min-w-0">
      <div className="text-2xl font-bold text-slate-800 dark:text-white truncate">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{label}</div>
      {hint && <div className="text-xs text-slate-400 mt-0.5">{hint}</div>}
    </div>
  </Link>
);

// Approximate FX to USD for a unified gross volume metric (demo only).
const FX_TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  CAD: 0.74,
  AUD: 0.66,
};

const formatUSD = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);

const formatCurrency = (cents: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);

const STATUS_COLORS: Record<string, string> = {
  settled: 'bg-blue-500',
  approved: 'bg-green-500',
  pending: 'bg-yellow-500',
  declined: 'bg-red-500',
  reversed: 'bg-orange-500',
};

const Welcome: React.FC = () => {
  const { data: transactions = [] } = useQuery<Transaction[]>('transactions', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.transactions}`).then((r) => r.data));
  const { data: disputes = [] } = useQuery<Dispute[]>('disputes', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.disputes}`).then((r) => r.data));
  const { data: merchants = [] } = useQuery<Merchant[]>('merchants', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.merchants}`).then((r) => r.data));
  const { data: cardholders = [] } = useQuery<unknown[]>('cardholders', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.cardholders}`).then((r) => r.data));
  const { data: issuers = [] } = useQuery<unknown[]>('issuers', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.issuers}`).then((r) => r.data));
  const { data: cards = [] } = useQuery<unknown[]>('cards', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.cards}`).then((r) => r.data));

  const merchantById = useMemo(() => {
    const map = new Map<string, Merchant>();
    merchants.forEach((m) => map.set(m.id, m));
    return map;
  }, [merchants]);

  const stats = useMemo(() => {
    const counted = transactions.filter((t) => t.status !== 'declined' && t.status !== 'reversed');
    const grossUsd = counted.reduce((sum, t) => sum + t.amount * (FX_TO_USD[t.currency] ?? 1), 0);
    const approved = transactions.filter((t) => t.status === 'approved' || t.status === 'settled').length;
    const approvalRate = transactions.length ? (approved / transactions.length) * 100 : 0;
    const highRisk = transactions.filter((t) => t.riskScore >= 70).length;
    const avgTicket = counted.length ? grossUsd / counted.length : 0;

    const statusCounts: Record<string, number> = {};
    transactions.forEach((t) => { statusCounts[t.status] = (statusCounts[t.status] ?? 0) + 1; });

    const merchantVolume = new Map<string, number>();
    counted.forEach((t) => {
      const v = t.amount * (FX_TO_USD[t.currency] ?? 1);
      merchantVolume.set(t.merchantId, (merchantVolume.get(t.merchantId) ?? 0) + v);
    });
    const topMerchants = Array.from(merchantVolume.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, vol]) => ({ id, vol, name: merchantById.get(id)?.name ?? id, category: merchantById.get(id)?.category ?? '' }));

    const byDay = new Map<string, number>();
    counted.forEach((t) => {
      const d = t.transactedAt.slice(0, 10);
      byDay.set(d, (byDay.get(d) ?? 0) + t.amount * (FX_TO_USD[t.currency] ?? 1));
    });
    const dailySorted = Array.from(byDay.entries()).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
    const dailyMax = dailySorted.reduce((m, [, v]) => Math.max(m, v), 0);

    const recent = [...transactions]
      .sort((a, b) => b.transactedAt.localeCompare(a.transactedAt))
      .slice(0, 8);

    const openDisputes = disputes.filter((d) => d.status === 'open' || d.status === 'under_review');
    const disputeExposureUsd = openDisputes.reduce((s, d) => s + d.amountDisputed, 0);

    return {
      grossUsd,
      approvalRate,
      highRisk,
      avgTicket,
      statusCounts,
      topMerchants,
      dailySorted,
      dailyMax,
      recent,
      openDisputes: openDisputes.length,
      disputeExposureUsd,
    };
  }, [transactions, disputes, merchantById]);

  const statusOrder = ['settled', 'approved', 'pending', 'declined', 'reversed'];
  const totalTxns = transactions.length || 1;

  const riskClass = (score: number) => {
    if (score >= 70) return 'text-red-500 font-bold';
    if (score >= 40) return 'text-yellow-500 font-semibold';
    return 'text-green-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="card p-8 bg-gradient-to-br from-brand-800 to-brand-900 dark:from-brand-900 dark:to-slate-950 text-white border-0 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl" aria-hidden />
        <div className="absolute -right-20 bottom-0 w-72 h-72 rounded-full bg-brand-400/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-brand-200 bg-white/10 px-2.5 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Network healthy
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">PayFlow Network</h1>
            <p className="text-brand-200 text-lg">Payment Network Operations Platform</p>
            <p className="text-brand-300 text-sm mt-2 max-w-2xl">
              Monitor transactions, manage disputes, oversee issuer settlements, and maintain merchant
              relationships — all in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/transactions" className="bg-white text-brand-800 hover:bg-brand-50 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
              View Transactions
            </Link>
            <Link to="/disputes" className="border border-white text-white hover:bg-brand-700 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
              Manage Disputes
            </Link>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Gross Volume</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{formatUSD(stats.grossUsd)}</div>
          <div className="text-xs text-slate-400 mt-1">USD-eq · {transactions.length} txns</div>
        </div>
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Approval Rate</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.approvalRate.toFixed(1)}%</div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-3">
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${stats.approvalRate}%` }} />
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg Ticket</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{formatUSD(stats.avgTicket)}</div>
          <div className="text-xs text-slate-400 mt-1">Excludes declines & reversals</div>
        </div>
        <Link to="/disputes" className="card p-5 hover:shadow-md transition-shadow group">
          <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Open Disputes</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1 group-hover:text-brand-600 dark:group-hover:text-brand-400">{stats.openDisputes}</div>
          <div className="text-xs text-orange-500 mt-1">{formatUSD(stats.disputeExposureUsd)} exposure</div>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Transactions"
          value={transactions.length}
          to="/transactions"
          color="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
        />
        <StatCard
          label="High-risk"
          value={stats.highRisk}
          to="/transactions"
          color="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          hint="Risk ≥ 70"
        />
        <StatCard
          label="Merchants"
          value={merchants.length}
          to="/merchants"
          color="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard
          label="Cardholders"
          value={cardholders.length}
          to="/cardholders"
          color="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Cards"
          value={cards.length}
          to="/cards"
          color="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>}
        />
        <StatCard
          label="Issuers"
          value={issuers.length}
          to="/issuers"
          color="bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>}
        />
      </div>

      {/* Daily volume chart + Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Daily Volume</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">USD-equivalent · last {stats.dailySorted.length} active days</p>
            </div>
            <Link to="/transactions" className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">View all →</Link>
          </div>
          {stats.dailySorted.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No data</div>
          ) : (
            <div className="flex items-end gap-1.5 h-44 pb-6">
              {stats.dailySorted.map(([day, vol]) => {
                const pct = stats.dailyMax > 0 ? (vol / stats.dailyMax) * 100 : 0;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1 group min-w-0" title={`${day}: ${formatUSD(vol)}`}>
                    <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
                      {formatUSD(vol)}
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700/40 rounded-t-md flex-1 flex items-end overflow-hidden">
                      {/* eslint-disable-next-line react/forbid-dom-props */}
                      <div
                        className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-md transition-all hover:from-brand-700 hover:to-brand-500"
                        style={{ height: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 whitespace-nowrap">
                      {day.slice(5)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Status Breakdown</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{transactions.length} transactions</p>
          <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 mb-4">
            {statusOrder.map((s) => {
              const c = stats.statusCounts[s] ?? 0;
              if (!c) return null;
              // eslint-disable-next-line react/forbid-dom-props
              return <div key={s} className={STATUS_COLORS[s]} style={{ width: `${(c / totalTxns) * 100}%` }} title={`${s}: ${c}`} />;
            })}
          </div>
          <ul className="space-y-2">
            {statusOrder.map((s) => {
              const c = stats.statusCounts[s] ?? 0;
              const pct = totalTxns ? ((c / totalTxns) * 100).toFixed(1) : '0';
              return (
                <li key={s} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[s]}`} />
                    <span className="capitalize text-slate-700 dark:text-slate-300">{s}</span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                    {c} <span className="text-slate-400 text-xs">({pct}%)</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Recent transactions + Top merchants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Transactions</h2>
            <Link to="/transactions" className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">See all →</Link>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="text-left px-2 py-2 font-medium">Txn</th>
                  <th className="text-left px-2 py-2 font-medium">Merchant</th>
                  <th className="text-right px-2 py-2 font-medium">Amount</th>
                  <th className="text-left px-2 py-2 font-medium">Status</th>
                  <th className="text-right px-2 py-2 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {stats.recent.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-2 py-2.5 font-mono text-xs text-slate-500">{t.id}</td>
                    <td className="px-2 py-2.5 text-slate-700 dark:text-slate-300 truncate max-w-[12rem]">
                      {merchantById.get(t.merchantId)?.name ?? t.merchantId}
                    </td>
                    <td className="px-2 py-2.5 text-right font-semibold text-slate-800 dark:text-white tabular-nums">
                      {formatCurrency(t.amount, t.currency)}
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs capitalize text-slate-700 dark:text-slate-200">
                        <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[t.status] || 'bg-slate-400'}`} />
                        {t.status}
                      </span>
                    </td>
                    <td className={`px-2 py-2.5 text-right tabular-nums ${riskClass(t.riskScore)}`}>{t.riskScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Top Merchants</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">By gross volume (USD-eq)</p>
          <ol className="space-y-3">
            {stats.topMerchants.map((m, i) => {
              const max = stats.topMerchants[0]?.vol || 1;
              const pct = (m.vol / max) * 100;
              return (
                <li key={m.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <span className="truncate font-medium text-slate-700 dark:text-slate-200">{m.name}</span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 tabular-nums text-xs ml-2 flex-shrink-0">{formatUSD(m.vol)}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700/40 rounded-full h-1.5">
                    {/* eslint-disable-next-line react/forbid-dom-props */}
                    <div className="bg-gradient-to-r from-brand-500 to-brand-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
            {stats.topMerchants.length === 0 && <li className="text-sm text-slate-400">No merchant activity yet.</li>}
          </ol>
        </div>
      </div>

      {/* Quick navigation */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { to: '/transactions', label: 'Transactions', desc: 'Search & filter' },
            { to: '/disputes', label: 'Disputes', desc: 'Resolve cases' },
            { to: '/settlements', label: 'Settlements', desc: 'Issuer batches' },
            { to: '/merchants', label: 'Merchants', desc: 'MCC registry' },
            { to: '/cards', label: 'Cards', desc: 'Status & limits' },
            { to: '/issuers', label: 'Issuers', desc: 'Partner banks' },
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
    </div>
  );
};

export default Welcome;
