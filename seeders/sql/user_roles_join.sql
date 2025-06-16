USE blood_donation_db;
SELECT U.id, U.email, role.role_name, roles.is_active FROM users AS U
LEFT JOIN user_roles AS roles ON U.id = roles.user_id
LEFT JOIN roles AS role ON roles.role_id = role.id
-- WHERE U.id = "207ac622-41c8-4f4d-948d-419bd6c0a795"
