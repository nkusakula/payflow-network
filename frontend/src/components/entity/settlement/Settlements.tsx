import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../../api/config';

interface Settlement {
  id: string;
  issuerId: string;
  settlementDate: string;
  totalTransactions: number;
  totalAmount: number;
  currency: string;
  feesCharged: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt?: string;
}

const statusBadge = (status: string) => {
  const cls: Record<string, string> = {
    pending: 'badge-pending', processing: 'badge-processing', completed: 'badge-settled', failed: 'badge-declined',
  };
  return <span className={cls[status] || 'badge-active'}>{status}</span>;
};

const fmt = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);

const Settlements: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: settlements = [], isLoading } = useQuery<Settlement[]>('settlements', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.settlements}`).then((r) => r.data));

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Settlement> }) =>
      axios.put(`${API_BASE_URL}${API_ENDPOINTS.settlements}/${id}`, data),
    { onSuccess: () => queryClient.invalidateQueries('settlements') }
  );

  const deleteMutation = useMutation(
    (id: string) => axios.delete(`${API_BASE_URL}${API_ENDPOINTS.settlements}/${id}`),
    { onSuccess: () => queryClient.invalidateQueries('settlements') }
  );

  const filtered = settlements.filter((s) =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.issuerId.toLowerCase().includes(search.toLowerCase())
  );

  const handleProcess = (s: Settlement) => {
    updateMutation.mutate({ id: s.id, data: { ...s, status: 'completed', processedAt: new Date().toISOString() } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settlements</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{settlements.length} settlement batches</p>
        </div>
      </div>

      <div className="mb-6">
        <input type="text" placeholder="Search by ID or issuer..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
      </div>

      {isLoading ? <div className="text-center py-12 text-slate-400">Loading settlements...</div> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Issuer</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Txns</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Fees</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Net</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.id}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.issuerId}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.settlementDate}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.totalTransactions}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{fmt(s.totalAmount, s.currency)}</td>
                    <td className="px-4 py-3 text-red-500">{fmt(s.feesCharged, s.currency)}</td>
                    <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">{fmt(s.netAmount, s.currency)}</td>
                    <td className="px-4 py-3">{statusBadge(s.status)}</td>
                    <td className="px-4 py-3 flex gap-2">
                      {s.status === 'pending' && (
                        <button onClick={() => handleProcess(s)} className="text-green-600 hover:text-green-800 text-xs font-medium">Process</button>
                      )}
                      <button onClick={() => { if (window.confirm('Delete this settlement?')) deleteMutation.mutate(s.id); }} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={9} className="text-center py-8 text-slate-400">No settlements found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settlements;
