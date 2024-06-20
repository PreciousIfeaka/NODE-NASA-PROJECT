const PORT = process.env.PORT || 8000;
const http = require('http');
const app = require('./app');

const connectDatabase = require('./utils/mongo');
const { loadPlanetsData } = require('./models/planetsModel');
const { loadLaunchesData } = require('./models/launchesModel');

const server = http.createServer(app);
async function startServer() {
  await connectDatabase();
  await loadLaunchesData();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  })
}

startServer();
