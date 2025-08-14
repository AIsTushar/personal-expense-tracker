import express from "express";
import { ExpenseRoutes } from "../modules/Expense/expense.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/expenses",
    route: ExpenseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
