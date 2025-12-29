# API Implementation Plan

## Overview
This document outlines the REST API endpoints needed to replace mock data with database operations.

## API Route Structure

All API routes will be created in the `app/api/` directory following Next.js App Router conventions.

## API Endpoints

### 1. Customers API (`/api/customers`)

#### GET /api/customers
- **Purpose**: List all customers with optional filtering
- **Query Params**: `search`, `type` (corporate/online)
- **Response**: Array of customer objects
- **File**: `app/api/customers/route.ts`

#### POST /api/customers
- **Purpose**: Create new customer
- **Body**: Customer data (name, email, contactNumber, address, type)
- **Response**: Created customer object
- **Validation**: Unique customer code

#### GET /api/customers/[id]
- **Purpose**: Get single customer details
- **Response**: Customer object with related invoices
- **File**: `app/api/customers/[id]/route.ts`

#### PUT /api/customers/[id]
- **Purpose**: Update customer
- **Body**: Updated customer fields
- **Response**: Updated customer object

#### DELETE /api/customers/[id]
- **Purpose**: Delete customer
- **Response**: Success message
- **Cascade**: Deletes related invoices and payments

---

### 2. Products API (`/api/products`)

#### GET /api/products
- **Purpose**: List all products
- **Query Params**: `search`, `category`
- **Response**: Array of product objects
- **File**: `app/api/products/route.ts`

#### POST /api/products
- **Purpose**: Create new product
- **Body**: Product data (code, name, price, cost, salesMargin, gst, stock)
- **Response**: Created product object
- **Validation**: Unique product code

#### GET /api/products/[id]
- **Purpose**: Get single product
- **Response**: Product object
- **File**: `app/api/products/[id]/route.ts`

#### PUT /api/products/[id]
- **Purpose**: Update product
- **Body**: Updated product fields
- **Response**: Updated product object

#### DELETE /api/products/[id]
- **Purpose**: Delete product
- **Response**: Success message
- **Check**: Prevent deletion if used in invoices

---

### 3. Invoices API (`/api/invoices`)

#### GET /api/invoices
- **Purpose**: List invoices with filtering
- **Query Params**: `status` (paid/partial/pending), `customerId`, `search`, `limit`
- **Response**: Array of invoices with customer and line items
- **File**: `app/api/invoices/route.ts`

#### POST /api/invoices
- **Purpose**: Create new invoice
- **Body**: Invoice data with line items array
- **Response**: Created invoice object
- **Logic**: 
  - Generate invoice number
  - Calculate totals
  - Create line items
  - Update invoice status

#### GET /api/invoices/[id]
- **Purpose**: Get single invoice with full details
- **Response**: Invoice with customer, line items, and payments
- **File**: `app/api/invoices/[id]/route.ts`

#### PUT /api/invoices/[id]
- **Purpose**: Update invoice (rare, mainly for corrections)
- **Body**: Updated invoice fields
- **Response**: Updated invoice

#### DELETE /api/invoices/[id]
- **Purpose**: Delete invoice
- **Response**: Success message
- **Cascade**: Deletes line items and payment links

---

### 4. Payments API (`/api/payments`)

#### GET /api/payments
- **Purpose**: List all payments
- **Query Params**: `customerId`, `search`, `startDate`, `endDate`
- **Response**: Array of payments with invoice details
- **File**: `app/api/payments/route.ts`

#### POST /api/payments
- **Purpose**: Record new payment for one or multiple invoices
- **Body**: Payment data with invoiceIds array
- **Response**: Created payment object
- **Logic**:
  - Create payment record
  - Create PaymentInvoice links
  - Update invoice amountPaid and balance
  - Update invoice status (PAID/PARTIAL)
  - Distribute payment across invoices

#### GET /api/payments/[id]
- **Purpose**: Get payment details
- **Response**: Payment with linked invoices
- **File**: `app/api/payments/[id]/route.ts`

---

### 5. Users API (`/api/users`)

#### GET /api/users
- **Purpose**: List all users
- **Response**: Array of users (without passwords)
- **File**: `app/api/users/route.ts`
- **Auth**: Require admin authentication

#### POST /api/users
- **Purpose**: Create new user
- **Body**: User data (name, email, password)
- **Response**: Created user
- **Logic**: Hash password with bcrypt

#### PUT /api/users/[id]
- **Purpose**: Update user
- **Body**: Updated fields
- **Response**: Updated user
- **File**: `app/api/users/[id]/route.ts`
- **Logic**: Hash password if changed

