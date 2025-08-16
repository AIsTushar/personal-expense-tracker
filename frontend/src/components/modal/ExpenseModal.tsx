// components/ExpenseModal.tsx
"use client";

import { Expense } from "@/types/expense";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ExpenseForm from "../ExpenceManagement/ExpenseForm";


interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Expense, "id" | "createdAt">) => void;
  initialData: Expense | null;
  isEditing: boolean;
}

export default function ExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: ExpenseModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
            {isEditing ? "Edit Expense" : "Add New Expense"}
          </Dialog.Title>

          <ExpenseForm
            onSubmit={onSubmit}
            initialData={initialData}
            isEditing={isEditing}
            onCancel={onClose}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}