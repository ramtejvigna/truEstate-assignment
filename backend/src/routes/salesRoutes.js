import { SalesController } from "../controllers/salesController.js";
import { Router } from "express";

const router = Router();

// Get sales records with filters, search, sorting, pagination
router.get("/", SalesController.getSalesRecords);

// Get available filter options
router.get("/filters/options", SalesController.getFilterOptions);

// Get summary statistics
router.get("/summary", SalesController.getSummary);

export default router;
