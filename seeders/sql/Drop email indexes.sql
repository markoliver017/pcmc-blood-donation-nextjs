SELECT 
    CONCAT('ALTER TABLE ', TABLE_NAME, ' DROP ', 
    IF(CONSTRAINT_NAME LIKE 'PRIMARY', 'PRIMARY KEY', 
    IF(CONSTRAINT_NAME LIKE 'fk_%', 'FOREIGN KEY', 'CONSTRAINT')), ' ', 
    CONSTRAINT_NAME, ';') AS drop_statement
FROM 
    information_schema.KEY_COLUMN_USAGE 
WHERE 
    TABLE_NAME = 'users' 
    AND CONSTRAINT_SCHEMA = 'blood_donation_db';