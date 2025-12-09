import { SalesService } from "../services/salesService.js";

export class SalesController {
  /**
   * Get sales records with filters, search, sorting, and pagination
   */
  static async getSalesRecords(req, res) {
    try {
      const {
        search = "",
        customerRegion = [],
        gender = [],
        ageRange = [],
        productCategory = [],
        tags = [],
        paymentMethod = [],
        dateRangeStart = "",
        dateRangeEnd = "",
        sortBy = "customerName",
        sortOrder = "asc",
        page = "1",
        pageSize = "10",
      } = req.query;

      // Parse array parameters
      const parseArrayParam = (param) => {
        if (typeof param === "string") {
          return param ? [param] : [];
        }
        return Array.isArray(param) ? param : [];
      };

      const filters = {
        customerRegion: parseArrayParam(customerRegion),
        gender: parseArrayParam(gender),
        ageRange: parseArrayParam(ageRange),
        productCategory: parseArrayParam(productCategory),
        tags: parseArrayParam(tags),
        paymentMethod: parseArrayParam(paymentMethod),
        dateRange: {
          start: dateRangeStart,
          end: dateRangeEnd,
        },
      };

      const result = await SalesService.getSalesRecords({
        search,
        filters,
        sortBy,
        sortOrder,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });

      res.json(result);
    } catch (error) {
      console.error("Error fetching sales records:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch sales records", details: error.message });
    }
  }

  /**
   * Get filter options for UI dropdowns
   */
  static async getFilterOptions(req, res) {
    try {
      const options = await SalesService.getFilterOptions();
      res.json(options);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch filter options", details: error.message });
    }
  }

  /**
   * Get summary statistics
   */
  static async getSummary(req, res) {
    try {
      const { customerRegion = [], productCategory = [] } = req.query;

      const parseArrayParam = (param) => {
        if (typeof param === "string") {
          return param ? [param] : [];
        }
        return Array.isArray(param) ? param : [];
      };

      const filters = {
        customerRegion: parseArrayParam(customerRegion),
        productCategory: parseArrayParam(productCategory),
      };

      const summary = await SalesService.getSummary(filters);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch summary", details: error.message });
    }
  }
}
