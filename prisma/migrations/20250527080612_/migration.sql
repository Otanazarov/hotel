-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
