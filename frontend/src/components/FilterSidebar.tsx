"use client";
import React from "react";

interface FilterSidebarProps {
  dateRange: string;
  setDateRange: (value: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (value: string[]) => void;
  selectedPaymentModes: string[];
  setSelectedPaymentModes: (value: string[]) => void;
  minAmount: string;
  setMinAmount: (value: string) => void;
  maxAmount: string;
  setMaxAmount: (value: string) => void;
}

const categories = [
  "Food",
  "Transportation",
  "Housing",
  "Extra income",
  "Clothing",
  "Education",
  "Shopping",
  "Health",
  "Entertainment",
  "Utilities",
  "Personal Care",
  "Others",
];
const types = ["Income", "Expense"];
const paymentModes = ["Cash", "Debit Card", "Credit Card"];

export default function FilterSidebar({
  dateRange,
  setDateRange,
  selectedCategories,
  setSelectedCategories,
  selectedTypes,
  setSelectedTypes,
  selectedPaymentModes,
  setSelectedPaymentModes,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
}: FilterSidebarProps) {
  return (
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
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category */}

        <div>
          <label className="block text-sm font-medium text-blue-500 mb-2">
            Category
          </label>
          <select
            value={selectedCategories[0] || ""}
            onChange={(e) => setSelectedCategories([e.target.value])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
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
                      setSelectedTypes(selectedTypes.filter((t) => t !== type));
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
                      setSelectedPaymentModes([...selectedPaymentModes, mode]);
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
              <label className="block text-xs text-gray-500 mb-1">Min :</label>
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <span className="text-gray-500 mt-6">—</span>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Max :</label>
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
  );
}
