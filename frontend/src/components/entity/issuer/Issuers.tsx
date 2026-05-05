import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../../api/config';

interface Issuer {
  id: string;
  name: string;
  country: string;
  bankCode: string;
  currency: string;
  status: 'active' | 'suspended' | 'terminated';
  contactEmail: string;
  enrolledAt: string;
}

const statusBadge = (status: string) => {
  const cls: Record<string, string> = { active: 'badge-active', suspended: 'badge-suspended', terminated: 'badge-blocked' };
  return <span className={cls[status] || 'badge-active'}>{status}</span>;
};

const Issuers: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editIssuer, setEditIssuer] = useState<Issuer | null>(null);
  const [form, setForm] = useState<Partial<Issuer>>({});

  const { data: issuers = [], isLoading } = useQuery<Issuer[]>('issuers', () =>
    axios.get(`${API_BASE_URL}${API_ENDPOINTS.issuers}`).then((r) => r.data));

  const createMutation = useMutation(
    (data: Partial<Issuer>) => axios.post(`${API_BASE_URL}${API_ENDPOINTS.issuers}`, data),
    { onSuccess: () => { queryClient.invalidateQueries('issuers'); closeForm(); } }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Issuer> }) =>
      axios.put(`${API_BASE_URL}${API_ENDPOINTS.issuers}/${id}`, data),
    { onSuccess: () => { queryClient.invalidateQueries('issuers'); closeForm(); } }
  );

  const deleteMutation = useMutation(
    (id: string) => axios.delete(`${API_BASE_URL}${API_ENDPOINTS.issuers}/${id}`),
    { onSuccess: () => queryClient.invalidateQueries('issuers') }
  );

  const filtered = issuers.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase()) ||
    i.country.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditIssuer(null); setForm({ status: 'active' }); setShowForm(true); };
  const openEdit = (i: Issuer) => { setEditIssuer(i); setForm({ ...i }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditIssuer(null); setForm({}); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIssuer) { updateMutation.mutate({ id: editIssuer.id, data: form }); }
    else { createMutation.mutate(form); }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Issuers</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{issuers.length} issuing banks</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Issuer</button>
      </div>

      <div className="mb-6">
        <input type="text" placeholder="Search by name, ID, country..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">{editIssuer ? 'Edit Issuer' : 'New Issuer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Name *</label>
                  <input required className={inputCls} value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Bank Code</label>
                  <input className={inputCls} value={form.bankCode || ''} onChange={(e) => setForm({ ...form, bankCode: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Country</label>
                  <input className={inputCls} value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="US" /></div>
                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Currency</label>
                  <input className={inputCls} value={form.currency || ''} onChange={(e) => setForm({ ...form, currency: e.target.value })} placeholder="USD" /></div>
                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Contact Email</label>
                  <input type="email" className={inputCls} value={form.contactEmail || ''} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label>
                  <select className={inputCls} value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value as Issuer['status'] })}>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="terminated">Terminated</option>
                  </select></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editIssuer ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? <div className="text-center py-12 text-slate-400">Loading issuers...</div> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Country</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Currency</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Bank Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{i.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{i.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{i.country}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{i.currency}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{i.bankCode}</td>
                    <td className="px-4 py-3">{statusBadge(i.status)}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button onClick={() => openEdit(i)} className="text-brand-600 hover:text-brand-800 text-xs font-medium">Edit</button>
                      <button onClick={() => { if (window.confirm('Delete this issuer?')) deleteMutation.mutate(i.id); }} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-slate-400">No issuers found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issuers;
