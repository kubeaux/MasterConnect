"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, ArrowRight, AlertCircle, GripVertical } from 'lucide-react';
import { clsx } from 'clsx';
import { Reorder } from 'framer-motion';

const mockProjects = [
  { id: 1, title: "Optimisation IA", department: "Informatique", supervisor: "Dr. Martin" },
  { id: 2, title: "Application Mobile Santé", department: "Santé Publique", supervisor: "Pr. Dubois" },
];

export default function StudentWishes() {
  const [wishes, setWishes] = useState([
    { projectId: 1, rank: 1, annotation: "" },
    { projectId: 2, rank: 2, annotation: "" }
  ]);

  const removeWish = (projectId: number) => {
    const updated = wishes.filter(w => w.projectId !== projectId);
    setWishes(updated.map((w, index) => ({ ...w, rank: index + 1 })));
  };

  const handleReorder = (newOrder: any[]) => {
      const updatedWishes = newOrder.map((w, idx) => ({ ...w, rank: idx + 1 }));
      setWishes(updatedWishes);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes Vœux</h1>
          <p className="text-slate-600">Classez vos projets par ordre de préférence en utilisant le glisser-déposer.</p>
        </div>
        <Link href="/student/catalog" className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
            <ArrowRight className="h-4 w-4 rotate-180" /> Retour au catalogue
        </Link>
      </div>

      {wishes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
          <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun vœu formulé</h3>
          <Link href="/student/catalog" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 mt-4">
            Explorer les projets
          </Link>
        </div>
      ) : (
        <Reorder.Group axis="y" values={wishes} onReorder={handleReorder} className="space-y-4">
            {wishes.map((wish) => {
                const project = mockProjects.find(p => p.id === wish.projectId);
                if (!project) return null;

                return (
                    <Reorder.Item key={wish.projectId} value={wish} id={String(wish.projectId)} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex gap-6 items-center group relative cursor-grab active:cursor-grabbing">
                        <GripVertical className="h-5 w-5 text-slate-400" />
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border-2", wish.rank === 1 ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-300")}>
                            {wish.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 mb-1">{project.department}</span>
                            <h3 className="text-lg font-bold text-slate-900 truncate">{project.title}</h3>
                            <p className="text-sm text-slate-500">Encadré par {project.supervisor}</p>
                        </div>
                        <button onClick={() => removeWish(wish.projectId)} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded hover:bg-red-50">
                            <Trash2 className="h-4 w-4" /> Retirer
                        </button>
                    </Reorder.Item>
                );
            })}
        </Reorder.Group>
      )}
    </div>
  );
}