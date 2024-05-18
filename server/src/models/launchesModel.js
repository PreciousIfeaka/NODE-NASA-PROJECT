const launches = new Map();
let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA', 'SPACE X'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function launchExistsId(launchId) {
  return launches.has(launchId);
}

function addNewLaunch(launch) {
  latestFlightNumber += 1;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      upcoming: true,
      success: true,
      customer: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;

}

module.exports = {
  addNewLaunch,
  getAllLaunches,
  launchExistsId,
  abortLaunchById,
}