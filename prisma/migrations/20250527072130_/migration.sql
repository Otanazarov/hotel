-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_roomId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
