const express = require('express');
const {
  httpgetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
  httpGetLaunchById,
} = require('./launchesController');

const launchesRouter = express.Router();

launchesRouter.get('/', httpgetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);
launchesRouter.get('/:id', httpGetLaunchById);


module.exports = {
  launchesRouter,
}