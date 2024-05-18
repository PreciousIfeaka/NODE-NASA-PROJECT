const express = require('express');
const {
  httpgetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require('./launchesController');

const launchesRouter = express.Router();

launchesRouter.get('/', httpgetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);


module.exports = {
  launchesRouter,
}