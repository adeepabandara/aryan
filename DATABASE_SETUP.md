# Database Setup Guide

## Overview
This guide will help you set up the PostgreSQL database for the Billing Application.

## Database Schema
The application uses **PostgreSQL** with **Prisma ORM** and includes the following entities:

### Entities
1. **Customers** - Customer management with types (Corporate/Online)
2. **Products** - Product catalog with pricing and inventory
3. **Invoices** - Invoice generation with line items
4. **InvoiceLineItems** - Individual items on each invoice
5. **Payments** - Payment recording with multiple invoices support
6. **PaymentInvoices** - Junction table for payment-invoice relationship
7. **Users** - User management for authentication
8. **CompanySettings** - Company information
9. **BankDetails** - Bank account details
10. **InvoiceSettings** - Invoice configuration

### Key Relationships
- Invoice → Customer (Many-to-One)
- InvoiceLineItem → Invoice (Many-to-One)
- InvoiceLineItem → Product (Many-to-One)
- Payment → Customer (Many-to-One)
- PaymentInvoice → Payment & Invoice (Many-to-Many)

## Setup Instructions

### 1. Install PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
Download and install from: https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
# Access PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE billing_db;
CREATE USER billing_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE billing_db TO billing_user;

# Exit psql
\q
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and update the DATABASE_URL:

```env
DATABASE_URL="postgresql://billing_user:your_secure_password@localhost:5432/billing_db?schema=public"
NEXTAUTH_SECRET="generate-a-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Install Dependencies

```bash
pnpm install
```

This will install:
- `@prisma/client` - Prisma Client for database queries
- `prisma` - Prisma CLI for migrations
- `bcrypt` - Password hashing
- `tsx` - TypeScript execution for seed script

### 5. Generate Prisma Client

```bash
pnpm db:generate
```

### 6. Run Database Migrations

```bash
pnpm db:migrate
```

This will:
- Create all database tables
- Set up relationships and indexes
- Apply constraints and defaults

### 7. Seed Initial Data

```bash
pnpm db:seed
```

This will populate:
- Company settings
- Bank details
- Invoice settings
- Admin user (email: admin@aryanproducts.com, password: admin123)
- 2 sample customers
- 3 sample products
- 2 sample invoices (1 paid, 1 partial)
- 2 sample payments

## Available Database Scripts

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema changes without migration (dev only)
pnpm db:push

# Create and run migrations
pnpm db:migrate

# Open Prisma Studio (GUI database browser)
pnpm db:studio

# Seed database with initial data
pnpm db:seed
```

## Prisma Studio

View and edit your database with a GUI:

```bash
pnpm db:studio
```

This opens at: http://localhost:5555

## Database Indexes

The schema includes indexes on:
- Customer: `code`, `name`
- Product: `code`, `name`
- Invoice: `invoiceNumber`, `customerId`, `status`, `invoiceDate`
- Payment: `paymentNumber`, `customerId`, `date`
- User: `email`

## Next Steps

After database setup:

1. **API Routes** - Create Next.js API routes in `app/api/`
2. **Frontend Integration** - Replace mock data with API calls
3. **Authentication** - Implement NextAuth for user login
4. **Validation** - Add Zod schemas for data validation

## Troubleshooting

### Connection Issues

1. Check PostgreSQL is running:
   ```bash
   brew services list  # macOS
   sudo systemctl status postgresql  # Linux
   ```

2. Verify DATABASE_URL in `.env`

3. Test connection:
   ```bash
   psql $DATABASE_URL
   ```

### Migration Errors

Reset database (WARNING: deletes all data):
```bash
pnpm prisma migrate reset
```

### Seed Script Errors

Clear and re-seed:
```bash
pnpm prisma db push --force-reset
pnpm db:seed
```

## Production Considerations

1. **Environment Variables** - Use secure passwords
2. **SSL Connection** - Enable SSL for production databases
3. **Connection Pooling** - Consider PgBouncer for high traffic
4. **Backups** - Set up automated backups
5. **Monitoring** - Use tools like pg_stat_statements

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
