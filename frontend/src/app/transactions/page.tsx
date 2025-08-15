"use client";

import { useState } from "react";

interface Transaction {
  id: string;
  category: string;
  date: string;
  paymentMode: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  icon: string;
  color: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    category: "Food",
    date: "11/30/2017",
    paymentMode: "Debit Card",
    description: "Palmetto Cheese, Mint julep",
    amount: 6,
    type: "expense",
    icon: "🍽️",
    color: "bg-orange-500",
  },
  {
    id: "2",
    category: "Transportation",
    date: "11/30/2017",
    paymentMode: "Debit Card",
    description: "Other vehicle expenses",
    amount: 7,
    type: "expense",
    icon: "✈️",
    color: "bg-green-500",
  },
  {
    id: "3",
    category: "Housing",
    date: "11/30/2017",
    paymentMode: "Credit Card",
    description: "Laundry and cleaning supplies",
    amount: 20,
    type: "expense",
    icon: "🏠",
    color: "bg-teal-500",
  },
  {
    id: "4",
    category: "Extra income",
    date: "11/30/2017",
    paymentMode: "Cash",
    description: "Income from Sale",
    amount: 110,
    type: "income",
    icon: "💰",
    color: "bg-orange-600",
  },
  {
    id: "5",
    category: "Food",
    date: "11/30/2017",
    paymentMode: "Credit Card",
    description: "Muffuletta sandwich, Mint julep",
    amount: 10,
    type: "expense",
    icon: "🍽️",
    color: "bg-orange-500",
  },
  {
    id: "6",
    category: "Clothing",
    date: "11/30/2017",
    paymentMode: "Debit Card",
    description: "Pair of Running Shoes",
    amount: 45,
    type: "expense",
    icon: "👕",
    color: "bg-gray-600",
  },
  {
    id: "7",
    category: "Education",
    date: "11/30/2017",
    paymentMode: "Cash",
    description: "Expense for Education",
    amount: 50,
    type: "expense",
    icon: "📚",
    color: "bg-yellow-500",
  },
  {
    id: "8",
    category: "Transportation",
    date: "11/30/2017",
    paymentMode: "Debit Card",
    description: "Cars and trucks, used",
    amount: 7,
    type: "expense",
    icon: "✈️",
    color: "bg-green-500",
  },
  {
    id: "9",
    category: "Food",
    date: "11/30/2017",
    paymentMode: "Credit Card",
    description: "Palmetto Cheese, Mint julep",
    amount: 12,
    type: "expense",
    icon: "🍽️",
    color: "bg-orange-500",
  },
  {
    id: "10",
    category: "Food",
    date: "11/29/2017",
    paymentMode: "Debit Card",
    description: "Peanuts in Coke",
    amount: 8,
    type: "expense",
    icon: "🍽️",
    color: "bg-orange-500",
  },
  {
    id: "11",
    category: "Shopping",
    date: "11/29/2017",
    paymentMode: "Cash",
    description: "Beauty care things",
    amount: 65,
    type: "expense",
    icon: "🛍️",
    color: "bg-red-500",
  },
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPaymentModes, setSelectedPaymentModes] = useState<string[]>([
    "Cash",
    "Debit Card",
    "Credit Card",
  ]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "Income",
    "Expense",
  ]);
  const [minAmount, setMinAmount] = useState("2");
  const [maxAmount, setMaxAmount] = useState("6000");
  const [dateRange, setDateRange] = useState("06/01/2017 - 12/01/2017");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );

  const categories = [
    "Food",
    "Transportation",
    "Housing",
    "Extra income",
    "Clothing",
    "Education",
    "Shopping",
  ];
  const paymentModes = ["Cash", "Debit Card", "Credit Card"];
  const types = ["Income", "Expense"];

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(transaction.category);
    const matchesPaymentMode = selectedPaymentModes.includes(
      transaction.paymentMode
    );
    const matchesType = selectedTypes
      .map((t) => t.toLowerCase())
      .includes(transaction.type);
    const matchesAmount =
      transaction.amount >= Number.parseInt(minAmount) &&
      transaction.amount <= Number.parseInt(maxAmount);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPaymentMode &&
      matchesType &&
      matchesAmount
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toggleTransactionSelection = (id: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleAllTransactions = () => {
    if (selectedTransactions.length === paginatedTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(paginatedTransactions.map((t) => t.id));
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-hidden">
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                All Transactions
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap">
                  ADD TRANSACTION
                </button>
              </div>
            </div>
            {selectedTransactions.length > 0 && (
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {selectedTransactions.length} selected
                </span>
                <div className="flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700 text-sm">
                    Edit
                  </button>
                  <button className="text-red-500 hover:text-red-700 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <div className="bg-white">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedTransactions.length ===
                            paginatedTransactions.length &&
                          paginatedTransactions.length > 0
                        }
                        onChange={toggleAllTransactions}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Payment Mode
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.includes(
                            transaction.id
                          )}
                          onChange={() =>
                            toggleTransactionSelection(transaction.id)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 ${transaction.color} rounded-full flex items-center justify-center text-white text-sm`}
                          >
                            {transaction.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {transaction.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.paymentMode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`text-sm font-medium ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                {currentPage} of {totalPages} pages (
                {filteredTransactions.length} items)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {Array.from(
                  { length: Math.min(10, totalPages) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === page
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-blue-500 mb-2">
                Select a range
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-blue-500 mb-2">
                Category
              </label>
              <select
                multiple
                value={selectedCategories}
                onChange={(e) =>
                  setSelectedCategories(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Cashflow */}
            <div>
              <label className="block text-sm font-medium text-blue-500 mb-2">
                Cashflow
              </label>
              <div className="space-y-2">
                {types.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, type]);
                        } else {
                          setSelectedTypes(
                            selectedTypes.filter((t) => t !== type)
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-blue-500 mb-2">
                Payment Mode
              </label>
              <div className="space-y-2">
                {paymentModes.map((mode) => (
                  <label key={mode} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPaymentModes.includes(mode)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPaymentModes([
                            ...selectedPaymentModes,
                            mode,
                          ]);
                        } else {
                          setSelectedPaymentModes(
                            selectedPaymentModes.filter((m) => m !== mode)
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-blue-500 mb-2">
                Amount
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    Min :
                  </label>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <span className="text-gray-500 mt-6">—</span>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    Max :
                  </label>
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
