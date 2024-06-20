const { getAllLaunches, scheduleLaunch, launchExistsId, abortLaunchById, } = require('../../models/launchesModel');
const  setPagination  = require('../../utils/query');

async function httpgetAllLaunches(req, res) {
  const { limit, skip } = await setPagination(req.query)
  return res.status(200).json(await getAllLaunches(limit, skip));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.target
    || !launch.launchDate) {
      return res.status(400).json({
        error: 'Missing required launch property',
      })
    }

  launch.launchDate = await new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    })
  }
  await scheduleLaunch(launch);
  return res.status(201).json(launch);

}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existLaunch = await launchExistsId(launchId);
  if (!existLaunch) {
    return res.status(404).json({
      Error : 'There is no launch with this Id.'
    })
  }
  const aborted = await abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

async function httpGetLaunchById(req, res) {
  const launchId = Number(req.params.id);
  const pickedLaunch =  await launchExistsId(launchId);
  return res.status(200).json(pickedLaunch);
}

module.exports = {
  httpAddNewLaunch,
  httpgetAllLaunches,
  httpAbortLaunch,
  httpGetLaunchById,
}