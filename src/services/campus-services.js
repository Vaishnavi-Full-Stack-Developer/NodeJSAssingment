const pool = require('../config/db');

const getCampuses = async (page, limit) => {
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT *
    FROM campus
    ORDER BY id
    LIMIT $1 OFFSET $2
  `;

  const countQuery = `SELECT COUNT(*) FROM campus`;

  const dataResult = await pool.query(dataQuery, [limit, offset]);
  const countResult = await pool.query(countQuery);

  return {
    page,
    limit,
    totalRecords: parseInt(countResult.rows[0].count),
    totalPages: Math.ceil(countResult.rows[0].count / limit),
    data: dataResult.rows
  };
};

module.exports = { getCampuses };
