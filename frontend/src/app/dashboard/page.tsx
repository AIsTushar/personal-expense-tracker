"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  Filler,
} from "chart.js";

// Register Chart.js components
Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  Filler
);

const expenseData = [
  {
    category: "Mortgage / Rent",
    amount: 6000,
    percentage: 15.76,
    color: "#4ECDC4",
  },
  { category: "Food", amount: 4866, percentage: 12.79, color: "#A4DE6C" },
  { category: "Utilities", amount: 4160, percentage: 10.93, color: "#FFC658" },
  { category: "Bills", amount: 3960, percentage: 10.4, color: "#FF8042" },
  { category: "Shopping", amount: 3375, percentage: 8.87, color: "#0088FE" },
  {
    category: "Transportation",
    amount: 3230,
    percentage: 8.49,
    color: "#FF6B9D",
  },
  { category: "Insurance", amount: 2890, percentage: 7.59, color: "#C44569" },
  { category: "Health Care", amount: 2480, percentage: 6.52, color: "#6C5CE7" },
  { category: "Clothing", amount: 2255, percentage: 5.92, color: "#5A67D8" },
  { category: "Others", amount: 4844, percentage: 12.73, color: "#00D2FF" },
];

const balanceData = {
  labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  data: [500, 750, 580, 1100, 980, 1200],
};

const incomeExpenseData = {
  labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  income: [7500, 6800, 6000, 8200, 7300, 7500],
  expense: [6900, 6000, 5500, 7000, 6300, 6100],
};

export default function DashboardPage() {
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);
  const balanceChartRef = useRef<HTMLCanvasElement>(null);
  const incomeExpenseChartRef = useRef<HTMLCanvasElement>(null);

  const doughnutChartInstance = useRef<Chart | null>(null);
  const balanceChartInstance = useRef<Chart | null>(null);
  const incomeExpenseChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Doughnut Chart
    if (doughnutChartRef.current) {
      const ctx = doughnutChartRef.current.getContext("2d");
      if (ctx) {
        doughnutChartInstance.current?.destroy();
        doughnutChartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: expenseData.map((item) => item.category),
            datasets: [
              {
                data: expenseData.map((item) => item.amount),
                backgroundColor: expenseData.map((item) => item.color),
                borderWidth: 0,
                cutout: "60%",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const item = expenseData[context.dataIndex];
                    return `${
                      item.category
                    }: $${item.amount.toLocaleString()} (${item.percentage}%)`;
                  },
                },
              },
            },
            onHover: (_, elements) => {
              if (doughnutChartRef.current) {
                doughnutChartRef.current.style.cursor =
                  elements.length > 0 ? "pointer" : "default";
              }
            },
          },
        });
      }
    }

    // Balance Chart
    if (balanceChartRef.current) {
      const ctx = balanceChartRef.current.getContext("2d");
      if (ctx) {
        balanceChartInstance.current?.destroy();
        balanceChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: balanceData.labels,
            datasets: [
              {
                label: "Amount",
                data: balanceData.data,
                borderColor: "#60A5FA",
                backgroundColor: "rgba(96, 165, 250, 0.3)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#60A5FA",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
                labels: { usePointStyle: true, color: "#9CA3AF" },
              },
              tooltip: {
                callbacks: {
                  label: (context) => `$${context.parsed.y.toLocaleString()}`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 1800,
                ticks: { callback: (v) => `$${v}`, color: "#9CA3AF" },
                grid: { color: "#F3F4F6" },
              },
              x: {
                ticks: { color: "#9CA3AF" },
                grid: { display: false },
              },
            },
          },
        });
      }
    }

    // Income vs Expense Chart
    if (incomeExpenseChartRef.current) {
      const ctx = incomeExpenseChartRef.current.getContext("2d");
      if (ctx) {
        incomeExpenseChartInstance.current?.destroy();
        incomeExpenseChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: incomeExpenseData.labels,
            datasets: [
              {
                label: "Income",
                data: incomeExpenseData.income,
                backgroundColor: "#A855F7",
                borderRadius: 4,
                barThickness: 40,
              },
              {
                label: "Expense",
                data: incomeExpenseData.expense,
                backgroundColor: "#3B82F6",
                borderRadius: 4,
                barThickness: 40,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
                labels: { usePointStyle: true, color: "#9CA3AF" },
              },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${
                      context.dataset.label
                    }: $${context.parsed.y.toLocaleString()}`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 9000,
                ticks: { callback: (v) => `$${v}`, color: "#9CA3AF" },
                grid: { color: "#F3F4F6" },
              },
              x: {
                ticks: { color: "#9CA3AF" },
                grid: { display: false },
              },
            },
          },
        });
      }
    }

    return () => {
      doughnutChartInstance.current?.destroy();
      balanceChartInstance.current?.destroy();
      incomeExpenseChartInstance.current?.destroy();
    };
  }, []);

  return (
    <div className="flex-1 bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-700">Dashboard</h1>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <span className="text-gray-600">06/01/2017 - 12/01/2017</span>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <SummaryCard value="$43,300" label="Income" color="text-blue-500" />
        <SummaryCard value="$38,060" label="Expenses" color="text-pink-500" />
        <SummaryCard value="$5,240" label="Balance" color="text-green-500" />
        <SummaryCard value="1,284" label="Transactions" color="text-cyan-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <ChartCard title="Account - Balance">
          <canvas ref={balanceChartRef}></canvas>
        </ChartCard>
        <ChartCard title="Income - Expense">
          <canvas ref={incomeExpenseChartRef}></canvas>
        </ChartCard>
      </div>

      {/* Expense Doughnut */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-1">
            Total Expenses
          </h2>
          <p className="text-gray-500">Jun 1 - Dec 1</p>
        </div>
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="relative h-96">
              <canvas ref={doughnutChartRef}></canvas>
            </div>
          </div>
          <div className="w-80">
            <div className="space-y-3">
              {expenseData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">
                      ${item.amount.toLocaleString()}
                    </span>
                    <span className="text-gray-500 w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper components
function SummaryCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className={`text-3xl font-semibold ${color} mb-2`}>{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
      <div className="relative h-64">{children}</div>
    </div>
  );
}
