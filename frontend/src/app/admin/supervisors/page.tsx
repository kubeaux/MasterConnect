"use client";

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/src/lib/api';
import { CheckCircle, XCircle, Clock, Mail, Building2, Calendar, Loader2, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface PendingSupervisor {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  departement?: string;
  date_joined: string;
  statut_validation: string;
}

export default function AdminSupervisorsPage() {
  const [pending, setPending] = useState<PendingSupervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<number | null>(null);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      const { data } = await adminApi.getPendingSupervisors();
      setPending(Array.isArray(data) ? data : data.results || []);
    } catch {
      toast.error("Impossible de charger les demandes");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (user: PendingSupervisor) => {
    if (!confirm(`Approuver le compte de ${user.first_name} ${user.last_name} ?`)) return;
    setActioningId(user.id);
    try {
      await adminApi.approveSupervisor(user.id);
      toast.success("Compte approuvé");
      setPending(prev => prev.filter(u => u.id !== user.id));
    } catch {
      toast.error("Erreur lors de l'approbation");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (user: PendingSupervisor) => {
    if (!confirm(`Refuser le compte de ${user.first_name} ${user.last_name} ? Cette action est définitive.`)) return;
    setActioningId(user.id);
    try {
      await adminApi.rejectSupervisor(user.id);
      toast.success("Compte refusé");
      setPending(prev => prev.filter(u => u.id !== user.id));
    } catch {
      toast.error("Erreur lors du refus");
    } finally {
      setActioningId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden fade-in">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Validation des encadrants</h3>
            <p className="text-sm text-slate-500">
              {pending.length} demande{pending.length > 1 ? 's' : ''} en attente
            </p>
          </div>
        </div>
        {pending.length > 0 && (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {pending.length} en attente
          </span>
        )}
      </div>

      {pending.length === 0 ? (
        <div className="p-16 text-center">
          <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Aucune demande en attente</h3>
          <p className="text-sm text-slate-500">
            Toutes les demandes d'inscription ont été traitées.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {pending.map(user => (
            <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                  {(user.first_name?.[0] || '') + (user.last_name?.[0] || '')}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900">
                    {user.first_name} {user.last_name}
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </span>
                    {user.departement && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {user.departement}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Demandé le {new Date(user.date_joined).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(user)}
                    disabled={actioningId === user.id}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {actioningId === user.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="h-3.5 w-3.5" />
                    )}
                    Approuver
                  </button>
                  <button
                    onClick={() => handleReject(user)}
                    disabled={actioningId === user.id}
                    className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}