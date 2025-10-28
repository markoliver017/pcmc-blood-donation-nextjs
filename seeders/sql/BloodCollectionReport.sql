SELECT donors.donor_reference_id, collection.id AS collection_id, event.title, agencies.name AS agency_name
FROM blood_donation_db.blood_donation_collections AS collection
LEFT JOIN donors ON donors.id = collection.donor_id
LEFT JOIN blood_donation_events AS event ON event.id = collection.event_id
LEFT JOIN agencies ON agencies.id = event.agency_id
;