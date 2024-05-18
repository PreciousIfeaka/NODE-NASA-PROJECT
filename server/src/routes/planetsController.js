const { getAllPlanets } = require('../models/planetsModel');

function httpgetAllPlanets(req, res) {
  return res.status(200).json(getAllPlanets());
}

module.exports = {
  httpgetAllPlanets,
}