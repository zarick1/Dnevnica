const pool = require('../db/pool');

async function createAd(req, res) {
  try {
    const { type, title, description, city, pay, contact_name, contact_phone } =
      req.body;

    // ===== MINIMAL VALIDATION ====
    if (!type || !['employer', 'worker'].includes(type)) {
      return res.status(400).json({
        status: 'fail',
        message: "Field 'type' is required and must be 'employer' or 'worker'.",
      });
    }

    if (!title) {
      return res.status(400).json({
        status: 'fail',
        message: "Field 'title' is required.",
      });
    }

    if (!description) {
      return res.status(400).json({
        status: 'fail',
        message: "Field 'description' is required",
      });
    }

    if (!contact_name) {
      return res.status(400).json({
        status: 'fail',
        message: "Field 'contact_name' is required",
      });
    }

    // ===== INSERT INTO DB =====
    const insertQuery = `
      INSERT INTO ads (type, title, description, city, pay, contact_name, contact_phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      type,
      title,
      description,
      city,
      pay,
      contact_name,
      contact_phone,
    ];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({
      status: 'success',
      results: result.rows.length,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating ad: ', err);
    res.status(500).json({
      message: 'Failed to create ad',
    });
  }
}

module.exports = {
  createAd,
};
