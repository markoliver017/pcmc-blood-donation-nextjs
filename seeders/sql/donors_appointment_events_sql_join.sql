USE blood_donation_db;
SELECT D.id as donor_id, U.id AS user_id, U.email, U.name, events.title, events.date AS event_date, events.status
FROM users AS U
RIGHT JOIN donors AS D ON U.id = D.user_id
LEFT JOIN donor_appointment_infos AS appointment ON D.id = appointment.donor_id
LEFT JOIN blood_donation_events AS events ON appointment.event_id = events.id