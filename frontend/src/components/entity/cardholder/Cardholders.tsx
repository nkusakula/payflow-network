import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../../api/config';

interface Cardholder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  issuerId: string;
  status: 'active' | 'blocked' | 'closed';
  createdAt: string;
}

const statusBadge = (status: string) => {
  const cls: Record<string, string> = { active: 'badge-active', blocked: 'badge-blocked', closed: 'badge-declined' };
  return <span className={cls[status] || 'badge-active'}>{status}</span>;
};

const Cardholders: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: cardholders = [], isLoading } = useQuery<Cardholder[]>('cardholders', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.cardholders}`).then((r) => r.data));

  const deleteMutation = useMutation(
    (id: string) => axios.delete(`${API_BASE_URL}${API_ENDPOINTS.cardholders}/${id}`),
    { onSuccess: () => queryClient.invalidateQueries('cardholders') }
  );

  const filtered = cardholders.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Cardholders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{cardholders.length} registered cardholders</p>
        </div>
      </div>

      <div className="mb-6">
        <input type="text" placeholder="Search by name, email, or ID..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
      </div>

      {isLoading ? <div className="text-center py-12 text-slate-400">Loading cardholders...</div> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Country</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Issuer</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{c.firstName} {c.lastName}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.email}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.country}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.issuerId}</td>
                    <td className="px-4 py-3">{statusBadge(c.status)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { if (window.confirm('Delete cardholder?')) deleteMutation.mutate(c.id); }} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-slate-400">No cardholders found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cardholders;
