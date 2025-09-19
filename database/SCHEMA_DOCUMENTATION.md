# NourishNet Database Schema Documentation

## Overview
This schema is designed for the NourishNet platform, supporting donors, recipients, and food providers. It follows best practices for normalization, indexing, and data integrity.

## Entities & Relationships
- **Users**: Core entity for donors, recipients, and providers. Has a `balance` for donor deposits.
- **FoodProviders**: Linked to Users, represents organizations/individuals providing food.
- **Requests**: Food requests made by users (recipients). Status managed via ENUM.
- **Donations**: Food donations made by users (donors). Status managed via ENUM.
- **Orders**: Connects requests and donations, tracks fulfillment.
- **Transactions**: Records deposits and deductions for donor accounts.

## Constraints & Validation
- UUIDs for all primary keys.
- Foreign keys for relationships, with `ON DELETE CASCADE` for referential integrity.
- ENUM types for status fields to restrict allowed values.
- Unique constraint on user email.
- Quantity fields must be positive integers.
- Role field restricted to allowed values.

## Indexing Strategy
- Indexes on foreign keys and status columns for fast queries.
- Composite indexes can be added for advanced reporting if needed.

## Data Types
- `TEXT` for names, emails, addresses, and descriptions.
- `NUMERIC(12,2)` for monetary values.
- `TIMESTAMP WITH TIME ZONE` for all date/time fields.

## Seeding Strategy
- Initial seed data for users, providers, transactions, requests, donations, and orders.
- Use realistic values for development and testing.

## Schema Decisions
- Separation of transactions for auditability and transparency.
- Use of ENUMs for workflow management.
- Cascade deletes to maintain data consistency.

## Future Considerations
- Add audit logs for sensitive actions.
- Expand ENUMs as workflows evolve.
- Add composite indexes for analytics.
