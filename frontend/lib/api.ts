// API service for sales data
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface SalesRecord {
  id: string;
  transactionId: string;
  date: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  gender: string;
  age: number;
  customerRegion: string;
  productCategory: string;
  tags: string[];
  quantity: number;
  pricePerUnit: number;
  discountPercentage: number;
  totalAmount: number;
  finalAmount: number;
  paymentMethod: string;
}

export interface SalesQueryParams {
  search?: string;
  customerRegion?: string[];
  gender?: string[];
  ageRange?: string[];
  productCategory?: string[];
  tags?: string[];
  paymentMethod?: string[];
  dateRangeStart?: string;
  dateRangeEnd?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

export interface SalesResponse {
  data: SalesRecord[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FilterOptions {
  customerRegion: string[];
  gender: string[];
  productCategory: string[];
  paymentMethod: string[];
  tags: string[];
  ageRanges: string[];
}

export interface SalesStats {
  totalUnits: number;
  totalRevenue: number;
  totalSales: number;
  avgOrderValue: number;
}

class SalesAPIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/sales`;
  }

  /**
   * Build query string from params
   */
  private buildQueryString(params: SalesQueryParams): string {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append("search", params.search);
    if (params.customerRegion?.length) {
      params.customerRegion.forEach((r) => searchParams.append("customerRegion", r));
    }
    if (params.gender?.length) {
      params.gender.forEach((g) => searchParams.append("gender", g));
    }
    if (params.ageRange?.length) {
      params.ageRange.forEach((a) => searchParams.append("ageRange", a));
    }
    if (params.productCategory?.length) {
      params.productCategory.forEach((c) => searchParams.append("productCategory", c));
    }
    if (params.tags?.length) {
      params.tags.forEach((t) => searchParams.append("tags", t));
    }
    if (params.paymentMethod?.length) {
      params.paymentMethod.forEach((p) => searchParams.append("paymentMethod", p));
    }
    if (params.dateRangeStart) {
      searchParams.append("dateRangeStart", params.dateRangeStart);
    }
    if (params.dateRangeEnd) {
      searchParams.append("dateRangeEnd", params.dateRangeEnd);
    }
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.page) searchParams.append("page", String(params.page));
    if (params.pageSize) searchParams.append("pageSize", String(params.pageSize));

    return searchParams.toString();
  }

  /**
   * Get sales records with filters, search, sort, and pagination
   */
  async getSalesRecords(params: SalesQueryParams): Promise<SalesResponse> {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseUrl}?${queryString}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sales records: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get available filter options
   */
  async getFilterOptions(): Promise<FilterOptions> {
    const url = `${this.baseUrl}/filters/options`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch filter options: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get sales summary statistics
   */
  async getSalesSummary(filters?: {
    customerRegion?: string[];
    productCategory?: string[];
  }): Promise<SalesStats> {
    const params = new URLSearchParams();

    if (filters?.customerRegion?.length) {
      filters.customerRegion.forEach((r) => params.append("customerRegion", r));
    }
    if (filters?.productCategory?.length) {
      filters.productCategory.forEach((c) => params.append("productCategory", c));
    }

    const url = `${this.baseUrl}/summary?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sales summary: ${response.statusText}`);
    }

    return response.json();
  }
}

export const salesAPI = new SalesAPIService();
