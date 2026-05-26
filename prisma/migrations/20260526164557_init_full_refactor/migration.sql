-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `legal_entities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `inn` VARCHAR(191) NOT NULL,
    `ogrn` VARCHAR(191) NULL,
    `kpp` VARCHAR(191) NULL,
    `legalAddress` VARCHAR(191) NULL,
    `ownerUserId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `legal_entities_inn_key`(`inn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ownerType` ENUM('INDIVIDUAL', 'LEGAL') NOT NULL,
    `ownerUserId` INTEGER NULL,
    `ownerLegalId` INTEGER NULL,
    `type` ENUM('DEBIT', 'CREDIT') NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `cardLastFour` VARCHAR(4) NULL,
    `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'RUB',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `creditLimit` DECIMAL(15, 2) NULL,
    `gracePeriodDays` INTEGER NULL,
    `interestRate` DECIMAL(5, 2) NULL,
    `minPayment` DECIMAL(15, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `accounts_accountNumber_key`(`accountNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ownerType` ENUM('INDIVIDUAL', 'LEGAL') NOT NULL,
    `ownerUserId` INTEGER NULL,
    `ownerLegalId` INTEGER NULL,
    `accountId` INTEGER NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `type` ENUM('PAYMENT', 'TRANSFER_OUT', 'TRANSFER_IN', 'INCOME', 'REFUND', 'CREDIT_PAYMENT') NOT NULL,
    `counterparty` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `legal_entities` ADD CONSTRAINT `legal_entities_ownerUserId_fkey` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_ownerUserId_fkey` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_ownerLegalId_fkey` FOREIGN KEY (`ownerLegalId`) REFERENCES `legal_entities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ownerUserId_fkey` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ownerLegalId_fkey` FOREIGN KEY (`ownerLegalId`) REFERENCES `legal_entities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
