"use client"

import { Expense } from "@/types/expense"

interface ExpenseStatsProps {
  expenses: Expense[]
}

export default function ExpenseStats({ expenses }: ExpenseStatsProps) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const thisMonth = new Date().toISOString().slice(0, 7)
  const thisMonthExpenses = expenses.filter((expense) =>
    expense.date.startsWith(thisMonth)
  )
  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )

  const stats = [
    { title: "Total Expenses", value: `$${totalAmount.toFixed(2)}`, icon: "💰" },
    { title: "This Month", value: `$${thisMonthTotal.toFixed(2)}`, icon: "📅" },
    { title: "Transactions", value: expenses.length, icon: "📊" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <p className="text-sm font-medium text-gray-500">{stat.title}</p>
          <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
