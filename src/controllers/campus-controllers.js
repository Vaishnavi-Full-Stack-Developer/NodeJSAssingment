const campusService = require('../services/campus-services');

const getCampuses = async (req, res) => {
  try {
    // READ FROM PARAMS
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);

    const result = await campusService.getCampuses(page, limit);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const test = (req, res) => {
  res.send('Campus API working');
};

module.exports = {
  getCampuses,
  test
};
