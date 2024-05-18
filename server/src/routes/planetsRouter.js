const express = require('express');
const { httpgetAllPlanets } = require('./planetsController');

const planetsRouter = express.Router();

planetsRouter.get('/', httpgetAllPlanets);

module.exports = {
  planetsRouter,
}