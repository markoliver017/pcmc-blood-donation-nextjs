-- ALTER TABLE users DROP INDEX email_31;
SET FOREIGN_KEY_CHECKS = 0;
SELECT 
    CONSTRAINT_NAME, 
    TABLE_NAME 
FROM 
    information_schema.KEY_COLUMN_USAGE 
WHERE 
    TABLE_NAME = 'screening_details' 
    AND CONSTRAINT_SCHEMA = 'blood_donation_db';
    -- AND REFERENCED_TABLE_NAME IS NOT NULL;
    
    -- USE blood_donation_db;
    -- ALTER TABLE users DROP FOREIGN KEY users_ibfk_16;