import { Router } from "express";
import { ExpenseControllers } from "./expense.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ExpenseValidations } from "./expense.validation";

const router = Router();

router
  .route("/")
  .post(
    validateRequest(ExpenseValidations.createExpenseSchema),
    ExpenseControllers.createExpense
  )
  .get(ExpenseControllers.getExpenses);

router
  .route("/:id")
  .get(ExpenseControllers.getExpenseById)
  .put(
    validateRequest(ExpenseValidations.updateExpenseSchema),
    ExpenseControllers.updateExpense
  )
  .delete(ExpenseControllers.deleteExpense);

export const ExpenseRoutes = router;
