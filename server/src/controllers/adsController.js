const pool = require('../db/pool');

// TODO: Replace manual validation with Zod schema validation (createAdSchema)
// TODO: Extract validation layer into middleware for cleaner controllers
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

async function getAllAds(req, res) {
  try {
    const query = `
      SELECT *
      FROM ads
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query);
    console.log(result);
    console.log(result.rows);

    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error('Error fetching ads: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch ads',
    });
  }
}

async function getAdById(req, res) {
  try {
    const { id } = req.params;

    const parsedId = Number(id);
    if (Number.isNaN(parsedId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Ad id must be a number',
      });
    }

    const query = `
      SELECT *
      FROM ads
      WHERE id = $1
    `;

    const result = await pool.query(query, [parsedId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Ad with id ${parsedId} not found`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error fetcing ad by id: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch ad',
    });
  }
}

async function updateAd(req, res) {
  try {
    const { id } = req.params;

    const parsedId = Number(id);
    if (Number.isNaN(parsedId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Ad id must be a number',
      });
    }

    const findQuery = `
      SELECT *
      FROM ads
      WHERE id = $1;
    `;

    const findResult = await pool.query(findQuery, [parsedId]);

    if (findResult.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Ad witd id ${parsedId} not found`,
      });
    }

    const existingAd = findResult.rows[0];

    const { type, title, description, city, pay, contact_name, contact_phone } =
      req.body;

    const updatedType = type ?? existingAd.type;
    const updatedTitle = title ?? existingAd.title;
    const updatedDescription = description ?? existingAd.description;
    const updatedCity = city ?? existingAd.city;
    const updatedPay = pay ?? existingAd.pay;
    const updatedContactName = contact_name ?? existingAd.contact_name;
    const updatedContactPhone = contact_phone ?? existingAd.contact_phone;

    if (!updatedType || !['employer', 'worker'].includes(updatedType)) {
      return res.status(400).json({
        status: 'fail',
        message: "Field 'type' must be 'employer' or 'worker' if provided",
      });
    }

    const updateQuery = `
      UPDATE ads
      SET
        type = $1,
        title = $2,
        description = $3,
        city = $4,
        pay = $5,
        contact_name = $6,
        contact_phone = $7
      WHERE id = $8
      RETURNING *;
    `;

    const values = [
      updatedType,
      updatedTitle,
      updatedDescription,
      updatedCity,
      updatedPay,
      updatedContactName,
      updatedContactPhone,
      parsedId,
    ];

    const updatedResult = await pool.query(updateQuery, values);

    return res.status(200).json({
      status: 'success',
      data: updatedResult.rows[0],
    });
  } catch (err) {
    console.error('Error updating ad: ', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update ad',
    });
  }
}

async function deleteAd(req, res) {
  try {
    const { id } = req.params;

    const parsedId = Number(id);

    if (Number.isNaN(parsedId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Ad id must be a number',
      });
    }

    const query = `
      DELETE FROM ads
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [parsedId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Ad with id ${parsedId} not found`,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Ad with id ${parsedId} deleted`,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error deleting ad: ', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete ad',
    });
  }
}

module.exports = {
  createAd,
  getAllAds,
  getAdById,
  updateAd,
  deleteAd,
};
