"use client";

import { useEffect, useState } from "react";
import { wishesApi } from "@/src/lib/api";
import Button from "@/src/components/ui/Button";
import { GripVertical, Trash2, ArrowLeft, AlertTriangle } from "lucide-react";
import type { Wish } from "@/src/types";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ── Composant Wish Item Sortable ──
function SortableWishItem({
  wish,
  index,
  onRemove,
  isValidated,
}: {
  wish: Wish;
  index: number;
  onRemove: (id: number) => void;
  isValidated: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: wish.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const project = wish.projet;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all ${
        isDragging
          ? "shadow-lg border-primary-300 scale-[1.02] z-10"
          : "border-surface-200 shadow-card"
      }`}
    >
      {/* Drag handle */}
      {!isValidated && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-5 h-5" />
        </button>
      )}

      {/* Numéro */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex-shrink-0">
        {index + 1}
      </div>

      {/* Info projet */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-primary-500 font-medium uppercase tracking-wide">
          {typeof project === "object" ? project.domaine : ""}
        </p>
        <h3 className="font-semibold text-gray-900 truncate">
          {typeof project === "object" ? project.titre : `Projet #${project}`}
        </h3>
        {typeof project === "object" && (
          <p className="text-sm text-gray-500">
            Encadré par {project.encadrant.prenom} {project.encadrant.nom}
          </p>
        )}
      </div>

      {/* Actions */}
      {!isValidated && (
        <button
          onClick={() => onRemove(wish.id)}
          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
          title="Retirer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ── Page Principale ──
export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    loadWishes();
  }, []);

  const loadWishes = async () => {
    try {
      const { data } = await wishesApi.getMine();
      const wishList = data.results || data;
      setWishes(wishList.sort((a: Wish, b: Wish) => a.rang - b.rang));
      // TODO: vérifier si déjà validé via un champ de l'API
    } catch {
      toast.error("Erreur lors du chargement des vœux");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = wishes.findIndex((w) => w.id === active.id);
    const newIndex = wishes.findIndex((w) => w.id === over.id);

    const reordered = arrayMove(wishes, oldIndex, newIndex);
    setWishes(reordered);

    try {
      await wishesApi.reorder(
        reordered.map((w, i) => ({ id: w.id, rang: i + 1 }))
      );
    } catch {
      toast.error("Erreur lors de la réorganisation");
      loadWishes();
    }
  };

  const handleRemove = async (wishId: number) => {
    try {
      await wishesApi.remove(wishId);
      toast.success("Vœu retiré");
      loadWishes();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleValidate = async () => {
    try {
      await wishesApi.validate();
      setIsValidated(true);
      setShowConfirm(false);
      toast.success("Vœux validés définitivement !");
    } catch {
      toast.error("Erreur lors de la validation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="page-container py-8 max-w-2xl mx-auto fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Mes Vœux</h1>
          <p className="text-gray-500 text-sm mt-1">
            Classez vos projets par ordre de préférence (1 à 5) en utilisant le glisser-déposer.
          </p>
        </div>
        <Link
          href="/student/catalog"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </Link>
      </div>

      {/* Liste des vœux */}
      {wishes.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-200 p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">Aucun vœu pour le moment</p>
          <Link href="/student/catalog">
            <Button>Explorer les projets</Button>
          </Link>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={wishes.map((w) => w.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {wishes.map((wish, index) => (
                <SortableWishItem
                  key={wish.id}
                  wish={wish}
                  index={index}
                  onRemove={handleRemove}
                  isValidated={isValidated}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Bouton de validation */}
      {wishes.length > 0 && !isValidated && (
        <div className="mt-8">
          {!showConfirm ? (
            <Button onClick={() => setShowConfirm(true)} className="w-full" size="lg">
              Valider définitivement mes vœux ({wishes.length}/5)
            </Button>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Confirmer la validation</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Cette action est irréversible. Vous ne pourrez plus modifier vos vœux après la validation.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="danger" onClick={handleValidate} className="flex-1">
                  Confirmer
                </Button>
                <Button variant="secondary" onClick={() => setShowConfirm(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {isValidated && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-green-800 font-semibold">✓ Vos vœux ont été validés</p>
          <p className="text-sm text-green-600 mt-1">
            Les résultats seront publiés une fois la campagne terminée.
          </p>
        </div>
      )}
    </div>
  );
}