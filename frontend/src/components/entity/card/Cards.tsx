import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../../api/config';

interface Card {
  id: string;
  cardholderId: string;
  issuerId: string;
  maskedPan: string;
  cardType: 'credit' | 'debit' | 'prepaid';
  productTier: 'standard' | 'gold' | 'platinum' | 'world' | 'world_elite';
  status: 'active' | 'blocked' | 'expired' | 'cancelled';
  expiryDate: string;
  creditLimit?: number;
  issuedAt: string;
}

const statusBadge = (status: string) => {
  const cls: Record<string, string> = {
    active: 'badge-active', blocked: 'badge-blocked', expired: 'badge-declined', cancelled: 'badge-declined',
  };
  return <span className={cls[status] || 'badge-active'}>{status}</span>;
};

const tierBadge = (tier: string) => {
  const cls: Record<string, string> = {
    world_elite: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    world: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    platinum: 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200',
    gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    standard: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls[tier] || cls.standard}`}>{tier.replace('_', ' ')}</span>;
};

const Cards: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: cards = [], isLoading } = useQuery<Card[]>('cards', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.cards}`).then((r) => r.data));

  const deleteMutation = useMutation(
    (id: string) => axios.delete(`${API_BASE_URL}${API_ENDPOINTS.cards}/${id}`),
    { onSuccess: () => queryClient.invalidateQueries('cards') }
  );

  const filtered = cards.filter((c) =>
    c.maskedPan.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.cardholderId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Cards</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{cards.length} cards in network</p>
        </div>
      </div>

      <div className="mb-6">
        <input type="text" placeholder="Search by PAN, ID, cardholder..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
      </div>

      {isLoading ? <div className="text-center py-12 text-slate-400">Loading cards...</div> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Masked PAN</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Tier</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Expiry</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Cardholder</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.id}</td>
                    <td className="px-4 py-3 font-mono text-slate-800 dark:text-white">{c.maskedPan}</td>
                    <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">{c.cardType}</td>
                    <td className="px-4 py-3">{tierBadge(c.productTier)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.expiryDate}</td>
                    <td className="px-4 py-3">{statusBadge(c.status)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.cardholderId}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { if (window.confirm('Cancel this card?')) deleteMutation.mutate(c.id); }} className="text-red-500 hover:text-red-700 text-xs font-medium">Cancel</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-slate-400">No cards found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
