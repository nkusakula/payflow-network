import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../../api/config';

interface Dispute {
  id: string;
  transactionId: string;
  cardholderId: string;
  reason: string;
  status: 'open' | 'under_review' | 'resolved_cardholder' | 'resolved_merchant' | 'closed';
  description: string;
  amountDisputed: number;
  resolution?: string;
  filedAt: string;
  resolvedAt?: string;
}

const statusBadge = (status: string) => {
  const cls: Record<string, string> = {
    open: 'badge-reversed',
    under_review: 'badge-pending',
    resolved_cardholder: 'badge-settled',
    resolved_merchant: 'badge-active',
    closed: 'badge-blocked',
  };
  return <span className={cls[status] || 'badge-active'}>{status.replace('_', ' ')}</span>;
};

const formatAmount = (amount: number) => `$${(amount / 100).toFixed(2)}`;

const Disputes: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: disputes = [], isLoading } = useQuery<Dispute[]>('disputes', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.disputes}`).then((r) => r.data));

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Dispute> }) =>
      axios.put(`${API_BASE_URL}${API_ENDPOINTS.disputes}/${id}`, data),
    { onSuccess: () => queryClient.invalidateQueries('disputes') }
  );

  const deleteMutation = useMutation(
    (id: string) => axios.delete(`${API_BASE_URL}${API_ENDPOINTS.disputes}/${id}`),
    { onSuccess: () => queryClient.invalidateQueries('disputes') }
  );

  const filtered = disputes.filter((d) => {
    const matchSearch =
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      d.reason.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleReview = (d: Dispute) => {
    if (d.status === 'open') {
      updateMutation.mutate({ id: d.id, data: { ...d, status: 'under_review' } });
    }
  };

  const handleResolve = (d: Dispute) => {
    const resolution = window.prompt('Enter resolution notes:');
    if (resolution !== null) {
      updateMutation.mutate({ id: d.id, data: { ...d, status: 'resolved_cardholder', resolution, resolvedAt: new Date().toISOString() } });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Disputes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {disputes.filter((d) => d.status === 'open' || d.status === 'under_review').length} active disputes
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" placeholder="Search by ID, transaction, reason..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="under_review">Under Review</option>
          <option value="resolved_cardholder">Resolved (Cardholder)</option>
          <option value="resolved_merchant">Resolved (Merchant)</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {isLoading ? <div className="text-center py-12 text-slate-400">Loading disputes...</div> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Transaction</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Reason</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Filed</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{d.id}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{d.transactionId}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 capitalize">{d.reason.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{formatAmount(d.amountDisputed)}</td>
                    <td className="px-4 py-3">{statusBadge(d.status)}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(d.filedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 flex gap-2">
                      {d.status === 'open' && (
                        <button onClick={() => handleReview(d)} className="text-yellow-600 hover:text-yellow-800 text-xs font-medium">Review</button>
                      )}
                      {(d.status === 'open' || d.status === 'under_review') && (
                        <button onClick={() => handleResolve(d)} className="text-green-600 hover:text-green-800 text-xs font-medium">Resolve</button>
                      )}
                      <button onClick={() => { if (window.confirm('Delete dispute?')) deleteMutation.mutate(d.id); }} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-slate-400">No disputes found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Disputes;
