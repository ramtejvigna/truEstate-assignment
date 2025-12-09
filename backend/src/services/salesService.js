import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SalesService {
  /**
   * Get paginated and filtered sales records
   * @param {Object} options - Query options
   * @param {string} options.search - Search term for customer name or phone
   * @param {Object} options.filters - Filter object
   * @param {string[]} options.filters.customerRegion - Array of regions to filter
   * @param {string[]} options.filters.gender - Array of genders to filter
   * @param {string[]} options.filters.ageRange - Array of age ranges
   * @param {string[]} options.filters.productCategory - Array of categories
   * @param {string[]} options.filters.tags - Array of tags
   * @param {string[]} options.filters.paymentMethod - Array of payment methods
   * @param {Object} options.filters.dateRange - Date range filter
   * @param {string} options.filters.dateRange.start - Start date (YYYY-MM-DD)
   * @param {string} options.filters.dateRange.end - End date (YYYY-MM-DD)
   * @param {string} options.sortBy - Sort field (date, quantity, customerName)
   * @param {string} options.sortOrder - Sort order (asc, desc)
   * @param {number} options.page - Page number (1-indexed)
   * @param {number} options.pageSize - Items per page
   * @returns {Object} Paginated results with metadata
   */
  static async getSalesRecords(options) {
    const {
      search = "",
      filters = {},
      sortBy = "customerName",
      sortOrder = "asc",
      page = 1,
      pageSize = 10,
    } = options;

    // Build where clause for filters
    const whereClause = {};

    // Search filter
    if (search) {
      whereClause.OR = [
        {
          customerName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phoneNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Region filter
    if (filters.customerRegion && filters.customerRegion.length > 0) {
      whereClause.customerRegion = {
        in: filters.customerRegion,
      };
    }

    // Gender filter
    if (filters.gender && filters.gender.length > 0) {
      whereClause.gender = {
        in: filters.gender,
      };
    }

    // Age range filter
    if (filters.ageRange && filters.ageRange.length > 0) {
      const ageConditions = [];
      for (const range of filters.ageRange) {
        if (range === "18-25") {
          ageConditions.push({ age: { gte: 18, lte: 25 } });
        } else if (range === "26-35") {
          ageConditions.push({ age: { gte: 26, lte: 35 } });
        } else if (range === "36-45") {
          ageConditions.push({ age: { gte: 36, lte: 45 } });
        } else if (range === "46-55") {
          ageConditions.push({ age: { gte: 46, lte: 55 } });
        } else if (range === "55+") {
          ageConditions.push({ age: { gt: 55 } });
        }
      }
      if (ageConditions.length > 0) {
        whereClause.OR = whereClause.OR
          ? [...whereClause.OR, ...ageConditions]
          : ageConditions;
      }
    }

    // Product category filter
    if (filters.productCategory && filters.productCategory.length > 0) {
      whereClause.productCategory = {
        in: filters.productCategory,
      };
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      whereClause.tags = {
        hasSome: filters.tags,
      };
    }

    // Payment method filter
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      whereClause.paymentMethod = {
        in: filters.paymentMethod,
      };
    }

    // Date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      if (start && end) {
        whereClause.date = {
          gte: new Date(start),
          lte: new Date(end + "T23:59:59Z"),
        };
      }
    }

    // Determine order by
    let orderBy = {};
    switch (sortBy) {
      case "date":
        orderBy.date = sortOrder === "asc" ? "asc" : "desc";
        break;
      case "dateNewest":
        orderBy.date = "desc";
        break;
      case "dateOldest":
        orderBy.date = "asc";
        break;
      case "quantity":
        orderBy.quantity = sortOrder === "asc" ? "asc" : "desc";
        break;
      case "customerName":
      default:
        orderBy.customerName = sortOrder === "asc" ? "asc" : "desc";
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Get total count
    const totalCount = await prisma.salesRecord.count({
      where: whereClause,
    });

    // Get paginated records
    const records = await prisma.salesRecord.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: records,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get all unique filter values for dropdowns
   */
  static async getFilterOptions() {
    const [regions, genders, categories, paymentMethods, tags] =
      await Promise.all([
        prisma.salesRecord.findMany({
          select: { customerRegion: true },
          distinct: ["customerRegion"],
        }),
        prisma.salesRecord.findMany({
          select: { gender: true },
          distinct: ["gender"],
        }),
        prisma.salesRecord.findMany({
          select: { productCategory: true },
          distinct: ["productCategory"],
        }),
        prisma.salesRecord.findMany({
          select: { paymentMethod: true },
          distinct: ["paymentMethod"],
        }),
        prisma.salesRecord.findMany({
          select: { tags: true },
        }),
      ]);

    // Extract unique tags
    const uniqueTags = [...new Set(tags.flatMap((record) => record.tags))];

    return {
      customerRegion: regions.map((r) => r.customerRegion).filter(Boolean),
      gender: genders.map((g) => g.gender).filter(Boolean),
      productCategory: categories
        .map((c) => c.productCategory)
        .filter(Boolean),
      paymentMethod: paymentMethods
        .map((p) => p.paymentMethod)
        .filter(Boolean),
      tags: uniqueTags,
      ageRanges: ["18-25", "26-35", "36-45", "46-55", "55+"],
    };
  }

  /**
   * Get summary statistics
   */
  static async getSummary(filters = {}) {
    const whereClause = {};

    // Apply same filters as getSalesRecords
    if (filters.customerRegion && filters.customerRegion.length > 0) {
      whereClause.customerRegion = { in: filters.customerRegion };
    }
    if (filters.productCategory && filters.productCategory.length > 0) {
      whereClause.productCategory = { in: filters.productCategory };
    }

    const records = await prisma.salesRecord.findMany({
      where: whereClause,
    });

    const totalUnits = records.reduce((sum, r) => sum + r.quantity, 0);
    const totalRevenue = records.reduce((sum, r) => sum + r.finalAmount, 0);
    const totalSales = records.length;
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    return {
      totalUnits,
      totalRevenue,
      totalSales,
      avgOrderValue,
    };
  }
}