#### DELETE /api/users/[id]
- **Purpose**: Delete user
- **Response**: Success message

---

### 6. Settings API (`/api/settings`)

#### GET /api/settings/company
- **Purpose**: Get company settings
- **Response**: CompanySettings object
- **File**: `app/api/settings/company/route.ts`

#### PUT /api/settings/company
- **Purpose**: Update company settings
- **Body**: Updated company fields
- **Response**: Updated settings

#### GET /api/settings/bank
- **Purpose**: Get bank details
- **Response**: BankDetails object
- **File**: `app/api/settings/bank/route.ts`

#### PUT /api/settings/bank
- **Purpose**: Update bank details
- **Body**: Updated bank fields
- **Response**: Updated details

#### GET /api/settings/invoice
- **Purpose**: Get invoice settings
- **Response**: InvoiceSettings object
- **File**: `app/api/settings/invoice/route.ts`

#### PUT /api/settings/invoice
- **Purpose**: Update invoice settings
- **Body**: Updated invoice fields
- **Response**: Updated settings

---

### 7. Dashboard API (`/api/dashboard`)

#### GET /api/dashboard/stats
- **Purpose**: Get dashboard KPIs
- **Response**: 
  ```json
  {
    "totalSales": 46610,
    "outstanding": 10060,
    "totalInvoices": 2,
    "totalCustomers": 2,
    "totalProducts": 3
  }
  ```
- **File**: `app/api/dashboard/stats/route.ts`

#### GET /api/dashboard/recent-invoices
- **Purpose**: Get 5 most recent invoices
- **Response**: Array of invoices
- **File**: `app/api/dashboard/recent-invoices/route.ts`

---

## Implementation Details

### Error Handling

All API routes should return standard error responses:

```typescript
{
  error: string,
  message: string,
  statusCode: number
}
```

### Response Format

Success responses:

```typescript
{
  success: true,
  data: any,
  message?: string
}
```

### Authentication Middleware

Create middleware to protect routes:
- File: `middleware.ts`
- Check user session
- Verify permissions

### Validation

Use Zod schemas for request validation:
- File: `lib/validations/`
- Separate schema files per entity

### Database Queries

Use Prisma Client with:
- Transaction support for complex operations
- Proper error handling
- Connection pooling

## Frontend Integration

### Update Components

1. **Replace useState with API calls**
   - Use fetch or axios
   - Add loading states
   - Add error handling

2. **Forms**
   - Submit to API endpoints
   - Handle validation errors
   - Show success messages

3. **Lists**
   - Fetch data on mount
   - Implement pagination
   - Add refresh functionality

### Example API Call Pattern

```typescript
// Fetch customers
const fetchCustomers = async () => {
  setLoading(true)
  try {
    const response = await fetch('/api/customers')
    const { data } = await response.json()
    setCustomers(data)
  } catch (error) {
    console.error('Error fetching customers:', error)
  } finally {
    setLoading(false)
  }
}

// Create customer
const createCustomer = async (customerData) => {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    })
    const { data } = await response.json()
    return data
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}
```

## Testing Strategy

1. **Unit Tests**: Test each API route
2. **Integration Tests**: Test API with database
3. **E2E Tests**: Test full user flows

## Deployment Considerations

1. **Environment Variables**: Production DATABASE_URL
2. **Connection Pooling**: Configure for production load
3. **Rate Limiting**: Prevent API abuse
4. **CORS**: Configure for production domain
5. **Logging**: Implement request/error logging

## Migration Timeline

### Phase 1: Setup (Completed)
- ✅ Database schema
- ✅ Prisma configuration
- ✅ Seed script

### Phase 2: API Development (Next)
- [ ] Customers API
- [ ] Products API
- [ ] Invoices API
- [ ] Payments API
- [ ] Users API
- [ ] Settings API
- [ ] Dashboard API

### Phase 3: Frontend Integration
- [ ] Update customer pages
- [ ] Update product pages
- [ ] Update invoice pages
- [ ] Update payment pages
- [ ] Update settings page
- [ ] Update dashboard

### Phase 4: Testing & Polish
- [ ] API testing
- [ ] Frontend testing
- [ ] Error handling
- [ ] Performance optimization

## Next Steps

1. Install dependencies: `pnpm install`
2. Set up PostgreSQL database
3. Configure `.env` file
4. Run migrations: `pnpm db:migrate`
5. Seed database: `pnpm db:seed`
6. Start implementing API routes
7. Update frontend components
8. Test and validate

## Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Zod Validation](https://zod.dev/)
