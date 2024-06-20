const launches = require("./launches.schema");
const planets = require("./planets.schema");
const axios = require('axios');

// const DEFAULT_FLIGHT_NUMBER = 100;
const LAUNCHES_URL = 'https://api.spacexdata.com/v4/launches/query';


async function findFirstLaunch(filter) {
  return await launches.findOne({filter});
}

async function loadLaunchesData() {
  const firstLaunch = await findFirstLaunch({
    flightNumber: 1,
    mission: 'FalconSat',
    rocket: 'Falcon 1',
  })
  if (firstLaunch) {
    console.log('Launches are already loaded, no need to query api');
    return;
  }

  const response = await axios.post(LAUNCHES_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1
          }
        },
        {
          path: "payloads",
          select: {
            customers: 1
          }
        }
      ]
    }
  });
  if (response.status !== 200) {
    console.log('Error occured while loading the launches');
    throw new Error('Launch data download failed');
  } else {
    (response.data.docs).forEach(async (res) => {
      const launch = {
        flightNumber: res.flight_number,
        mission: res.name,
        rocket: res.rocket.name,
        launchDate: res.date_local,
        upcoming: res.upcoming,
        success: res.success
      }

      if (res.payloads[0]) {
        launch.customers = res.payloads[0].customers
      } else {launch.customers = res.payloads}


      await saveLaunch(launch);
    });
  }
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}

async function launchExistsId(launchId) {
  return await launches.findOne({
    flightNumber: launchId
  })
}

async function getLatestLaunchNumber() {
  const latestLaunch = await launches
    .findOne({})
    .sort('-flightNumber');
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  } else { return latestLaunch; } 
}

async function scheduleLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });
  if (!planet) {throw new Error('Planet with this ID does not exist');}

  const latestFlightNumber = (await getLatestLaunchNumber()).flightNumber;
    const newLaunch = Object.assign(launch, {
      upcoming: true,
      success: true,
      customer: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber + 1,
    }
  );
  await saveLaunch(newLaunch);
};

async function getAllLaunches(limit, skip) {
  const allLaunches = await launches.find({}, {
    "_id": 0, "__v": 0,
  }).sort("flightNumber")
    .limit(limit)
    .skip(skip);
  return allLaunches;
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({
    flightNumber: launchId,
  }, {
    $set: {upcoming: false, success: false}
  }, {
      upsert: false
    }
  );
    return aborted.modifiedCount === 1 && aborted.matchedCount === 1;
}

module.exports = {
  loadLaunchesData,
  scheduleLaunch,
  getAllLaunches,
  launchExistsId,
  abortLaunchById,
}