// components/ExpenseTracker.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { redirect } from "next/navigation";

import ExpenseStats from "./Expense-Status";
import ExpenseChart from "./Expense-Chart";
import ExpenseList from "./Expense-List";
import {
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpensesQuery,
  useUpdateExpenseMutation,
} from "@/redux/service/expence/expenceApi";
import { Expense } from "@/types/expense";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth";
import ExpenseModal from "../modal/ExpenseModal";

export default function ExpenseTracker() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  // RTK Query hooks
  const { data: expensesData, isLoading, refetch } = useGetExpensesQuery({});
  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  // Ensure expenses is always Expense[]
  const expenses: Expense[] = (
    Array.isArray(expensesData?.data)
      ? expensesData.data
      : expensesData?.data
      ? [expensesData.data]
      : []
  ).map((exp) => ({
    ...exp,
    category: exp.category as Expense["category"],
  }));

  // Add new expense
  const addExpense = async (expenseData: Omit<Expense, "id" | "createdAt">) => {
    try {
      const res = await createExpense({
        ...expenseData,
        date: new Date(expenseData.date).toISOString(),
      }).unwrap();
      toast.success(res?.message || "Expense added successfully");
      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add expense");
    }
  };

  // Update existing expense
  const handleUpdateExpense = async (
    id: string,
    expenseData: Omit<Expense, "id" | "createdAt">
  ) => {
    try {
      const res = await updateExpense({
        id,
        body: {
          ...expenseData,
          date: new Date(expenseData.date).toISOString(),
        },
      }).unwrap();
      toast.success(res?.message || "Expense updated successfully");
      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update expense");
      console.error("Error updating expense:", error);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await deleteExpense(id).unwrap();
      toast.success(res?.message || "Expense deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete expense");
      console.error("Error deleting expense:", error);
    }
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const categoryMatch =
      filterCategory === "all" || expense.category === filterCategory;
    const dateMatch =
      (!dateRange.start ||
        expense.date >= new Date(dateRange.start).toISOString()) &&
      (!dateRange.end || expense.date <= new Date(dateRange.end).toISOString());
    return categoryMatch && dateMatch;
  });

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Expense Tracker
            </h1>
            <p className="text-gray-600">Track your expenses efficiently</p>
          </div>
          {user?.email && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <button
                onClick={() => {
                  dispatch(logout());
                  redirect("/login");       
                  toast.success("Logged out successfully");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Expense
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1">
            <ExpenseStats expenses={filteredExpenses} />
          </div>

          {/* Right Column - Chart and List */}
          <div className="lg:col-span-2 space-y-6">
            {expenses.length > 0 && <ExpenseChart expenses={expenses} />}

            <ExpenseList
              expenses={filteredExpenses}
              onEdit={handleEditClick}
              onDelete={handleDeleteExpense}
              filterCategory={filterCategory}
              onFilterChange={setFilterCategory}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>

        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={
            editingExpense
              ? (data: Omit<Expense, "id" | "createdAt">) => handleUpdateExpense(editingExpense.id, data)
              : addExpense
          }
          initialData={editingExpense}
          isEditing={!!editingExpense}
        />
      </div>
    </div>
  );
}