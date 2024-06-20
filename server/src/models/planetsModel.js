const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planets = require('./planets.schema');

function isHabitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
      && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
      && planet['koi_prad'] < 1.6;
    }

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    .pipe(parse({
      comment: '#',
      columns: true,
    }))
    .on('data', (data) => {
      if (isHabitable(data)) {
        savePlanet(data);
      }})
    .on('error', (error) => {
      console.log(error);
      reject(error);
    })
    .on('end', async () => {
      const countHabitablePlanets = (await getAllPlanets()).length;
      console.log(`${countHabitablePlanets} habitable planets found!`);
      resolve();
      });
    });
};

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    });
  } catch (err) {
    console.log(err.message);
  }
};

async function getAllPlanets() {
  return await planets.find({}, {
    "_id": 0, "__v": 0,
  });
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};