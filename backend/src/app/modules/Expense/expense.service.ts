import { Request } from "express";
import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../utils/queryBuilder";
import {
  expenseFilterFields,
  expenseInclude,
  expenseNestedFilters,
  expenseRangeFilter,
  expenseSearchFields,
} from "./expense.constant";

import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import { Prisma } from "@prisma/client";

const createExpense = async (req: Request) => {
  const userId = req.user.userId;
  const payload = req.body;
  payload.userId = userId;

  const expense = await prisma.expense.create({ data: payload });

  return expense;
};

const getExpenses = async (req: Request) => {
  const userId = req.user.userId;
  const queryBuilder = new QueryBuilder(req.query, prisma.expense);
  const results = await queryBuilder
    .filter(expenseFilterFields)
    .search(expenseSearchFields)
    .nestedFilter(expenseNestedFilters)
    .sort()
    .paginate()
    .include(expenseInclude)
    .fields()
    .rawFilter({
      userId,
    })
    .filterByRange(expenseRangeFilter)
    .execute();

  const meta = await queryBuilder.countTotal();
  return { data: results, meta };
};

const getExpenseById = async (id: string) => {
  return prisma.expense.findUnique({ where: { id } });
};

const updateExpense = async (req: Request) => {
  const { id } = req.params;
  const data = req.body;
  const userId = req.user.userId;

  const whereClause: Prisma.ExpenseWhereUniqueInput = {
    id,
  };

  const existing = await prisma.expense.findUnique({ where: whereClause });

  if (!existing) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Expense not found with this id: ${id}`
    );
  }

  // Check if the userId matches
  if (existing.userId !== userId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to update this expense"
    );
  }

  return prisma.expense.update({
    where: whereClause,
    data: {
      ...data,
    },
  });
};

const deleteExpense = async (req: Request) => {
  const userId = req.user.userId;

  const expense = await prisma.expense.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!expense) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Expense not found with this id: ${req.params.id}`
    );
  }

  // Check if the userId matches
  if (expense.userId !== userId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to delete this expense"
    );
  }

  // Delete the expense
  await prisma.expense.delete({ where: { id: req.params.id } });
};

const getDashboardData = async (req: Request) => {
  const userId = req.user.userId;
  const queryBuilder = new QueryBuilder(req.query, prisma.expense);
  const results = await queryBuilder
    .filter(expenseFilterFields)
    .search(expenseSearchFields)
    .nestedFilter(expenseNestedFilters)
    .sort()
    .paginate()
    .include(expenseInclude)
    .fields()
    .rawFilter({
      userId,
    })
    .filterByRange(expenseRangeFilter)
    .execute();

  // Total transactions
  const totalTransactions = results.length;

  // Total income and total expenses
  // const totalIncome = results
  //   .filter((e: any) => e.type === "INCOME")
  //   .reduce((sum: number, e: any) => sum + e.amount, 0);

  const totalExpenses = results
    .filter((e: any) => e.type === "EXPENSE")
    .reduce((sum: number, e: any) => sum + e.amount, 0);

  // Total balance
  // const totalBalance = totalIncome - totalExpenses;

  // Month-wise income and expenses
  const monthlyMap: Record<string, { expenses: number }> = {};

  results.forEach((e: any) => {
    const month = new Date(e.date).toLocaleString("default", {
      month: "short",
    });
    if (!monthlyMap[month]) monthlyMap[month] = { expenses: 0 };
    if (e.type === "Expense") monthlyMap[month].expenses += e.amount;
  });

  const monthlyData = Object.entries(monthlyMap).map(
    ([month, { expenses }]) => ({
      month,
      expenses,
    })
  );

  // Pie chart data (expenses by category)
  const categoryMap: Record<string, number> = {};
  results
    .filter((e: any) => e.type === "Expense")
    .forEach((e: any) => {
      if (!categoryMap[e.category]) categoryMap[e.category] = 0;
      categoryMap[e.category] += e.amount;
    });

  const expensesByCategory = Object.entries(categoryMap).map(
    ([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses
        ? parseFloat(((amount / totalExpenses) * 100).toFixed(2))
        : 0,
    })
  );

  const meta = await queryBuilder.countTotal();

  return {
    summary: {
      // totalIncome,
      totalExpenses,
      // totalBalance,
      totalTransactions,
    },
    monthlyData,
    chart: expensesByCategory,
    meta,
  };
};

export const ExpenseServices = {
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  createExpense,
  getDashboardData,
};
