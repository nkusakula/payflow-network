import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../../api/config';

interface Transaction {
  id: string;
  cardId: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'declined' | 'reversed' | 'settled';
  type: 'purchase' | 'refund' | 'cash_advance' | 'balance_inquiry';
  authCode: string;
  declineReason?: string;
  riskScore: number;
  transactedAt: string;
  settledAt?: string;
}

const statusBadge = (status: string) => {
  const cls: Record<string, string> = {
    pending: 'badge-pending',
    approved: 'badge-active',
    declined: 'badge-declined',
    reversed: 'badge-reversed',
    settled: 'badge-settled',
  };
  return <span className={cls[status] || 'badge-active'}>{status}</span>;
};

const riskColor = (score: number) => {
  if (score >= 70) return 'text-red-500 font-bold';
  if (score >= 40) return 'text-yellow-500 font-semibold';
  return 'text-green-500';
};

const formatAmount = (amount: number, currency: string) => {
  const major = amount / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(major);
};

const Transactions: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>('transactions', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.transactions}`).then((r) => r.data));

  const deleteMutation = useMutation(
    (id: string) => axios.delete(`${API_BASE_URL}${API_ENDPOINTS.transactions}/${id}`),
    { onSuccess: () => queryClient.invalidateQueries('transactions') }
  );

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.cardId.toLowerCase().includes(search.toLowerCase()) ||
      t.merchantId.toLowerCase().includes(search.toLowerCase()) ||
      t.authCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{transactions.length} total transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by ID, card, merchant, auth code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
          <option value="reversed">Reversed</option>
          <option value="settled">Settled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading transactions...</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Risk</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Card</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Merchant</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.id}</td>
                    <td className="px-4 py-3 capitalize text-slate-700 dark:text-slate-300">{t.type.replace('_', ' ')}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{formatAmount(t.amount, t.currency)}</td>
                    <td className="px-4 py-3">{statusBadge(t.status)}</td>
                    <td className={`px-4 py-3 ${riskColor(t.riskScore)}`}>{t.riskScore}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.cardId}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.merchantId}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(t.transactedAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { if (window.confirm('Delete this transaction?')) deleteMutation.mutate(t.id); }}
                        className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="text-center py-8 text-slate-400">No transactions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
