-- Add donor_type column
ALTER TABLE donors 
ADD COLUMN donor_type ENUM('agency', 'walk-in') 
NOT NULL DEFAULT 'walk-in';

-- Set existing donors to 'agency' type
UPDATE donors 
SET donor_type = 'agency' 
WHERE agency_id IS NOT NULL;