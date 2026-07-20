ALTER TABLE `sitesettings`
    MODIFY `whatsappNumber` VARCHAR(191) NOT NULL DEFAULT '212714516493';

UPDATE `sitesettings`
SET `whatsappNumber` = '212714516493'
WHERE `whatsappNumber` = '212777422673';
