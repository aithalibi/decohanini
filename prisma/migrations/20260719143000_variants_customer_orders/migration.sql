-- New customer accounts are the safe default; the seeded administrator keeps its existing role.
ALTER TABLE `user`
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'CUSTOMER';

CREATE TABLE `productvariant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `oldPrice` DECIMAL(10, 2) NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductVariant_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `order`
    ADD COLUMN `userId` INTEGER NULL;

ALTER TABLE `orderitem`
    ADD COLUMN `variantName` VARCHAR(191) NULL,
    ADD COLUMN `variantId` INTEGER NULL;

CREATE INDEX `Order_userId_fkey` ON `order`(`userId`);
CREATE INDEX `OrderItem_variantId_fkey` ON `orderitem`(`variantId`);

ALTER TABLE `productvariant`
    ADD CONSTRAINT `ProductVariant_productId_fkey`
    FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `order`
    ADD CONSTRAINT `Order_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `orderitem`
    ADD CONSTRAINT `OrderItem_variantId_fkey`
    FOREIGN KEY (`variantId`) REFERENCES `productvariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
