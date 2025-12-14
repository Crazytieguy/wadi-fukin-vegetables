-- AlterTable: Change onDelete behavior for vegetable foreign keys to prevent cascade deletion
-- This ensures that vegetables cannot be deleted if they are part of any existing orders

-- Drop existing foreign key constraints
ALTER TABLE "OrderVegetable" DROP CONSTRAINT "OrderVegetable_vegetableId_fkey";
ALTER TABLE "UserOrderVegetable" DROP CONSTRAINT "UserOrderVegetable_vegetableId_fkey";

-- Re-add foreign key constraints with RESTRICT instead of CASCADE
ALTER TABLE "OrderVegetable" ADD CONSTRAINT "OrderVegetable_vegetableId_fkey"
    FOREIGN KEY ("vegetableId") REFERENCES "Vegetable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserOrderVegetable" ADD CONSTRAINT "UserOrderVegetable_vegetableId_fkey"
    FOREIGN KEY ("vegetableId") REFERENCES "Vegetable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
