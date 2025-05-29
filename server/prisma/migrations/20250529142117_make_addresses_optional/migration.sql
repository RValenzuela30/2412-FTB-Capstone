-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'customer',
ALTER COLUMN "mailingAddress" DROP NOT NULL,
ALTER COLUMN "billingInfo" DROP NOT NULL;
