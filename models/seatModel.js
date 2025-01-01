const pool = require('../config/db');

const getSeats = async () => {
  const result = await pool.query('SELECT * FROM seats ORDER BY id');
  return result.rows;
};

const reserveSeats = async (seatIds, userId) => {
  const query = `
    UPDATE seats 
    SET reserved = true, reserved_by = $1, reserved_at = NOW() 
    WHERE id = ANY($2::int[]) RETURNING *;
  `;
  const result = await pool.query(query, [userId, seatIds]);
  return result.rows;
};

const cancelReservation = async (seatIds) => {
  const query = `
    UPDATE seats 
    SET reserved = false, reserved_by = NULL, reserved_at = NULL
    WHERE id = ANY($1::int[]) RETURNING *;
  `;
  const result = await pool.query(query, [seatIds]);
  return result.rows;
};

module.exports = { getSeats, reserveSeats, cancelReservation };
