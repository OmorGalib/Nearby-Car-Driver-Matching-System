// Haversine formula implementation
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

// SQL-based distance calculation for database queries
const getDistanceQuery = (lat, lng, radius) => {
  return `
    SELECT 
      d.*,
      c.model as car_model,
      c.plate_number,
      c.color,
      c.year,
      (
        6371 * acos(
          cos(radians(${lat})) * 
          cos(radians(d.current_lat)) * 
          cos(radians(d.current_lng) - radians(${lng})) + 
          sin(radians(${lat})) * 
          sin(radians(d.current_lat))
        )
      ) AS distance
    FROM "Drivers" d
    LEFT JOIN "Cars" c ON d.id = c.driver_id
    WHERE d.is_available = true
      AND (
        6371 * acos(
          cos(radians(${lat})) * 
          cos(radians(d.current_lat)) * 
          cos(radians(d.current_lng) - radians(${lng})) + 
          sin(radians(${lat})) * 
          sin(radians(d.current_lat))
        )
      ) <= ${radius}
    ORDER BY distance ASC
  `;
};

module.exports = {
  calculateDistance,
  getDistanceQuery
};
