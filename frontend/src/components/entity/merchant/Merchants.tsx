import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../../api/config';

interface Merchant {
  id: string;
  name: string;
  mcc: string;
  category: string;
  country: string;
  city: string;
  acquirerId: string;
  status: 'active' | 'suspended' | 'terminated';
  acceptedCardTypes: string[];
  enrolledAt: string;
}

const statusBadge = (status: string) => {
  const cls: Record<string, string> = {
    active: 'badge-active',
    suspended: 'badge-suspended',
    terminated: 'badge-blocked',
  };
  return <span className={cls[status] || 'badge-active'}>{status}</span>;
};

const Merchants: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMerchant, setEditMerchant] = useState<Merchant | null>(null);
  const [form, setForm] = useState<Partial<Merchant>>({});

  const { data: merchants = [], isLoading } = useQuery<Merchant[]>('merchants', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.merchants}`).then((r) => r.data));

  const createMutation = useMutation(
    (data: Partial<Merchant>) => axios.post(`${API_BASE_URL}${API_ENDPOINTS.merchants}`, data),
    { onSuccess: () => { queryClient.invalidateQueries('merchants'); closeForm(); } }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Merchant> }) =>
      axios.put(`${API_BASE_URL}${API_ENDPOINTS.merchants}/${id}`, data),
    { onSuccess: () => { queryClient.invalidateQueries('merchants'); closeForm(); } }
  );

  const deleteMutation = useMutation(
    (id: string) => axios.delete(`${API_BASE_URL}${API_ENDPOINTS.merchants}/${id}`),
    { onSuccess: () => queryClient.invalidateQueries('merchants') }
  );

  const filtered = merchants.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase()) ||
    m.city.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditMerchant(null);
    setForm({ status: 'active', acceptedCardTypes: ['credit', 'debit'] });
    setShowForm(true);
  };

  const openEdit = (m: Merchant) => {
    setEditMerchant(m);
    setForm({ ...m });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditMerchant(null); setForm({}); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMerchant) {
      updateMutation.mutate({ id: editMerchant.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Merchants</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{merchants.length} merchants registered</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Merchant</button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, ID, city, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        />
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6 max-h-screen overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
              {editMerchant ? 'Edit Merchant' : 'New Merchant'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Name *</label>
                  <input required className={inputCls} value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">MCC</label>
                  <input className={inputCls} value={form.mcc || ''} onChange={(e) => setForm({ ...form, mcc: e.target.value })} placeholder="e.g. 5411" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category</label>
                  <input className={inputCls} value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Country</label>
                  <input className={inputCls} value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="US" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">City</label>
                  <input className={inputCls} value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Acquirer ID</label>
                  <input className={inputCls} value={form.acquirerId || ''} onChange={(e) => setForm({ ...form, acquirerId: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label>
                  <select className={inputCls} value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value as Merchant['status'] })}>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editMerchant ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading merchants...</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">MCC</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Location</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{m.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{m.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.category}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{m.mcc}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.city}, {m.country}</td>
                    <td className="px-4 py-3">{statusBadge(m.status)}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button onClick={() => openEdit(m)} className="text-brand-600 hover:text-brand-800 text-xs font-medium transition-colors">Edit</button>
                      <button onClick={() => { if (window.confirm('Delete this merchant?')) deleteMutation.mutate(m.id); }} className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-400">No merchants found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Merchants;
