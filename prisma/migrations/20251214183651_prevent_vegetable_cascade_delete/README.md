# Migration: Prevent Vegetable Cascade Delete

## Problem
Vegetables that were included by admins in orders were disappearing from the "choose vegetables" form. This happened because the database schema had `ON DELETE CASCADE` constraints on the vegetable foreign keys in both `OrderVegetable` and `UserOrderVegetable` tables.

When a vegetable was deleted from the database (manually or otherwise), all related order records were automatically deleted, causing vegetables to vanish from existing orders.

## Solution
Changed the `onDelete` behavior from `CASCADE` to `RESTRICT` for vegetable relations in:
- `OrderVegetable.vegetable`
- `UserOrderVegetable.vegetable`

This ensures that:
1. Vegetables cannot be deleted if they are part of any existing orders
2. Historical order data is preserved
3. The proper workflow is to mark vegetables as `hidden: true` instead of deleting them

## Applying the Migration
To apply this migration, run:
```bash
pnpm prisma migrate deploy
```

Or if in development:
```bash
pnpm prisma migrate dev
```

## Verification
After applying, try to delete a vegetable that's part of an existing order - the database should reject the deletion with a foreign key constraint error.
