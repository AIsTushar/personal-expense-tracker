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
import config from "../../../config";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import { Prisma } from "@prisma/client";


const createExpense = async (req: Request) => {
	const payload = req.body;
	if (req.file?.filename) {
		payload.image = `${config.backend_url}/uploads/${req.file.filename}`;
	}

	const expense = await prisma.expense.create({ data: payload });

	return expense;
};

const getExpenses = async (req: Request) => {
	const queryBuilder = new QueryBuilder(req.query, prisma.expense);
	const results = await queryBuilder
		.filter(expenseFilterFields)
		.search(expenseSearchFields)
		.nestedFilter(expenseNestedFilters)
		.sort()
		.paginate()
		.include(expenseInclude)
		.fields()
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
	const data= req.body;
	const user = req.user;
	const role = user?.role;

	if (req.file?.filename) {
		data.documentUrl = `${config.backend_url}/uploads/${req.file.filename}`;
	}

	const whereClause: Prisma.ExpenseWhereUniqueInput = {
		id,
		...(role === "-----" ? { userId: user.id } : {}),
	};

	const existing = await prisma.expense.findUnique({ where: whereClause });
	if (!existing) {
		throw new ApiError(httpStatus.NOT_FOUND, `Expense not found with this id: ${id}`);
	}

	return prisma.expense.update({
		where: whereClause,
		data: {
			...data,
		},
	});
};

const deleteExpense = async (req: Request) => {
	await prisma.expense.delete({ where: { id: req.params.id } });
};

export const ExpenseServices = {
	getExpenses,
	getExpenseById,
	updateExpense,
	deleteExpense,
	createExpense
};