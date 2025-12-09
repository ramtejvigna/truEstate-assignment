# Architecture Documentation - TruEstate Sales Management System

## System Overview

The TruEstate Sales Management System is a full-stack retail sales management platform built with **Next.js (Frontend)**, **Express.js (Backend)**, **Prisma ORM**, and **PostgreSQL**. It enables users to search, filter, sort, and paginate sales records efficiently.

## Backend Architecture

### Technology Stack
- **Framework**: Express.js 4.18.2 (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma 5.8.0
- **Additional**: CORS, dotenv

### Folder Structure

```
backend/
├── src/
│   ├── index.js              # Main application entry point
│   ├── controllers/
│   │   └── salesController.js # API request handlers
│   ├── services/
│   │   └── salesService.js   # Business logic & database queries
│   ├── routes/
│   │   └── salesRoutes.js    # API route definitions
│   └── utils/
│       └── helpers.js        # Utility functions
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   └── seed.js              # Database seeding script
├── .env                      # Environment variables
├── .env.example             # Example environment template
└── package.json             # Dependencies & scripts
```

### Core Modules

#### 1. **SalesService** (`src/services/salesService.js`)
Handles all database operations and business logic:

- **getSalesRecords()**: Main data fetching function with:
  - Search by customer name or phone (case-insensitive)
  - Multi-select filters (AND logic):
    - Customer region
    - Gender
    - Age range (18-25, 26-35, 36-45, 46-55, 55+)
    - Product category
    - Tags (multi-select)
    - Payment method
  - Date range filtering
  - Sorting (date, quantity, customer name)
  - Pagination with offset/limit
  - Returns: `{ data, pagination }`

- **getFilterOptions()**: Returns available filter values for UI dropdowns
- **getSummary()**: Calculates KPIs (total units, revenue, sales count, average order value)

#### 2. **SalesController** (`src/controllers/salesController.js`)
Handles HTTP requests and response formatting:

- **GET /api/sales**: Returns paginated sales records
  - Query parameters: search, filters, sorting, pagination
  - Parses array parameters correctly
  - Returns standardized JSON response

- **GET /api/sales/filters/options**: Returns filter dropdown options
- **GET /api/sales/summary**: Returns summary statistics

#### 3. **Routes** (`src/routes/salesRoutes.js`)
Defines API endpoints:
```
GET /api/sales                 - Get sales records
GET /api/sales/filters/options - Get filter options
GET /api/sales/summary         - Get summary stats
```

#### 4. **Utilities** (`src/utils/helpers.js`)
Helper functions for:
- Date validation
- Age range parsing
- Currency formatting
- Date formatting

### Database Schema

**SalesRecord Model**:
```
- id (String, @id, default cuid)
- transactionId (String, @unique)
- date (DateTime)
- customerId (String)
- customerName (String, @indexed)
- phoneNumber (String)
- gender (String)
- age (Int)
- customerRegion (String, @indexed)
- productCategory (String, @indexed)
- tags (String[])
- quantity (Int)
- pricePerUnit (Float)
- discountPercentage (Float)
- totalAmount (Float)
- finalAmount (Float)
- paymentMethod (String, @indexed)
- createdAt (DateTime, @default now)
- updatedAt (DateTime, @updatedAt)
```

**Indexes**: Customer name, date, region, category, payment method for optimal query performance.

### API Endpoints Documentation

#### GET /api/sales
**Parameters**:
- `search` (string): Search by customer name or phone
- `customerRegion` (string[]): Filter by regions
- `gender` (string[]): Filter by gender
- `ageRange` (string[]): Filter by age ranges
- `productCategory` (string[]): Filter by product categories
- `tags` (string[]): Filter by product tags
- `paymentMethod` (string[]): Filter by payment methods
- `dateRangeStart` (date): Start date for date range
- `dateRangeEnd` (date): End date for date range
- `sortBy` (string): Sort field (customerName, date, quantity)
- `sortOrder` (string): asc or desc
- `page` (number): Page number (1-indexed)
- `pageSize` (number): Items per page (default: 10)

**Response**:
```json
{
  "data": [SalesRecord...],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalCount": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### GET /api/sales/filters/options
**Response**:
```json
{
  "customerRegion": ["North", "South", "East", "West"],
  "gender": ["Male", "Female", "Other"],
  "productCategory": ["Clothing", "Electronics", ...],
  "paymentMethod": ["Cash", "Credit Card", ...],
  "tags": ["Premium", "Discounted", ...],
  "ageRanges": ["18-25", "26-35", ...]
}
```

#### GET /api/sales/summary
**Parameters**:
- `customerRegion` (string[]): Optional - filter by regions
- `productCategory` (string[]): Optional - filter by categories

**Response**:
```json
{
  "totalUnits": 500,
  "totalRevenue": 250000,
  "totalSales": 45,
  "avgOrderValue": 5555.55
}
```

---

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 16.0.7 with App Router
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI (dropdown menus)
- **Icons**: Lucide React

### Folder Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── sales-management-system.tsx  # Main container component
│   ├── filter-bar.tsx              # Filter UI
│   ├── sidebar.tsx                 # Navigation sidebar
│   ├── data-table.tsx              # Sales data display
│   ├── pagination.tsx              # Pagination controls
│   ├── summary-cards.tsx           # KPI cards
│   └── ui/                         # Reusable UI components
│       ├── button.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       └── table.tsx
├── lib/
│   ├── api.ts                      # API service layer
│   ├── sales-data.ts               # (Deprecated - kept for reference)
│   └── utils.ts
├── .env.local                      # Environment variables
└── package.json
```

### Core Components

#### 1. **SalesManagementSystem** (`components/sales-management-system.tsx`)
Main container component that:
- Manages application state (filters, search, sorting, pagination)
- Fetches data from backend API
- Handles loading and error states
- Shows "No Results" when appropriate
- Coordinates between UI components

**State Management**:
```typescript
- searchQuery: string
- filters: { customerRegion, gender, ageRange, productCategory, tags, paymentMethod, dateRange }
- sortBy: string
- currentPage: number
- salesData: SalesRecord[]
- totalPages: number
- totalCount: number
- loading: boolean
- error: string | null
- filterOptions: FilterOptions
- summary: SalesStats
```

#### 2. **FilterBar** (`components/filter-bar.tsx`)
Displays filter dropdowns and sorting:
- Renders multi-select filters from API-provided options
- Handles filter changes with AND logic
- Includes date range picker
- Sorting dropdown (date, quantity, customer name)
- Resets page to 1 when filters change

#### 3. **DataTable** (`components/data-table.tsx`)
Displays sales records in a table format:
- Shows all relevant columns (transaction ID, customer, amount, etc.)
- Responsive design
- Handles empty state

#### 4. **Pagination** (`components/pagination.tsx`)
Shows page navigation:
- Page number buttons
- Previous/Next functionality
- Ellipsis for large page counts
- Respects search, filters, and sorting

#### 5. **SummaryCards** (`components/summary-cards.tsx`)
Displays KPI cards:
- Total units sold
- Total revenue
- Total discount
- Sales records count

#### 6. **Additional Components**:
- **Sidebar**: Navigation and app branding
- **UI Components**: Button, Input, Dropdown, Table (Radix UI based)

### API Service Layer

**File**: `lib/api.ts`

```typescript
class SalesAPIService {
  getSalesRecords(params): Promise<SalesResponse>
  getFilterOptions(): Promise<FilterOptions>
  getSalesSummary(filters?): Promise<SalesStats>
}

export const salesAPI = new SalesAPIService()
```

**Key Features**:
- Converts UI state to API query parameters
- Handles array parameters correctly
- Error handling and type safety
- Base URL from environment variable

### Data Flow

1. **On Mount**: Load filter options from API
2. **On Filter/Search/Sort/Page Change**:
   - Update local state
   - Reset page to 1 (for filter/search/sort changes)
   - Trigger API call
3. **API Call**:
   - Build query string with current filters
   - Fetch from `/api/sales`
   - Update sales data and pagination info
   - Fetch summary stats
4. **Render**:
   - Display loading state while fetching
   - Show data in table once loaded
   - Show "No Results" if data is empty
   - Display pagination controls

---

## Data Flow Diagram

```
User Interaction
    ↓
Component State Update
    ↓
API Call with Query Parameters
    ↓
Backend Route Handler
    ↓
Service Layer (Business Logic)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓
Response JSON
    ↓
Frontend State Update
    ↓
Component Re-render
```

---

## Feature Implementation Details

### 1. **Search** 
- **Backend**: Case-insensitive search using Prisma's `mode: "insensitive"`
- **Query**: `WHERE customerName ILIKE search OR phoneNumber ILIKE search`
- **Frontend**: Real-time input, triggers API call on change
- **UX**: Resets pagination to page 1

### 2. **Filters**
- **AND Logic**: Multiple filters combine with AND operator
- **Age Range**: Converted to numeric conditions (18-25 → age >= 18 AND age <= 25)
- **Tags**: Uses `hasSome` operator for array matching
- **Date Range**: Inclusive on both ends (start 00:00:00 to end 23:59:59)
- **State**: Persisted across page changes

### 3. **Sorting**
- **Supported Fields**: Customer name (A-Z), Date (newest/oldest), Quantity
- **Default**: Customer name (ascending)
- **Backend**: Uses Prisma's `orderBy` parameter
- **Frontend**: Dropdown with pre-defined options

### 4. **Pagination**
- **Page Size**: 10 items per page (configurable)
- **Calculation**: `skip = (page - 1) * pageSize`
- **Info**: Shows total count, current page, total pages
- **UI**: Numbered buttons with ellipsis for large ranges
- **State**: Resets to page 1 when filters/search/sort changes

---

## Edge Cases Handled

1. **No Results Found**
   - Shows user-friendly message
   - Allows filter adjustment

2. **Invalid Date Range**
   - Start date after end date: Not filtered
   - Invalid date format: Not filtered

3. **Reversed Age Range**
   - Not possible with dropdown UI
   - Backend validates if needed

4. **Missing Fields**
   - Database enforces not-null constraints
   - Null values handled gracefully in frontend

5. **Large Filter Combinations**
   - Backend uses indexed fields for performance
   - Efficient query execution

6. **Network Errors**
   - Try-catch blocks in API service
   - Error messages displayed to user
   - Graceful degradation

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/tru_estate
NODE_ENV=development
PORT=3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Performance Considerations

1. **Database Indexes**: Added on frequently queried fields
2. **Pagination**: Limits data transfer per request
3. **API Caching**: Summary stats cached via React hooks
4. **Component Optimization**: useCallback for event handlers
5. **Query Optimization**: Prisma selects only needed fields

---

## Security Considerations

1. **Input Validation**: Array parameters validated on backend
2. **SQL Injection**: Protected by Prisma ORM
3. **CORS**: Configured to accept frontend requests
4. **Environment Variables**: Sensitive data not exposed to frontend

---

## Deployment Notes

### Backend
- Requires PostgreSQL database
- Environment variables must be set
- Run `npm install` then `npm run prisma:migrate`
- Run `npm run prisma:seed` to populate sample data
- Start with `npm run dev` or `npm start`

### Frontend
- Requires Node.js 18+
- Run `npm install`
- Set `NEXT_PUBLIC_API_URL` to backend URL
- Run `npm run build` for production
- Run `npm start` or deploy to Vercel

---

## Testing Edge Cases

### Test Scenarios
1. Empty search: Should return all records
2. Multiple filters: Should apply AND logic
3. Invalid date range: Should ignore range
4. No matching records: Should show "No Results"
5. Page boundary: Should not show invalid page numbers
6. Large dataset: Should paginate correctly

---

## Future Enhancements

1. **Analytics**: Revenue charts, trend analysis
2. **Export**: CSV/PDF export functionality
3. **User Authentication**: Role-based access control
4. **Advanced Filters**: Custom date ranges, price ranges
5. **Real-time Updates**: WebSocket for live data
6. **Caching**: Redis for frequently accessed data
7. **API Documentation**: Swagger/OpenAPI specs

